import { NextRequest, NextResponse } from 'next/server';
import { createRSVP, getEventBySlug } from '@/lib/supabase';
import { logEvent, logError } from '@/lib/logger';

// POST - Submit RSVP
export async function POST(request: NextRequest) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    try {
        const body = await request.json();

        const { eventId, eventSlug, name, email, phone, company, role, linkedinUrl, message } = body;

        // Validate required fields
        if (!eventId || !name || !email) {
            return NextResponse.json(
                { error: 'Event ID, name, and email are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Verify event exists and is published
        if (eventSlug) {
            const event = await getEventBySlug(eventSlug);
            if (!event || !event.is_published) {
                return NextResponse.json(
                    { error: 'Event not found or not accepting RSVPs' },
                    { status: 404 }
                );
            }
        }

        // Create RSVP
        const result = await createRSVP({
            eventId,
            name,
            email,
            phone,
            company,
            role,
            linkedinUrl,
            message
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        logEvent('rsvp_submitted', { eventId, email }, ip);

        return NextResponse.json(
            {
                success: true,
                message: 'RSVP submitted successfully. You will receive a confirmation email once approved.',
                rsvp: result.rsvp
            },
            { status: 201 }
        );
    } catch (error) {
        logError(error, { route: '/api/rsvp', action: 'create' });
        return NextResponse.json(
            { error: 'Failed to submit RSVP' },
            { status: 500 }
        );
    }
}
