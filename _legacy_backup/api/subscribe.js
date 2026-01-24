import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const { data, error } = await supabase
      .from('newsletter')
      .insert([{ email }]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Failed to subscribe', error });
    }

    return res.status(200).json({ message: 'Subscribed successfully', data });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
