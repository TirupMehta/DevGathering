import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { getRSVPsByEvent, approveRSVP, rejectRSVP, getRSVPWithEvent } from '@/lib/supabase';
import { sendRSVPInvitation } from '@/lib/email';
import { logEvent, logError } from '@/lib/logger';

// GET - Get RSVPs by event ID (admin only)
export async function GET(request: NextRequest) {
    try {
        const isValid = await validateSession();
        if (!isValid) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');

        if (!eventId) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        const rsvps = await getRSVPsByEvent(eventId);

        return NextResponse.json({ rsvps }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch RSVPs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch RSVPs' },
            { status: 500 }
        );
    }
}

// PATCH - Approve or reject RSVP (admin only)
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
        const { rsvpId, action } = body;

        if (!rsvpId || !action) {
            return NextResponse.json(
                { error: 'RSVP ID and action are required' },
                { status: 400 }
            );
        }

        if (action === 'approve') {
            const result = await approveRSVP(rsvpId);

            if (!result.success) {
                return NextResponse.json(
                    { error: result.error },
                    { status: 400 }
                );
            }

            // Send invitation email (don't fail if email fails)
            let emailSent = false;
            let emailError = '';
            try {
                const rsvpData = await getRSVPWithEvent(rsvpId);
                if (rsvpData) {
                    const emailResult = await sendRSVPInvitation(rsvpData.rsvp, rsvpData.event);
                    emailSent = emailResult.success;
                    if (!emailResult.success) {
                        emailError = emailResult.error || 'Email failed';
                    }
                    if (emailSent) {
                        logEvent('rsvp_invitation_sent', { rsvpId, email: rsvpData.rsvp.email }, ip);
                    }
                }
            } catch (err) {
                const errMsg = err instanceof Error ? err.message : 'Unknown error';
                emailError = errMsg;
                logError(err, { context: 'send_rsvp_invitation', rsvpId });
            }

            logEvent('rsvp_approved', { rsvpId, emailSent }, ip);

            return NextResponse.json({
                success: true,
                message: emailSent
                    ? 'RSVP approved and invitation sent'
                    : `RSVP approved (email failed: ${emailError})`,
                emailSent
            });
        }

        if (action === 'reject') {
            const result = await rejectRSVP(rsvpId);

            if (!result.success) {
                return NextResponse.json(
                    { error: result.error },
                    { status: 400 }
                );
            }

            logEvent('rsvp_rejected', { rsvpId }, ip);

            return NextResponse.json({
                success: true,
                message: 'RSVP rejected'
            });
        }

        if (action === 'resend_email') {
            // Resend email for already-approved RSVPs
            let emailSent = false;
            let emailError = '';

            try {
                const rsvpData = await getRSVPWithEvent(rsvpId);
                if (!rsvpData) {
                    return NextResponse.json(
                        { error: 'RSVP not found' },
                        { status: 404 }
                    );
                }

                const emailResult = await sendRSVPInvitation(rsvpData.rsvp, rsvpData.event);
                emailSent = emailResult.success;
                if (!emailResult.success) {
                    emailError = emailResult.error || 'Email failed';
                }
                if (emailSent) {
                    logEvent('rsvp_invitation_resent', { rsvpId, email: rsvpData.rsvp.email }, ip);
                }
            } catch (err) {
                const errMsg = err instanceof Error ? err.message : 'Unknown error';
                emailError = errMsg;
                logError(err, { context: 'resend_rsvp_invitation', rsvpId });
            }

            return NextResponse.json({
                success: true,
                message: emailSent ? 'Email resent successfully' : `Email failed: ${emailError}`,
                emailSent
            });
        }

        return NextResponse.json(
            { error: 'Invalid action. Use "approve", "reject", or "resend_email"' },
            { status: 400 }
        );
    } catch (error) {
        logError(error, { route: '/api/admin/rsvp', action: 'patch' });
        return NextResponse.json(
            { error: 'Failed to update RSVP' },
            { status: 500 }
        );
    }
}
