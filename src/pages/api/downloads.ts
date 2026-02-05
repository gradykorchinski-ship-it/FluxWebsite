import type { APIRoute } from 'astro';
import { sql, hashIP } from '../../lib/db';
import { isValidVersion, sanitizeInput } from '../../lib/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
    try {
        const body = await request.json();
        const version = sanitizeInput(body.version || '');
        const userAgent = sanitizeInput(body.userAgent || '');
        const consent = Boolean(body.consent);

        // Validate version string
        if (!version || !isValidVersion(version)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid version format'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Record download event
        await sql`
      INSERT INTO downloads (version, user_agent, ip_hash, consent_given) 
      VALUES (${version}, ${userAgent}, ${hashIP(clientAddress)}, ${consent})
    `;

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error recording download:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to record download'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
