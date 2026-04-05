// api/tickets/create.js
export default async function handler(req, res) {
  // Imposta CORS per permettere richieste dal frontend
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
  
  // Per ora salviamo in memoria (poi collegheremo Supabase)
  console.log('Nuovo ticket creato:', {
    ticket_id,
    user_discord_id,
    user_discord_name,
    categoria,
    messaggio,
    created_at: new Date().toISOString()
  });

  res.status(200).json({ 
    success: true, 
    ticket_id: ticket_id,
    message: 'Ticket creato con successo (salvato in log, non ancora in database)'
  });
}
