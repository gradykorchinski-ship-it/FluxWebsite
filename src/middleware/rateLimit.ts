import type { APIContext, MiddlewareNext } from 'astro';

// Simple in-memory rate limiting (use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute per IP

export const rateLimit = async ({ request }: APIContext, next: MiddlewareNext) => {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    // Get or create rate limit entry
    let entry = requestCounts.get(clientIP);

    if (!entry || now > entry.resetTime) {
        // Reset or create new entry
        entry = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
        requestCounts.set(clientIP, entry);
    }

    // Increment request count
    entry.count++;

    // Check if rate limit exceeded
    if (entry.count > MAX_REQUESTS) {
        return new Response(JSON.stringify({
            error: 'Too many requests. Please try again later.'
        }), {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': String(Math.ceil((entry.resetTime - now) / 1000)),
            },
        });
    }

    return next();
};

// Clean up old entries periodically (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of requestCounts.entries()) {
        if (now > entry.resetTime) {
            requestCounts.delete(ip);
        }
    }
}, 5 * 60 * 1000);
