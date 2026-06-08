const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const router = express.Router()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' })
  }

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return res.status(400).json({ error: error.message })

  res.status(201).json({ message: 'Usuário criado com sucesso', user: data.user })
})

module.exports = router
