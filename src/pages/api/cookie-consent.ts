import type { APIRoute } from 'astro';
import { sql } from '../../lib/db';
import { sanitizeInput } from '../../lib/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const consent = Boolean(body.consent);
        const userId = sanitizeInput(body.userId || '');

        // Validate userId if provided
        if (userId && userId.length > 100) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid user ID'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Record cookie consent
        await sql`
      INSERT INTO cookie_consents (consent_given, user_id) 
      VALUES (${consent}, ${userId || null})
    `;

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error recording consent:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to record consent'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
