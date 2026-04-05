import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_discord_id, user_discord_name, categoria, messaggio } = req.body;

  // Genera ID ticket unico
  const ticket_id = `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  // 1. Inserisci il ticket in Supabase
  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .insert({
      ticket_id: ticket_id,
      user_discord_id: user_discord_id,
      user_discord_name: user_discord_name,
      categoria: categoria,
      status: 'aperto',
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (ticketError) {
    console.error('Errore inserimento ticket:', ticketError);
    return res.status(500).json({ error: ticketError.message });
  }

  // 2. Inserisci il primo messaggio
  const { error: msgError } = await supabase
    .from('messages')
    .insert({
      ticket_id: ticket_id,
      user_discord_id: user_discord_id,
      user_discord_name: user_discord_name,
      message: messaggio,
      created_at: new Date().toISOString()
    });

  if (msgError) {
    console.error('Errore inserimento messaggio:', msgError);
    return res.status(500).json({ error: msgError.message });
  }

  res.status(200).json({ 
    success: true, 
    ticket_id: ticket_id,
    message: 'Ticket creato con successo!'
  });
}
