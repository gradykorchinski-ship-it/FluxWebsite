import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { user_agent } = req.body

        const { data, error } = await supabase
            .from('cookie_consents')
            .insert([
                {
                    user_agent: user_agent || req.headers['user-agent'],
                    ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress
                },
            ])
            .select()

        if (error) {
            console.error('Supabase error:', error)
            return res.status(500).json({ error: 'Failed to log consent' })
        }

        return res.status(200).json({ success: true, data })
    } catch (err: any) {
        console.error('Server error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
