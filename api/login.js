import { createClient } from '@supabase/supabase-js'

// In Vercel, le variabili d'ambiente sono disponibili così
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Verifica che le variabili esistano
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Mancano SUPABASE_URL o SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
    // Imposta CORS per permettere richieste dal frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Solo metodo POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metodo non consentito' })
    }

    const { nome_rp, discord_nome } = req.body

    if (!nome_rp || !discord_nome) {
        return res.status(400).json({ error: 'Campi mancanti' })
    }

    try {
        // Cerca l'utente nel database
        const { data: utente, error } = await supabase
            .from('utenti')
            .select('*')
            .eq('nome_rp', nome_rp)
            .eq('discord_nome', discord_nome)
            .single()

        if (error || !utente) {
            return res.status(404).json({ error: 'Credenziali non valide' })
        }

        // Verifica se è admin web
        const { data: admin } = await supabase
            .from('admin_web')
            .select('discord_id')
            .eq('discord_id', utente.discord_id)
            .single()

        // Crea una sessione
        const session = {
            utente_id: utente.id,
            discord_id: utente.discord_id,
            discord_nome: utente.discord_nome,
            nome_rp: utente.nome_rp,
            saldo: utente.saldo || 0,
            is_admin_web: !!admin,
            login_time: Date.now()
        }

        return res.status(200).json({ success: true, session })
        
    } catch (error) {
        console.error('Errore login:', error);
        return res.status(500).json({ error: 'Errore del server' })
    }
}
