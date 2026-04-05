// api/ruoli/sync.js
export default function handler(req, res) {
  // Permetti solo richieste POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, guild_id, ruoli, username } = req.body;
  
  console.log(`📥 Ricevuto da Discord:`);
  console.log(`Utente: ${username} (${user_id})`);
  console.log(`Ruoli: ${ruoli ? ruoli.join(', ') : 'nessuno'}`);
  console.log(`Server: ${guild_id}`);
  
  // QUI DOPO SALVERAI I DATI NEL DATABASE
  // Per ora logghiamo solo per test
  
  res.status(200).json({ 
    status: 'ok', 
    message: 'Ruoli ricevuti con successo',
    ricevuto: true 
  });
}
