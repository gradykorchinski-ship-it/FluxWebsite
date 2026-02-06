import type { APIRoute } from 'astro';
import { sql, hashIP } from '../../lib/db';
import { sanitizeInput } from '../../lib/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
    let body: any = {};
    try {
        body = await request.json();
        const consent = Boolean(body.consent);
        const userId = sanitizeInput(body.userId || '');

        // Collect additional details
        const ipAddress = hashIP(clientAddress);
        const userAgent = sanitizeInput(request.headers.get('user-agent') || '').slice(0, 500); // Truncate for safety
        const country = sanitizeInput(request.headers.get('cf-ipcountry') || request.headers.get('x-country-code') || 'Unknown');

        let browserDetails = body.browserDetails || {};
        // Basic validation for browserDetails
        if (typeof browserDetails !== 'object' || Object.keys(browserDetails).length > 20) {
            browserDetails = {}; // Discard if suspicious
        }

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
      INSERT INTO cookie_consents (consent_given, user_id, ip_address, country, user_agent, browser_details) 
      VALUES (${consent}, ${userId || null}, ${ipAddress}, ${country}, ${userAgent}, ${sql.json(browserDetails)})
    `;

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Error recording consent:', error);

        // Graceful fallback for development without DB
        // We handle migration errors (undefined column) here as well by falling back to mock
        if (import.meta.env.DEV) {
            // Specific handling for SQL syntax error (e.g., missing column in dev)
            if (error.code === '42601') {
                console.warn(`⚠️ Database Error (42601 - SQL Syntax Error, likely missing column) - using mock consent for dev. Error: ${error.message}`);
            } else {
                console.warn(`⚠️ Database Error (${error.code || 'UNKNOWN'}) - using mock consent for dev. Error: ${error.message}`);
            }

            console.log('📝 Captured Data:', {
                consent: Boolean(body.consent),
                userId: body.userId,
                ipAddress: clientAddress,
                userAgent: request.headers.get('user-agent'),
                country: request.headers.get('cf-ipcountry') || request.headers.get('x-country-code') || 'Unknown',
                browserDetails: body.browserDetails
            });

            return new Response(JSON.stringify({ success: true, mock: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to record consent'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
