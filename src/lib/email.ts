import { Resend } from 'resend';
import { getSupabaseClient } from './supabase';

// Lazy initialization - only create client when needed
let resendClient: Resend | null = null;

function getResendClient(): Resend {
    if (!resendClient) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not configured');
        }
        resendClient = new Resend(apiKey);
    }
    return resendClient;
}

interface EmailResult {
    success: boolean;
    error?: string;
    count?: number;
}

// --- Branded Email Template Generator ---

// Shared styles for email consistency
const styles = {
    body: 'background-color: #0D0D0D; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: #FAF8F5; margin: 0; padding: 0; width: 100%;',
    container: 'max-width: 600px; margin: 0 auto; background-color: #0D0D0D; padding: 40px 20px;',
    header: 'border-bottom: 1px solid #2D2D2D; padding-bottom: 30px; margin-bottom: 40px;',
    logo: 'font-size: 24px; font-weight: 700; color: #FAF8F5; letter-spacing: -0.02em; text-decoration: none;',
    h2: 'font-size: 32px; font-weight: 700; color: #FAF8F5; margin: 0 0 24px 0; letter-spacing: -0.03em; line-height: 1.1;',
    p: 'font-size: 16px; line-height: 1.6; color: #E5E0D8; margin: 0 0 24px 0;',
    accent: 'color: #FF6B35;',
    button: 'display: inline-block; background-color: #FAF8F5; color: #0D0D0D; padding: 16px 32px; font-weight: 600; text-decoration: none; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 10px; border-radius: 4px;',
    footer: 'margin-top: 60px; padding-top: 30px; border-top: 1px solid #2D2D2D; font-size: 12px; color: #666666; text-align: center;',
    table: 'width: 100%; border-collapse: collapse; margin: 24px 0;',
    tdLabel: 'padding: 12px 0; border-bottom: 1px solid #2D2D2D; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 120px;',
    tdValue: 'padding: 12px 0; border-bottom: 1px solid #2D2D2D; color: #FAF8F5; font-weight: 500;',
};

function getHtmlTemplate(title: string, bodyContent: string, showButton = false, buttonText = '', buttonUrl = ''): string {
    const siteUrl = process.env.SITE_URL || 'https://devgathering.in';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(title)}</title>
        <!--[if mso]>
        <style>
            table {border-collapse: collapse;}
            td {padding: 0;}
        </style>
        <![endif]-->
    </head>
    <body style="${styles.body}">
        <div style="${styles.container}">
            <!-- Header -->
            <div style="${styles.header}">
                <a href="${siteUrl}" style="${styles.logo}">
                    DEV GATHERING
                </a>
            </div>

            <!-- Content -->
            <h2 style="${styles.h2}">${title}</h2>
            ${bodyContent}

            ${showButton ? `
            <div style="margin-top: 32px; margin-bottom: 32px;">
                <a href="${buttonUrl}" style="${styles.button}">
                    ${buttonText} <span style="color: #FF6B35;">&rarr;</span>
                </a>
            </div>
            ` : ''}

            <!-- Footer -->
            <div style="${styles.footer}">
                <p style="margin: 0 0 10px 0;">Where Developers Connect.</p>
                <p style="margin: 0;">
                    &copy; ${new Date().getFullYear()} Dev Gathering. All rights reserved.
                </p>
                <p style="margin-top: 20px;">
                    <a href="${siteUrl}/unsubscribe" style="color: #444; text-decoration: underline;">Unsubscribe</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Send notification to admin about new form submission
export async function sendAdminNotification(
    type: 'notify' | 'request',
    data: Record<string, string>
): Promise<EmailResult> {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) {
            throw new Error('ADMIN_EMAIL is not configured');
        }

        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
        const client = getResendClient();

        const subject = type === 'notify'
            ? 'New Email Subscription - Dev Gathering'
            : 'New City Request - Dev Gathering';

        let bodyContent = '';

        if (type === 'notify') {
            bodyContent = `
                <p style="${styles.p}">A new user has subscribed for updates.</p>
                <table style="${styles.table}">
                    <tr>
                        <td style="${styles.tdLabel}">Email</td>
                        <td style="${styles.tdValue}">${escapeHtml(data.email)}</td>
                    </tr>
                    <tr>
                        <td style="${styles.tdLabel}">Date</td>
                        <td style="${styles.tdValue}">${new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                    </tr>
                </table>
            `;
        } else {
            bodyContent = `
                <p style="${styles.p}">A new city request has been submitted.</p>
                <table style="${styles.table}">
                    <tr>
                        <td style="${styles.tdLabel}">Name</td>
                        <td style="${styles.tdValue}">${escapeHtml(data.name)}</td>
                    </tr>
                    <tr>
                        <td style="${styles.tdLabel}">Email</td>
                        <td style="${styles.tdValue}">${escapeHtml(data.email)}</td>
                    </tr>
                    <tr>
                        <td style="${styles.tdLabel}">City</td>
                        <td style="${styles.tdValue}">${escapeHtml(data.city)}</td>
                    </tr>
                     <tr>
                        <td style="${styles.tdLabel}">Role</td>
                        <td style="${styles.tdValue}">${escapeHtml(data.role)}</td>
                    </tr>
                </table>
                <div style="margin-top: 24px; padding: 20px; background: #1A1A1A; border: 1px solid #2D2D2D; border-radius: 4px;">
                    <strong style="display: block; font-size: 12px; color: #888; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.1em;">Reason</strong>
                    <p style="margin: 0; color: #E5E0D8; line-height: 1.6;">${escapeHtml(data.reason)}</p>
                </div>
            `;
        }

        const htmlContent = getHtmlTemplate(
            type === 'notify' ? 'New Subscriber' : 'City Request',
            bodyContent,
            true,
            'Go to Admin Panel',
            `${process.env.SITE_URL || 'https://devgathering.in'}/admin`
        );

        await client.emails.send({
            from: fromEmail,
            to: adminEmail,
            subject,
            html: htmlContent,
        });

        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Email sending failed';
        console.error('Email error:', message);
        return { success: false, error: message };
    }
}

// Send acknowledgment to user
export async function sendUserAcknowledgment(
    email: string,
    type: 'notify' | 'request'
): Promise<EmailResult> {
    try {
        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
        const client = getResendClient();

        const subject = type === 'notify'
            ? 'Welcome to Dev Gathering'
            : 'We received your request';

        let title = '';
        let bodyContent = '';

        if (type === 'notify') {
            title = 'You\'re on the list.';
            bodyContent = `
                <p style="${styles.p}">
                    Thanks for joining <span style="${styles.accent}">Dev Gathering</span>.
                </p>
                <p style="${styles.p}">
                    We're building a community of developers who meet in person to connect, learn, and build together. No fluff, just code and community.
                </p>
                <p style="${styles.p}">
                    We'll notify you when the next event is announced in your area.
                </p>
            `;
        } else {
            title = 'We hear you.';
            bodyContent = `
                <p style="${styles.p}">
                    Thanks for requesting <span style="${styles.accent}">Dev Gathering</span> in your city.
                </p>
                <p style="${styles.p}">
                    We're rapidly expanding to new locations based on developer interest. Your vote helps us prioritize where to go next.
                </p>
                <p style="${styles.p}">
                    We'll review your request and get back to you soon.
                </p>
            `;
        }

        const htmlContent = getHtmlTemplate(
            title,
            bodyContent,
            true,
            'Visit Website',
            process.env.SITE_URL || 'https://devgathering.in'
        );

        await client.emails.send({
            from: fromEmail,
            to: email,
            subject,
            html: htmlContent,
        });

        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Email sending failed';
        console.error('Email error:', message);
        return { success: false, error: message };
    }
}

// Send event notification to all active subscribers
export async function notifySubscribersAboutEvent(
    eventName: string,
    eventSlug: string,
    eventCity: string,
    eventDate: string
): Promise<EmailResult> {
    try {
        const supabase = getSupabaseClient();
        if (!supabase) {
            throw new Error('Supabase is not configured');
        }

        // Get all active subscribers
        const { data: subscribers, error: fetchError } = await supabase
            .from('subscribers')
            .select('email')
            .eq('is_active', true);

        if (fetchError) {
            throw fetchError;
        }

        if (!subscribers || subscribers.length === 0) {
            return { success: true, count: 0 };
        }

        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
        const client = getResendClient();
        const siteUrl = process.env.SITE_URL || 'https://devgathering.in';

        const bodyContent = `
             <p style="${styles.p}">
                <span style="${styles.accent}">New Event Alert.</span> We are heading to <strong>${escapeHtml(eventCity)}</strong>.
             </p>
             <p style="${styles.p}">
                Join us for an evening of tech talks, networking, and good vibes.
             </p>
             
             <table style="${styles.table}">
                <tr>
                    <td style="${styles.tdLabel}">Event</td>
                    <td style="${styles.tdValue}">${escapeHtml(eventName)}</td>
                </tr>
                <tr>
                    <td style="${styles.tdLabel}">City</td>
                    <td style="${styles.tdValue}">${escapeHtml(eventCity)}</td>
                </tr>
                <tr>
                    <td style="${styles.tdLabel}">Date</td>
                    <td style="${styles.tdValue}">${escapeHtml(eventDate)}</td>
                </tr>
            </table>
        `;

        const htmlContent = getHtmlTemplate(
            'New Event Announced',
            bodyContent,
            true,
            'RSVP Now',
            `${siteUrl}/events/${eventSlug}`
        );

        // Send emails in batches (Resend supports batch sending)
        const emails = subscribers.map(sub => sub.email);

        // Send to each subscriber (in production, use batch API)
        let successCount = 0;
        for (const email of emails) {
            try {
                await client.emails.send({
                    from: fromEmail,
                    to: email,
                    subject: `New Event in ${eventCity}: ${eventName}`,
                    html: htmlContent,
                });
                successCount++;
            } catch (emailError) {
                console.error(`Failed to send to ${email}:`, emailError);
            }
        }

        return { success: true, count: successCount };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Batch email failed';
        console.error('Batch email error:', message);
        return { success: false, error: message };
    }
}

// Send RSVP invitation email to approved attendee
export async function sendRSVPInvitation(
    rsvp: { id: string; name: string; email: string },
    event: { name: string; city: string; venue: string; event_date: string; slug: string }
): Promise<EmailResult> {
    try {
        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
        const client = getResendClient();
        const siteUrl = process.env.SITE_URL || 'https://devgathering.in';

        const formattedDate = event.event_date
            ? new Date(event.event_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            : 'TBA';

        const bodyContent = `
            <p style="${styles.p}">
                Hey <strong>${escapeHtml(rsvp.name)}</strong>,
            </p>
            <p style="${styles.p}">
                Great news! Your RSVP for <span style="${styles.accent}">${escapeHtml(event.name)}</span> has been approved.
            </p>
            <p style="${styles.p}">
                We're excited to have you join us. Here are the event details:
            </p>
            
            <table style="${styles.table}">
                <tr>
                    <td style="${styles.tdLabel}">Event</td>
                    <td style="${styles.tdValue}">${escapeHtml(event.name)}</td>
                </tr>
                <tr>
                    <td style="${styles.tdLabel}">Date</td>
                    <td style="${styles.tdValue}">${formattedDate}</td>
                </tr>
                <tr>
                    <td style="${styles.tdLabel}">City</td>
                    <td style="${styles.tdValue}">${escapeHtml(event.city || 'TBA')}</td>
                </tr>
                <tr>
                    <td style="${styles.tdLabel}">Venue</td>
                    <td style="${styles.tdValue}">${escapeHtml(event.venue || 'TBA')}</td>
                </tr>
            </table>

            <p style="${styles.p}">
                Please save this email for reference. We'll send you a reminder closer to the event date.
            </p>

            <p style="${styles.p}">
                See you there!<br/>
                <span style="${styles.accent}">— The DevGathering Team</span>
            </p>
        `;

        const htmlContent = getHtmlTemplate(
            'You\'re In! 🎉',
            bodyContent,
            true,
            'View Event Details',
            `${siteUrl}/events/${event.slug}`
        );

        await client.emails.send({
            from: fromEmail,
            to: rsvp.email,
            subject: `You're confirmed for ${event.name}!`,
            html: htmlContent,
        });

        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send invitation';
        console.error('RSVP invitation email error:', message);
        return { success: false, error: message };
    }
}

// Escape HTML to prevent XSS in emails
function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char] || char);
}
