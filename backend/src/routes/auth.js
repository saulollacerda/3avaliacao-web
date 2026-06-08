const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const router = express.Router()

// Admin client usa service_role para criar usuário já confirmado
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' })
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error) return res.status(400).json({ error: error.message })

  res.status(201).json({ message: 'Usuário criado com sucesso', user: data.user })
})

module.exports = router
