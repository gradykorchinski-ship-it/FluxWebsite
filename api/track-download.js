import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { file_name, user_agent } = req.body

    if (!file_name) {
        return res.status(400).json({ error: 'File name is required' })
    }

    try {
        const { data, error } = await supabase
            .from('downloads')
            .insert([
                {
                    file_name,
                    user_agent: user_agent || req.headers['user-agent'],
                    ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    country: req.headers['x-vercel-ip-country']
                },
            ])
            .select()

        if (error) {
            console.error('Supabase error:', error)
            return res.status(500).json({ error: 'Failed to track download' })
        }

        return res.status(200).json({ success: true, data })
    } catch (err) {
        console.error('Server error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
