import type { APIContext, MiddlewareNext } from 'astro';
import { defineMiddleware, sequence } from 'astro:middleware';
import { rateLimit } from './middleware/rateLimit';

const skipRateLimit = defineMiddleware(async (context: APIContext, next: MiddlewareNext) => {
    const { pathname } = context.url;

    if (pathname.startsWith('/os/download')) {
        return next();
    }

    return rateLimit(context, next);
});

// Security headers middleware
const securityHeaders = defineMiddleware(async (_context: APIContext, next: MiddlewareNext) => {
    const response = await next();

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

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

export const onRequest = sequence(skipRateLimit, securityHeaders);
