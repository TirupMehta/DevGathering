import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limiting (for MVP - replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    return ip;
}

function hashIP(ip: string): string {
    // Simple hash for rate limiting key (not cryptographic)
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
        const char = ip.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

function isRateLimited(ipHash: string): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(ipHash);

    if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
        rateLimitStore.set(ipHash, { count: 1, timestamp: now });
        return false;
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return true;
    }

    record.count++;
    return false;
}

// Security headers as per spec
function getSecurityHeaders(): HeadersInit {
    // Note: 'unsafe-inline' and 'unsafe-eval' needed for Next.js hydration
    // In production, consider using nonces or hashes
    const csp = process.env.NODE_ENV === 'production'
        ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';"
        : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' localhost:*; frame-ancestors 'none';";

    return {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': csp,
    };
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Apply rate limiting to API routes
    if (pathname.startsWith('/api/')) {
        const ipHash = hashIP(getClientIP(request));

        if (isRateLimited(ipHash)) {
            return new NextResponse(
                JSON.stringify({ error: 'Too many requests. Please try again later.' }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': '60',
                        ...getSecurityHeaders(),
                    },
                }
            );
        }
    }

    // Create response with security headers
    const response = NextResponse.next();

    // Apply security headers to all responses
    const headers = getSecurityHeaders();
    for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value);
    }

    return response;
}

export const config = {
    matcher: [
        // Apply to all routes except static files and _next
        '/((?!_next/static|_next/image|favicon.ico|fonts/).*)',
    ],
};
