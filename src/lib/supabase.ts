import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Factory pattern: returns null until explicitly initialized
let supabaseClient: SupabaseClient | null = null;

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
    return !!(
        process.env.SUPABASE_URL &&
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
}

// Get Supabase client - only created when needed
export function getSupabaseClient(): SupabaseClient | null {
    if (!isSupabaseConfigured()) {
        return null;
    }

    if (!supabaseClient) {
        supabaseClient = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );
    }

    return supabaseClient;
}

interface CreateEventResult {
    success: boolean;
    error?: string;
    event?: {
        id: string;
        slug: string;
        name: string;
    };
}

interface EventData {
    slug: string;
    name: string;
    description?: string;
    city?: string;
    venue?: string;
    eventDate?: string;
    capacity?: number;
    isPublished?: boolean;
}

// Create a new event
export async function createEvent(data: EventData): Promise<CreateEventResult> {
    const client = getSupabaseClient();

    if (!client) {
        return {
            success: false,
            error: 'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
        };
    }

    // Validate slug format server-side (extra safety)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(data.slug)) {
        return {
            success: false,
            error: 'Invalid event slug format.',
        };
    }

    try {
        const { data: event, error } = await client
            .from('events')
            .insert({
                slug: data.slug,
                name: data.name,
                description: data.description || null,
                city: data.city || null,
                venue: data.venue || null,
                event_date: data.eventDate || null,
                capacity: data.capacity || null,
                is_published: data.isPublished || false,
                created_at: new Date().toISOString(),
            })
            .select('id, slug, name')
            .single();

        if (error) {
            if (error.code === '23505') {
                return { success: false, error: 'Event with this slug already exists.' };
            }
            throw error;
        }

        return { success: true, event };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create event';
        console.error('Supabase event creation error:', message);

        return {
            success: false,
            error: 'Failed to create event. Please check Supabase configuration and try again.',
        };
    }
}

// Update an existing event
export async function updateEvent(data: {
    id: string;
    slug?: string;
    name?: string;
    description?: string;
    city?: string;
    venue?: string;
    eventDate?: string;
    capacity?: number | null;
}): Promise<CreateEventResult> {
    const client = getSupabaseClient();

    if (!client) {
        return { success: false, error: 'Supabase not configured' };
    }

    try {
        const updateData: Record<string, unknown> = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.slug !== undefined) updateData.slug = data.slug;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.city !== undefined) updateData.city = data.city;
        if (data.venue !== undefined) updateData.venue = data.venue;
        if (data.eventDate !== undefined) updateData.event_date = data.eventDate;
        if (data.capacity !== undefined) updateData.capacity = data.capacity;

        const { data: event, error } = await client
            .from('events')
            .update(updateData)
            .eq('id', data.id)
            .select('id, slug, name')
            .single();

        if (error) {
            if (error.code === '23505') {
                return { success: false, error: 'Event with this slug already exists.' };
            }
            throw error;
        }

        return { success: true, event };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update event';
        console.error('Supabase event update error:', message);

        return {
            success: false,
            error: 'Failed to update event. Please try again.',
        };
    }
}

// Delete an event (admin only)
export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    const client = getSupabaseClient();

    if (!client) {
        return { success: false, error: 'Supabase not configured' };
    }

    try {
        const { error } = await client
            .from('events')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete event';
        console.error('Supabase event delete error:', message);

        return {
            success: false,
            error: 'Failed to delete event. Please try again.',
        };
    }
}

// Fetch all events (for admin dashboard)
export async function getEvents(): Promise<{ id: string; slug: string; name: string; city: string; event_date: string; is_published: boolean; created_at: string }[]> {
    const client = getSupabaseClient();

    if (!client) {
        return [];
    }

    try {
        const { data, error } = await client
            .from('events')
            .select('id, slug, name, city, event_date, is_published, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Failed to fetch events:', error);
            return [];
        }

        return data || [];
    } catch {
        return [];
    }
}

// Publish event and notify subscribers
export async function publishEvent(slug: string): Promise<CreateEventResult> {
    const client = getSupabaseClient();

    if (!client) {
        return { success: false, error: 'Supabase is not configured.' };
    }

    try {
        const { data: event, error } = await client
            .from('events')
            .update({ is_published: true })
            .eq('slug', slug)
            .select('id, slug, name, city, event_date')
            .single();

        if (error) {
            throw error;
        }

        return { success: true, event };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to publish event';
        return { success: false, error: message };
    }
}

// Get subscriber count
export async function getSubscriberCount(): Promise<number> {
    const client = getSupabaseClient();

    if (!client) {
        return 0;
    }

    try {
        const { count, error } = await client
            .from('subscribers')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);

        if (error) {
            return 0;
        }

        return count || 0;
    } catch {
        return 0;
    }
}



// Get all published events (public)
export async function getPublishedEvents(): Promise<{
    id: string;
    slug: string;
    name: string;
    description: string | null;
    city: string | null;
    venue: string | null;
    event_date: string | null;
    capacity: number | null;
}[]> {
    const client = getSupabaseClient();

    if (!client) {
        return [];
    }

    try {
        const { data, error } = await client
            .from('events')
            .select('id, slug, name, description, city, venue, event_date, capacity')
            .eq('is_published', true)
            .order('event_date', { ascending: true });

        if (error) {
            console.error('Failed to fetch published events:', error);
            return [];
        }

        return data || [];
    } catch {
        return [];
    }
}

// Get single event by slug (public)
export async function getEventBySlug(slug: string): Promise<{
    id: string;
    slug: string;
    name: string;
    description: string | null;
    city: string | null;
    venue: string | null;
    event_date: string | null;
    capacity: number | null;
    is_published: boolean;
} | null> {
    const client = getSupabaseClient();

    if (!client) {
        return null;
    }

    try {
        const { data, error } = await client
            .from('events')
            .select('id, slug, name, description, city, venue, event_date, capacity, is_published')
            .eq('slug', slug)
            .single();

        if (error) {
            return null;
        }

        return data;
    } catch {
        return null;
    }
}

// RSVP Types
interface RSVPData {
    eventId: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    role?: string;
    linkedinUrl?: string;
    message?: string;
}

interface RSVPResult {
    success: boolean;
    error?: string;
    rsvp?: {
        id: string;
        status: string;
    };
}

// Create RSVP
export async function createRSVP(data: RSVPData): Promise<RSVPResult> {
    const client = getSupabaseClient();

    if (!client) {
        return { success: false, error: 'Supabase is not configured.' };
    }

    try {
        const { data: rsvp, error } = await client
            .from('rsvps')
            .insert({
                event_id: data.eventId,
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                company: data.company || null,
                role: data.role || null,
                linkedin_url: data.linkedinUrl || null,
                message: data.message || null,
                status: 'pending',
                created_at: new Date().toISOString(),
            })
            .select('id, status')
            .single();

        if (error) {
            if (error.code === '23505') {
                return { success: false, error: 'You have already submitted an RSVP for this event.' };
            }
            throw error;
        }

        return { success: true, rsvp };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to submit RSVP';
        console.error('RSVP creation error:', message);
        return { success: false, error: message };
    }
}

// Get RSVPs by event (admin)
export async function getRSVPsByEvent(eventId: string): Promise<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    role: string | null;
    linkedin_url: string | null;
    message: string | null;
    status: string;
    created_at: string;
    approved_at: string | null;
}[]> {
    const client = getSupabaseClient();

    if (!client) {
        return [];
    }

    try {
        const { data, error } = await client
            .from('rsvps')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Failed to fetch RSVPs:', error);
            return [];
        }

        return data || [];
    } catch {
        return [];
    }
}

// Approve RSVP
export async function approveRSVP(rsvpId: string): Promise<RSVPResult & { rsvp?: { id: string; name: string; email: string; status: string } }> {
    const client = getSupabaseClient();

    if (!client) {
        return { success: false, error: 'Supabase is not configured.' };
    }

    try {
        const { data: rsvp, error } = await client
            .from('rsvps')
            .update({
                status: 'approved',
                approved_at: new Date().toISOString()
            })
            .eq('id', rsvpId)
            .select('id, name, email, status')
            .single();

        if (error) {
            throw error;
        }

        return { success: true, rsvp };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to approve RSVP';
        return { success: false, error: message };
    }
}

// Reject RSVP
export async function rejectRSVP(rsvpId: string): Promise<RSVPResult> {
    const client = getSupabaseClient();

    if (!client) {
        return { success: false, error: 'Supabase is not configured.' };
    }

    try {
        const { data: rsvp, error } = await client
            .from('rsvps')
            .update({ status: 'rejected' })
            .eq('id', rsvpId)
            .select('id, status')
            .single();

        if (error) {
            throw error;
        }

        return { success: true, rsvp };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to reject RSVP';
        return { success: false, error: message };
    }
}

// Get RSVP with event details (for email)
export async function getRSVPWithEvent(rsvpId: string): Promise<{
    rsvp: { id: string; name: string; email: string };
    event: { name: string; city: string; venue: string; event_date: string; slug: string };
} | null> {
    const client = getSupabaseClient();

    if (!client) {
        return null;
    }

    try {
        const { data, error } = await client
            .from('rsvps')
            .select(`
                id, name, email,
                events:event_id (name, city, venue, event_date, slug)
            `)
            .eq('id', rsvpId)
            .single();

        if (error || !data) {
            return null;
        }

        const eventData = Array.isArray(data.events) ? data.events[0] : data.events;

        if (!eventData) {
            return null;
        }

        return {
            rsvp: { id: data.id, name: data.name, email: data.email },
            event: {
                name: eventData.name,
                city: eventData.city,
                venue: eventData.venue,
                event_date: eventData.event_date,
                slug: eventData.slug
            }
        };
    } catch {
        return null;
    }
}

// Legacy alias for backward compatibility
export const createEventTable = createEvent;

