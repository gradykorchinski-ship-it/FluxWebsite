import postgres from 'postgres';

// Initialize PostgreSQL client
export const sql = postgres(
    import.meta.env.DATABASE_URL || 'postgresql://fluxuser:flux_dev_password@localhost:5432/fluxwebsite',
    {
        max: 10, // Connection pool size
    }
);

// Database schema initialization
export async function initializeDatabase() {
    try {
        // Downloads table
        await sql`
      CREATE TABLE IF NOT EXISTS downloads (
        id SERIAL PRIMARY KEY,
        version TEXT NOT NULL,
        user_agent TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_hash TEXT,
        consent_given BOOLEAN DEFAULT FALSE
      )
    `;

        // Cookie consents table
        await sql`
      CREATE TABLE IF NOT EXISTS cookie_consents (
        id SERIAL PRIMARY KEY,
        consent_given BOOLEAN NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT
      )
    `;

        // Newsletter subscribers table
        await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        downloaded_version TEXT
      )
    `;

        console.log('✅ Database tables initialized');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
}

// Helper function to hash IP addresses for privacy
export function hashIP(ip: string): string {
    // Simple hash for privacy - in production use crypto
    return btoa(ip).slice(0, 16);
}
