import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Log directory
const LOG_DIR = path.join(process.cwd(), 'logs');

// Ensure log directory exists
function ensureLogDir(): void {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
}

// Get current date for log file rotation
function getLogFileName(): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(LOG_DIR, `${date}.log`);
}

// Hash IP address - never store raw IPs
export function hashIP(ip: string): string {
    const salt = process.env.IP_HASH_SALT || 'default-salt-change-in-production';
    return crypto
        .createHash('sha256')
        .update(ip + salt)
        .digest('hex')
        .substring(0, 16);
}

// Create action hash for audit trail
function createActionHash(action: string, data: Record<string, unknown>): string {
    const str = JSON.stringify({ action, ...data, timestamp: Date.now() });
    return crypto.createHash('sha256').update(str).digest('hex').substring(0, 12);
}

// Redact PII from data
function redactPII(data: Record<string, unknown>): Record<string, unknown> {
    const redacted = { ...data };

    // Fields to redact
    const piiFields = ['email', 'name', 'ip', 'password'];

    for (const field of piiFields) {
        if (field in redacted) {
            if (field === 'email' && typeof redacted[field] === 'string') {
                // Partially redact email: jo****@example.com
                const email = redacted[field] as string;
                const [local, domain] = email.split('@');
                if (local && domain) {
                    redacted[field] = `${local.substring(0, 2)}****@${domain}`;
                }
            } else {
                redacted[field] = '[REDACTED]';
            }
        }
    }

    return redacted;
}

export type LogEvent =
    | 'notify_submit'
    | 'request_submit'
    | 'admin_login'
    | 'admin_login_failed'
    | 'event_created'
    | 'event_creation_failed'
    | 'rate_limited'
    | 'validation_failed'
    | 'error';

interface LogEntry {
    event: LogEvent;
    timestamp: string;
    actionHash: string;
    ipHash?: string;
    data?: Record<string, unknown>;
}

// Append log entry to daily log file
export function logEvent(
    event: LogEvent,
    data: Record<string, unknown> = {},
    ip?: string
): void {
    try {
        ensureLogDir();

        const redactedData = redactPII(data);
        const actionHash = createActionHash(event, redactedData);

        const entry: LogEntry = {
            event,
            timestamp: new Date().toISOString(),
            actionHash,
        };

        if (ip) {
            entry.ipHash = hashIP(ip);
        }

        // Only include minimal data
        if (Object.keys(redactedData).length > 0) {
            entry.data = redactedData;
        }

        const logLine = JSON.stringify(entry) + '\n';
        const logFile = getLogFileName();

        fs.appendFileSync(logFile, logLine, 'utf8');
    } catch (error) {
        // Log to console if file logging fails (don't expose error to client)
        console.error('Logging failed:', error);
    }
}

// Server-side error logging (with full details)
export function logError(
    error: unknown,
    context: Record<string, unknown> = {}
): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    logEvent('error', {
        message: errorMessage,
        stack: errorStack,
        ...context,
    });
}
