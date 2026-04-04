import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // GET: Leggi tutti gli annunci
  if (req.method === 'GET') {
    const { data: annunci, error } = await supabase
      .from('annunci')
      .select('*')
      .order('data', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(annunci)
  }

  // POST: Crea nuovo annuncio (solo admin)
  if (req.method === 'POST') {
    const { titolo, contenuto, autore, autore_discord_id } = req.body

    // Verifica che l'autore sia admin web
    const { data: admin } = await supabase
      .from('admin_web')
      .select('discord_id')
      .eq('discord_id', autore_discord_id)
      .single()

    if (!admin) {
      return res.status(403).json({ error: 'Non autorizzato' })
    }

    const { data, error } = await supabase
      .from('annunci')
      .insert([{ titolo, contenuto, autore, autore_discord_id }])

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(201).json({ success: true })
  }

  // DELETE: Elimina annuncio (solo admin)
  if (req.method === 'DELETE') {
    const { id, autore_discord_id } = req.body

    const { data: admin } = await supabase
      .from('admin_web')
      .select('discord_id')
      .eq('discord_id', autore_discord_id)
      .single()

    if (!admin) {
      return res.status(403).json({ error: 'Non autorizzato' })
    }

    const { error } = await supabase
      .from('annunci')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Metodo non consentito' })
}
