import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { title, description, email, system_info } = req.body

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' })
    }

    try {
        const { data, error } = await supabase
            .from('bugs')
            .insert([
                { title, description, email, system_info },
            ])
            .select()

        if (error) {
            console.error('Supabase error:', error)
            // Return actual error msg for debugging
            return res.status(500).json({ error: error.message || 'Supabase error' })
        }

        return res.status(200).json({ success: true, data })
    } catch (err) {
        console.error('Server error:', err)
        return res.status(500).json({ error: err.message || 'Internal server error' })
    }
}
