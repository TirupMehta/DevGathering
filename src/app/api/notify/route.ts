import { NextRequest, NextResponse } from 'next/server';
import { notifyFormSchema, validateForm } from '@/lib/validation';
import { sendAdminNotification, sendUserAcknowledgment } from '@/lib/email';
import { logEvent, logError } from '@/lib/logger';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        // Get client IP for logging (hashed)
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
        const validation = validateForm(notifyFormSchema, body);

        if (!validation.success) {
            logEvent('validation_failed', { type: 'notify', errors: validation.errors }, ip);
            return NextResponse.json(
                { error: 'Validation failed', errors: validation.errors },
                { status: 400 }
            );
        }

        const { email } = validation.data;

        // Save to Supabase
        const supabase = getSupabaseClient();
        if (supabase) {
            const { error: dbError } = await supabase
                .from('subscribers')
                .upsert(
                    { email, is_active: true, subscribed_at: new Date().toISOString() },
                    { onConflict: 'email' }
                );

            if (dbError) {
                logError(dbError, { context: 'save_subscriber', email });
                // Don't fail - still log and send emails
            }
        }

        // Log the submission
        logEvent('notify_submit', { email }, ip);

        // Send notification to admin (optional - don't fail if email not configured)
        try {
            await sendAdminNotification('notify', { email });
        } catch (emailError) {
            logError(emailError, { context: 'admin_notification', email });
        }

        // Send acknowledgment to user (optional)
        try {
            await sendUserAcknowledgment(email, 'notify');
        } catch (emailError) {
            logError(emailError, { context: 'user_acknowledgment', email });
        }

        return NextResponse.json(
            { success: true, message: 'Email registered successfully' },
            { status: 200 }
        );
    } catch (error) {
        logError(error, { route: '/api/notify' });

        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
