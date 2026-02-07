import { NextRequest, NextResponse } from 'next/server';
import { requestFormSchema, validateForm } from '@/lib/validation';
import { sendAdminNotification, sendUserAcknowledgment } from '@/lib/email';
import { logEvent, logError } from '@/lib/logger';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        // Get client IP for logging
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

        // Parse request body
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        // Validate input
        const validation = validateForm(requestFormSchema, body);

        if (!validation.success) {
            logEvent('validation_failed', { type: 'request', errors: validation.errors }, ip);
            return NextResponse.json(
                { error: 'Validation failed', errors: validation.errors },
                { status: 400 }
            );
        }

        const { name, email, city, role, reason } = validation.data;

        // Save to Supabase
        const supabase = getSupabaseClient();
        if (supabase) {
            const { error: dbError } = await supabase
                .from('city_requests')
                .insert({
                    name,
                    email,
                    city,
                    role,
                    reason: reason || null,
                    created_at: new Date().toISOString()
                });

            if (dbError) {
                logError(dbError, { context: 'save_city_request', email, city });
                // Don't fail - still log and send emails
            }

            // Also add them as a subscriber
            await supabase
                .from('subscribers')
                .upsert(
                    { email, is_active: true, subscribed_at: new Date().toISOString() },
                    { onConflict: 'email' }
                );
        }

        // Log the submission
        logEvent('request_submit', { name, email, city, role }, ip);

        // Send notification to admin
        try {
            await sendAdminNotification('request', { name, email, city, role, reason: reason || '' });
        } catch (emailError) {
            logError(emailError, { context: 'admin_notification', email });
        }

        // Send acknowledgment to user
        try {
            await sendUserAcknowledgment(email, 'request');
        } catch (emailError) {
            logError(emailError, { context: 'user_acknowledgment', email });
        }

        return NextResponse.json(
            { success: true, message: 'Request submitted successfully' },
            { status: 200 }
        );
    } catch (error) {
        logError(error, { route: '/api/request' });

        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
