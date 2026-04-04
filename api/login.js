import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // Solo metodo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' })
  }

  const { nome_rp, discord_nome } = req.body

  if (!nome_rp || !discord_nome) {
    return res.status(400).json({ error: 'Campi mancanti' })
  }

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
  const { data: isAdmin } = await supabase
    .from('admin_web')
    .select('discord_id')
    .eq('discord_id', utente.discord_id)
    .single()

  // Crea una sessione (token semplice)
  const session = {
    utente_id: utente.id,
    discord_id: utente.discord_id,
    discord_nome: utente.discord_nome,
    nome_rp: utente.nome_rp,
    saldo: utente.saldo,
    is_admin_web: !!isAdmin,
    login_time: Date.now()
  }

  return res.status(200).json({ success: true, session })
}
