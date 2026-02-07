import { NextRequest, NextResponse } from 'next/server';
import { adminLoginSchema, validateForm } from '@/lib/validation';
import { verifyPassword, createSessionToken } from '@/lib/auth';
import { logEvent } from '@/lib/logger';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days - must match auth.ts

export async function POST(request: NextRequest) {
    // Get client IP for logging
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    try {
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
        const validation = validateForm(adminLoginSchema, body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 400 }
            );
        }

        const { password } = validation.data;

        // Verify password with constant-time comparison
        const isValid = await verifyPassword(password);
        console.log('Password verification result:', isValid);

        if (!isValid) {
            logEvent('admin_login_failed', {}, ip);

            // Generic error message (don't reveal if password exists)
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create session token
        const token = createSessionToken();
        console.log('Session token created:', token ? 'yes' : 'no');

        logEvent('admin_login', {}, ip);

        // Create response with cookie
        const response = NextResponse.json(
            { success: true, message: 'Login successful' },
            { status: 200 }
        );

        // Set secure cookie on response
        response.cookies.set(SESSION_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: SESSION_TTL / 1000, // Seconds
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);

        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
