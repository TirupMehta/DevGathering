import { NextResponse } from 'next/server';
import { getPublishedEvents } from '@/lib/supabase';

// GET - Return all published events (public)
export async function GET() {
    try {
        const events = await getPublishedEvents();

        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}
