// Email validation
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

// Sanitize user input (prevent XSS)
export function sanitizeInput(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim()
        .slice(0, 1000); // Max length
}

// Validate version string (prevent SQL injection)
export function isValidVersion(version: string): boolean {
    const versionRegex = /^[0-9]+\.[0-9]+(\.[0-9]+)?$/;
    return versionRegex.test(version);
}

// Rate limit check (for client-side)
export function checkRateLimit(key: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const storageKey = `ratelimit_${key}`;

    try {
        const stored = localStorage.getItem(storageKey);
        let data = stored ? JSON.parse(stored) : { count: 0, resetTime: now + windowMs };

        if (now > data.resetTime) {
            data = { count: 0, resetTime: now + windowMs };
        }

        data.count++;
        localStorage.setItem(storageKey, JSON.stringify(data));

        return data.count <= maxRequests;
    } catch {
        return true; // Allow if localStorage fails
    }
}
