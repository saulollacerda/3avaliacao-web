const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const auth = require('../middleware/auth')

const router = express.Router()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

router.use(auth)

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('books').select('*').order('title')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { title, author, isbn, genre, year, total_quantity } = req.body
  const qty = Number(total_quantity) || 1
  const { data, error } = await supabase
    .from('books')
    .insert({ title, author, isbn, genre, year, total_quantity: qty, available_quantity: qty })
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

router.put('/:id', async (req, res) => {
  const { title, author, isbn, genre, year, total_quantity, available_quantity } = req.body
  const { data, error } = await supabase
    .from('books')
    .update({ title, author, isbn, genre, year, total_quantity, available_quantity })
    .eq('id', req.params.id)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('books').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
})

module.exports = router
