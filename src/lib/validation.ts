import { z } from 'zod';

// Strict character whitelist for text inputs
const safeTextRegex = /^[a-zA-Z0-9\s.,!?'-]+$/;

// Strict slug regex for event slugs
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Role enum as per spec
export const RoleEnum = z.enum([
    'developer',
    'designer',
    'manager',
    'student',
    'other',
]);

export type Role = z.infer<typeof RoleEnum>;

// Email validation with strict pattern
export const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .max(254, 'Email must be less than 254 characters');

// Name validation
export const nameSchema = z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .refine(
        (val) => safeTextRegex.test(val),
        'Name contains invalid characters'
    );

// City validation
export const citySchema = z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters')
    .trim()
    .refine(
        (val) => safeTextRegex.test(val),
        'City contains invalid characters'
    );

// Reason validation (max 1000 chars as per spec)
export const reasonSchema = z
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(1000, 'Reason must be less than 1000 characters')
    .trim()
    .refine(
        (val) => !/[<>]/.test(val),
        'Reason cannot contain HTML tags'
    )
    .refine(
        (val) => !/script/i.test(val),
        'Reason contains invalid content'
    );

// Event slug validation
export const eventSlugSchema = z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .trim()
    .refine(
        (val) => slugRegex.test(val),
        'Slug must be lowercase letters, numbers, and hyphens only'
    );

// Notify form schema (email capture)
export const notifyFormSchema = z.object({
    email: emailSchema,
});

export type NotifyFormData = z.infer<typeof notifyFormSchema>;

// Request city form schema
export const requestFormSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    city: citySchema,
    role: RoleEnum,
    reason: reasonSchema,
});

export type RequestFormData = z.infer<typeof requestFormSchema>;

// Admin login schema
export const adminLoginSchema = z.object({
    password: z
        .string()
        .min(1, 'Password is required')
        .max(128, 'Password too long'),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

// Create event schema
export const createEventSchema = z.object({
    slug: eventSlugSchema,
    name: z
        .string()
        .min(3, 'Event name must be at least 3 characters')
        .max(100, 'Event name must be less than 100 characters')
        .trim(),
    description: z
        .string()
        .max(500, 'Description must be less than 500 characters')
        .trim()
        .optional(),
    date: z
        .string()
        .refine(
            (val) => !val || !isNaN(Date.parse(val)),
            'Invalid date format'
        )
        .optional(),
});

export type CreateEventData = z.infer<typeof createEventSchema>;

// Utility to sanitize input (removes potential XSS)
export function sanitizeInput(input: string): string {
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
}

// Validate and return safe parsed data or error
export function validateForm<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors = result.error.issues.map((issue) => issue.message);
    return { success: false, errors };
}
