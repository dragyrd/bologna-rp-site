import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { ticket_id, staff_discord_id, staff_name } = req.body;

  const { data, error } = await supabase
    .from('tickets')
    .update({ 
      status: 'in_carico', 
      assunto_da: staff_discord_id,
      assunto_da_nome: staff_name
    })
    .eq('ticket_id', ticket_id);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ success: true });
}
