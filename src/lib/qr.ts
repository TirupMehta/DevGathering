import * as crypto from 'crypto';

// QR Token Strategy (stateless & secure) as per spec
// Token = base64url(HMAC_SHA256(server_secret, eventId|userId|issuedAt) + issuedAt)

const ALGORITHM = 'sha256';

// Get QR secret from environment
function getSecret(): string {
    const secret = process.env.QR_SECRET;
    if (!secret) {
        throw new Error('QR_SECRET is not configured');
    }
    return secret;
}

// In-memory blacklist for one-time-use tokens (replace with Redis in production)
const usedTokens = new Set<string>();

// Cleanup old tokens periodically (tokens older than 24 hours)
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface TokenPayload {
    eventId: string;
    userId: string;
    issuedAt: number;
}

// Generate QR token
export function generateQRToken(eventId: string, userId: string): string {
    const secret = getSecret();
    const issuedAt = Date.now();

    // Create payload string
    const payload = `${eventId}|${userId}|${issuedAt}`;

    // Generate HMAC
    const hmac = crypto
        .createHmac(ALGORITHM, secret)
        .update(payload)
        .digest();

    // Combine HMAC with issuedAt for verification
    const combined = Buffer.concat([
        hmac,
        Buffer.from(issuedAt.toString()),
    ]);

    // Return base64url encoded token
    return combined
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// Parse token to extract issuedAt
function parseToken(token: string): { hmac: Buffer; issuedAt: number } | null {
    try {
        // Decode base64url
        const base64 = token
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const buffer = Buffer.from(base64, 'base64');

        // HMAC is 32 bytes (SHA256)
        if (buffer.length <= 32) {
            return null;
        }

        const hmac = buffer.subarray(0, 32);
        const issuedAtStr = buffer.subarray(32).toString();
        const issuedAt = parseInt(issuedAtStr, 10);

        if (isNaN(issuedAt)) {
            return null;
        }

        return { hmac, issuedAt };
    } catch {
        return null;
    }
}

// Verify and validate token (one-time use)
export function verifyQRToken(
    token: string,
    eventId: string,
    userId: string
): { valid: boolean; error?: string } {
    try {
        const secret = getSecret();

        // Check if token was already used
        if (usedTokens.has(token)) {
            return { valid: false, error: 'Token has already been used' };
        }

        // Parse token
        const parsed = parseToken(token);
        if (!parsed) {
            return { valid: false, error: 'Invalid token format' };
        }

        const { hmac, issuedAt } = parsed;

        // Check expiration
        if (Date.now() - issuedAt > TOKEN_EXPIRY) {
            return { valid: false, error: 'Token has expired' };
        }

        // Recompute HMAC
        const payload = `${eventId}|${userId}|${issuedAt}`;
        const expectedHmac = crypto
            .createHmac(ALGORITHM, secret)
            .update(payload)
            .digest();

        // Constant-time comparison
        if (!crypto.timingSafeEqual(hmac, expectedHmac)) {
            return { valid: false, error: 'Invalid token' };
        }

        // Mark token as used (one-time use)
        usedTokens.add(token);

        return { valid: true };
    } catch (error) {
        return { valid: false, error: 'Token verification failed' };
    }
}

// Hash token for storage (never store raw tokens)
export function hashToken(token: string): string {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
}

// Cleanup expired tokens from blacklist
export function cleanupTokenBlacklist(): void {
    // In a real implementation, we'd track token creation times
    // For MVP, we just clear the set periodically
    if (usedTokens.size > 10000) {
        usedTokens.clear();
    }
}

// Run cleanup every hour
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupTokenBlacklist, 60 * 60 * 1000);
}
