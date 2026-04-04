import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Metodo non consentito' });
    }
    
    const { discord_id } = req.query;
    
    if (!discord_id) {
        return res.status(400).json({ error: 'discord_id richiesto' });
    }
    
    try {
        // Cerca l'utente nel database
        const { data: utente, error } = await supabase
            .from('utenti')
            .select('ruoli, ruoli_aggiornato')
            .eq('discord_id', discord_id)
            .single();
        
        if (error || !utente) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }
        
        // Se i ruoli sono stati aggiornati meno di 5 minuti fa, usa cache
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const isRecent = utente.ruoli_aggiornato && new Date(utente.ruoli_aggiornato) > fiveMinutesAgo;
        
        if (isRecent && utente.ruoli) {
            return res.status(200).json({ 
                success: true, 
                ruoli: utente.ruoli,
                from_cache: true 
            });
        }
        
        // Qui dovresti chiamare il bot Discord per ottenere i ruoli reali
        // Per ora restituiamo ruoli di esempio
        const ruoliReali = ['cittadino']; // Default
        
        // Aggiorna i ruoli nel database
        await supabase
            .from('utenti')
            .update({ 
                ruoli: ruoliReali, 
                ruoli_aggiornato: new Date().toISOString() 
            })
            .eq('discord_id', discord_id);
        
        return res.status(200).json({ 
            success: true, 
            ruoli: ruoliReali,
            from_cache: false 
        });
        
    } catch (error) {
        console.error('Errore:', error);
        return res.status(500).json({ error: 'Errore del server' });
    }
}
