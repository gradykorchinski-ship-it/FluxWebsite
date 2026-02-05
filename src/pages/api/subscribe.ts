import type { APIRoute } from 'astro';
import { sql } from '../../lib/db';
import { isValidEmail, sanitizeInput } from '../../lib/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const email = sanitizeInput(body.email || '');
        const downloadedVersion = sanitizeInput(body.downloadedVersion || '');

        // Validate email
        if (!email || !isValidEmail(email)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid email address'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Store newsletter subscription (upsert)
        await sql`
      INSERT INTO newsletter_subscribers (email, downloaded_version) 
      VALUES (${email.toLowerCase()}, ${downloadedVersion || null})
      ON CONFLICT (email) 
      DO UPDATE SET downloaded_version = ${downloadedVersion || null}
    `;

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error subscribing user:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to subscribe'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
