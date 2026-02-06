import type { APIContext, MiddlewareNext } from 'astro';
import { defineMiddleware, sequence } from 'astro:middleware';
import { rateLimit } from './middleware/rateLimit';

// Security headers middleware
const securityHeaders = defineMiddleware(async (_context: APIContext, next: MiddlewareNext) => {
    const response = await next();

    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self';"
    );

    return response;
});

// Combine middlewares - rateLimit already handles API route checking internally
export const onRequest = sequence(rateLimit, securityHeaders);

