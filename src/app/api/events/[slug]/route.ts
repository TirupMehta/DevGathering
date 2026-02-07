import { NextRequest, NextResponse } from 'next/server';
import { getEventBySlug } from '@/lib/supabase';

// GET - Return single event by slug (public)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { error: 'Event slug is required' },
                { status: 400 }
            );
        }

        const event = await getEventBySlug(slug);

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        // Only return published events to public
        if (!event.is_published) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ event }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch event:', error);
        return NextResponse.json(
            { error: 'Failed to fetch event' },
            { status: 500 }
        );
    }
}
