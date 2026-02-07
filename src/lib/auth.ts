import * as bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import * as crypto from 'crypto';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Secret for signing session tokens - use env var in production
const SESSION_SECRET = process.env.QR_SECRET || 'devgathering_session_secret_v1';

// Constant-time password comparison using bcrypt
export async function verifyPassword(password: string): Promise<boolean> {
    const hash = process.env.ADMIN_PASSWORD_HASH;

    if (!hash) {
        console.error('ADMIN_PASSWORD_HASH is not configured');
        return false;
    }

    try {
        // bcrypt.compare is already constant-time
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Password verification error:', error);
        return false;
    }
}

// Create a signed session token containing expiry time
function createSignedToken(expires: number): string {
    const payload = `admin:${expires}`;
    const signature = crypto
        .createHmac('sha256', SESSION_SECRET)
        .update(payload)
        .digest('hex');
    return `${payload}:${signature}`;
}

// Verify a signed session token
function verifySignedToken(token: string): { valid: boolean; expires: number } {
    try {
        const parts = token.split(':');
        if (parts.length !== 3) return { valid: false, expires: 0 };

        const [prefix, expiresStr, signature] = parts;
        const payload = `${prefix}:${expiresStr}`;

        const expectedSignature = crypto
            .createHmac('sha256', SESSION_SECRET)
            .update(payload)
            .digest('hex');

        // Constant-time comparison
        if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
            return { valid: false, expires: 0 };
        }

        const expires = parseInt(expiresStr, 10);
        if (isNaN(expires)) return { valid: false, expires: 0 };

        return { valid: true, expires };
    } catch {
        return { valid: false, expires: 0 };
    }
}

// Create session token (returns token string for API to use)
export function createSessionToken(): string {
    const expires = Date.now() + SESSION_TTL;
    return createSignedToken(expires);
}

// Create admin session (sets cookie directly)
export async function createSession(): Promise<string> {
    const token = createSessionToken();

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: SESSION_TTL / 1000, // Seconds
        path: '/',
    });

    return token;
}

// Validate session (no server-side storage needed!)
export async function validateSession(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
        console.log('No session cookie found');
        return false;
    }

    const { valid, expires } = verifySignedToken(token);

    if (!valid) {
        console.log('Invalid session token signature');
        return false;
    }

    // Check expiration
    if (Date.now() > expires) {
        console.log('Session token expired');
        return false;
    }

    return true;
}

// Destroy session (logout)
export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

// Re-authenticate (verify password again for sensitive operations)
export async function reAuthenticate(password: string): Promise<boolean> {
    return verifyPassword(password);
}

// Debug function (for troubleshooting)
export function debugSessionStore() {
    console.log('Using signed cookie sessions - no server-side store');
}
