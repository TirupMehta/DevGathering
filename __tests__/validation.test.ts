import { describe, expect, test } from '@jest/globals';
import {
    emailSchema,
    nameSchema,
    citySchema,
    reasonSchema,
    eventSlugSchema,
    notifyFormSchema,
    requestFormSchema,
    sanitizeInput,
    validateForm,
} from '../src/lib/validation';

describe('Email Validation', () => {
    test('accepts valid email', () => {
        const result = emailSchema.safeParse('test@example.com');
        expect(result.success).toBe(true);
    });

    test('rejects invalid email', () => {
        const result = emailSchema.safeParse('not-an-email');
        expect(result.success).toBe(false);
    });

    test('trims and lowercases email', () => {
        const result = emailSchema.safeParse('  TEST@Example.COM  ');
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe('test@example.com');
        }
    });

    test('rejects email over 254 characters', () => {
        const longEmail = 'a'.repeat(250) + '@test.com';
        const result = emailSchema.safeParse(longEmail);
        expect(result.success).toBe(false);
    });
});

describe('Name Validation', () => {
    test('accepts valid name', () => {
        const result = nameSchema.safeParse('John Doe');
        expect(result.success).toBe(true);
    });

    test('rejects name with HTML tags', () => {
        const result = nameSchema.safeParse('John<script>');
        expect(result.success).toBe(false);
    });

    test('rejects name with special characters', () => {
        const result = nameSchema.safeParse('John@Doe');
        expect(result.success).toBe(false);
    });

    test('rejects name under 2 characters', () => {
        const result = nameSchema.safeParse('J');
        expect(result.success).toBe(false);
    });

    test('rejects name over 100 characters', () => {
        const result = nameSchema.safeParse('a'.repeat(101));
        expect(result.success).toBe(false);
    });
});

describe('City Validation', () => {
    test('accepts valid city', () => {
        const result = citySchema.safeParse('Mumbai');
        expect(result.success).toBe(true);
    });

    test('accepts city with spaces', () => {
        const result = citySchema.safeParse('New Delhi');
        expect(result.success).toBe(true);
    });

    test('rejects city with HTML', () => {
        const result = citySchema.safeParse('<script>alert("xss")</script>');
        expect(result.success).toBe(false);
    });
});

describe('Reason Validation', () => {
    test('accepts valid reason', () => {
        const result = reasonSchema.safeParse('We have a great developer community here!');
        expect(result.success).toBe(true);
    });

    test('rejects reason with HTML tags', () => {
        const result = reasonSchema.safeParse('Great community <script>alert("xss")</script>');
        expect(result.success).toBe(false);
    });

    test('rejects reason containing "script"', () => {
        const result = reasonSchema.safeParse('We need a script to automate this');
        expect(result.success).toBe(false);
    });

    test('rejects reason under 10 characters', () => {
        const result = reasonSchema.safeParse('Short');
        expect(result.success).toBe(false);
    });

    test('rejects reason over 1000 characters', () => {
        const result = reasonSchema.safeParse('a'.repeat(1001));
        expect(result.success).toBe(false);
    });
});

describe('Event Slug Validation', () => {
    test('accepts valid slug', () => {
        const result = eventSlugSchema.safeParse('mumbai-2024');
        expect(result.success).toBe(true);
    });

    test('accepts simple slug', () => {
        const result = eventSlugSchema.safeParse('test');
        expect(result.success).toBe(true);
    });

    test('rejects slug with uppercase', () => {
        const result = eventSlugSchema.safeParse('Mumbai-2024');
        expect(result.success).toBe(false);
    });

    test('rejects slug with spaces', () => {
        const result = eventSlugSchema.safeParse('mumbai 2024');
        expect(result.success).toBe(false);
    });

    test('rejects slug with special characters', () => {
        const result = eventSlugSchema.safeParse('mumbai_2024');
        expect(result.success).toBe(false);
    });
});

describe('Notify Form Schema', () => {
    test('accepts valid notify form', () => {
        const result = validateForm(notifyFormSchema, { email: 'test@example.com' });
        expect(result.success).toBe(true);
    });

    test('rejects empty email', () => {
        const result = validateForm(notifyFormSchema, { email: '' });
        expect(result.success).toBe(false);
    });
});

describe('Request Form Schema', () => {
    test('accepts valid request form', () => {
        const result = validateForm(requestFormSchema, {
            name: 'John Doe',
            email: 'john@example.com',
            city: 'Mumbai',
            role: 'developer',
            reason: 'We have an amazing developer community here!',
        });
        expect(result.success).toBe(true);
    });

    test('rejects invalid role', () => {
        const result = validateForm(requestFormSchema, {
            name: 'John Doe',
            email: 'john@example.com',
            city: 'Mumbai',
            role: 'invalid-role',
            reason: 'We have an amazing developer community here!',
        });
        expect(result.success).toBe(false);
    });

    test('rejects missing fields', () => {
        const result = validateForm(requestFormSchema, {
            name: 'John Doe',
            email: 'john@example.com',
        });
        expect(result.success).toBe(false);
    });
});

describe('XSS Prevention', () => {
    test('sanitizeInput removes angle brackets', () => {
        const result = sanitizeInput('<script>alert("xss")</script>');
        expect(result).not.toContain('<');
        expect(result).not.toContain('>');
    });

    test('sanitizeInput removes javascript:', () => {
        const result = sanitizeInput('javascript:alert("xss")');
        expect(result.toLowerCase()).not.toContain('javascript:');
    });

    test('sanitizeInput removes event handlers', () => {
        const result = sanitizeInput('onclick=alert("xss")');
        expect(result.toLowerCase()).not.toContain('onclick=');
    });

    test('form rejects XSS in name field', () => {
        const result = validateForm(requestFormSchema, {
            name: '<img src=x onerror=alert("xss")>',
            email: 'test@example.com',
            city: 'Mumbai',
            role: 'developer',
            reason: 'Valid reason that is long enough',
        });
        expect(result.success).toBe(false);
    });

    test('form rejects XSS in reason field', () => {
        const result = validateForm(requestFormSchema, {
            name: 'John Doe',
            email: 'test@example.com',
            city: 'Mumbai',
            role: 'developer',
            reason: '<script>document.location="http://evil.com"</script>',
        });
        expect(result.success).toBe(false);
    });
});
