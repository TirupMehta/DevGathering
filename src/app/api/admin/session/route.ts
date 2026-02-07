import { NextResponse } from 'next/server';
import { validateSession, debugSessionStore } from '@/lib/auth';

export async function GET() {
    try {
        console.log('Session validation called');
        debugSessionStore(); // Show session store state

        const isValid = await validateSession();
        console.log('Session validation result:', isValid);

        if (!isValid) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { authenticated: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Session check error:', error);

        return NextResponse.json(
            { authenticated: false },
            { status: 500 }
        );
    }
}
