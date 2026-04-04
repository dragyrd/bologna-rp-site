import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
    // Imposta CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // GET: Leggi tutti gli annunci
    if (req.method === 'GET') {
        try {
            const { data: annunci, error } = await supabase
                .from('annunci')
                .select('*')
                .order('data', { ascending: false })

            if (error) throw error;
            return res.status(200).json(annunci || [])
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    // POST: Crea nuovo annuncio (solo admin)
    if (req.method === 'POST') {
        const { titolo, contenuto, autore, autore_discord_id } = req.body

        try {
            // Verifica che l'autore sia admin web
            const { data: admin, error: adminError } = await supabase
                .from('admin_web')
                .select('discord_id')
                .eq('discord_id', autore_discord_id)
                .single()

            if (adminError || !admin) {
                return res.status(403).json({ error: 'Non autorizzato' })
            }

            const { error } = await supabase
                .from('annunci')
                .insert([{ titolo, contenuto, autore, autore_discord_id }])

            if (error) throw error;
            return res.status(201).json({ success: true })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    // DELETE: Elimina annuncio (solo admin)
    if (req.method === 'DELETE') {
        const { id, autore_discord_id } = req.body

        try {
            const { data: admin, error: adminError } = await supabase
                .from('admin_web')
                .select('discord_id')
                .eq('discord_id', autore_discord_id)
                .single()

            if (adminError || !admin) {
                return res.status(403).json({ error: 'Non autorizzato' })
            }

            const { error } = await supabase
                .from('annunci')
                .delete()
                .eq('id', id)

            if (error) throw error;
            return res.status(200).json({ success: true })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(405).json({ error: 'Metodo non consentito' })
}
