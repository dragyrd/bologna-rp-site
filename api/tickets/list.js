import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_discord_id } = req.body;

  // Recupera i ticket dell'utente
  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_discord_id', user_discord_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Errore recupero ticket:', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(tickets || []);
}
