import { NextRequest, NextResponse } from 'next/server';
import { createEventSchema, validateForm } from '@/lib/validation';
import { validateSession, reAuthenticate } from '@/lib/auth';
import { createEvent, getEvents, publishEvent, getSubscriberCount, updateEvent, deleteEvent } from '@/lib/supabase';
import { notifySubscribersAboutEvent } from '@/lib/email';
import { logEvent, logError } from '@/lib/logger';

// GET - List all events
export async function GET() {
    try {
        // Validate session
        const isValid = await validateSession();
        if (!isValid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const events = await getEvents();
        const subscriberCount = await getSubscriberCount();

        return NextResponse.json(
            { events, subscriberCount },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get events error:', error);

        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}

// POST - Create new event
export async function POST(request: NextRequest) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    try {
        // Validate session first
        const isValid = await validateSession();
        if (!isValid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse request body
        let body: {
            slug?: string;
            name?: string;
            description?: string;
            city?: string;
            venue?: string;
            eventDate?: string;
            capacity?: number;
            password?: string;
            notifySubscribers?: boolean;
        };
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        // Re-authenticate for this sensitive operation
        if (!body.password) {
            return NextResponse.json(
                { error: 'Re-authentication required' },
                { status: 403 }
            );
        }

        const reAuthValid = await reAuthenticate(body.password);
        if (!reAuthValid) {
            logEvent('admin_login_failed', { context: 're-auth for event creation' }, ip);
            return NextResponse.json(
                { error: 'Re-authentication failed' },
                { status: 403 }
            );
        }

        // Validate event data
        const validation = validateForm(createEventSchema, {
            slug: body.slug,
            name: body.name,
            description: body.description,
        });

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', errors: validation.errors },
                { status: 400 }
            );
        }

        const { slug, name, description } = validation.data;

        // Create event in Supabase
        const result = await createEvent({
            slug,
            name,
            description,
            city: body.city,
            venue: body.venue,
            eventDate: body.eventDate,
            capacity: body.capacity,
            isPublished: body.notifySubscribers || false, // If notifying, it's published
        });

        if (!result.success) {
            logEvent('event_creation_failed', { slug, error: result.error }, ip);
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        logEvent('event_created', { slug, name }, ip);

        // Notify subscribers if requested
        let notifiedCount = 0;
        if (body.notifySubscribers && body.city && body.eventDate) {
            try {
                const notifyResult = await notifySubscribersAboutEvent(
                    name,
                    slug,
                    body.city,
                    body.eventDate
                );
                notifiedCount = notifyResult.count || 0;
                logEvent('subscribers_notified', { slug, count: notifiedCount }, ip);
            } catch (emailError) {
                logError(emailError, { context: 'notify_subscribers', slug });
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Event created successfully',
                notifiedCount
            },
            { status: 201 }
        );
    } catch (error) {
        logError(error, { route: '/api/admin/events', action: 'create' });

        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}

// PATCH - Publish event and notify subscribers
export async function PATCH(request: NextRequest) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    try {
        const isValid = await validateSession();
        if (!isValid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { slug, action, password } = body;

        if (action === 'publish') {
            // Re-authenticate
            if (!password) {
                return NextResponse.json(
                    { error: 'Re-authentication required' },
                    { status: 403 }
                );
            }

            const reAuthValid = await reAuthenticate(password);
            if (!reAuthValid) {
                return NextResponse.json(
                    { error: 'Re-authentication failed' },
                    { status: 403 }
                );
            }

            // Publish event
            const result = await publishEvent(slug);
            if (!result.success) {
                return NextResponse.json(
                    { error: result.error },
                    { status: 500 }
                );
            }

            // Notify subscribers
            let notifiedCount = 0;
            if (result.event) {
                const event = result.event as unknown as { name: string; city: string; event_date: string };
                const notifyResult = await notifySubscribersAboutEvent(
                    event.name,
                    slug,
                    event.city || 'TBA',
                    event.event_date || 'TBA'
                );
                notifiedCount = notifyResult.count || 0;
                logEvent('event_published', { slug, notifiedCount }, ip);
            }

            return NextResponse.json({
                success: true,
                message: 'Event published and subscribers notified',
                notifiedCount
            });
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        logError(error, { route: '/api/admin/events', action: 'patch' });
        return NextResponse.json(
            { error: 'Failed to update event' },
            { status: 500 }
        );
    }
}

// PUT - Update event details
export async function PUT(request: NextRequest) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    try {
        const isValid = await validateSession();
        if (!isValid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, name, slug, city, venue, eventDate, capacity, description, password } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        // Re-authenticate
        if (!password) {
            return NextResponse.json(
                { error: 'Re-authentication required' },
                { status: 403 }
            );
        }

        const reAuthValid = await reAuthenticate(password);
        if (!reAuthValid) {
            return NextResponse.json(
                { error: 'Re-authentication failed' },
                { status: 403 }
            );
        }

        // Update event
        const result = await updateEvent({
            id,
            name,
            slug,
            city,
            venue,
            eventDate,
            capacity,
            description
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        logEvent('event_updated', { id, name }, ip);

        return NextResponse.json({
            success: true,
            message: 'Event updated successfully'
        });
    } catch (error) {
        logError(error, { route: '/api/admin/events', action: 'put' });
        return NextResponse.json(
            { error: 'Failed to update event' },
            { status: 500 }
        );
    }
}

// DELETE - Delete an event
export async function DELETE(request: NextRequest) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    try {
        const isValid = await validateSession();
        if (!isValid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, password } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        // Re-authenticate
        if (!password) {
            return NextResponse.json(
                { error: 'Re-authentication required' },
                { status: 403 }
            );
        }

        const reAuthValid = await reAuthenticate(password);
        if (!reAuthValid) {
            return NextResponse.json(
                { error: 'Re-authentication failed' },
                { status: 403 }
            );
        }

        // Delete event
        const result = await deleteEvent(id);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        logEvent('event_deleted', { id }, ip);

        return NextResponse.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        logError(error, { route: '/api/admin/events', action: 'delete' });
        return NextResponse.json(
            { error: 'Failed to delete event' },
            { status: 500 }
        );
    }
}
