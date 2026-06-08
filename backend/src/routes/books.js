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

function sanitizeBook({ title, author, isbn, genre, year, total_quantity, available_quantity }) {
  return {
    title,
    author,
    isbn: isbn || null,
    genre: genre || null,
    year: year !== '' && year != null ? Number(year) : null,
    total_quantity: total_quantity !== '' && total_quantity != null ? Number(total_quantity) : 1,
    ...(available_quantity != null ? { available_quantity: Number(available_quantity) } : {}),
  }
}

router.post('/', async (req, res) => {
  const book = sanitizeBook(req.body)
  book.available_quantity = book.total_quantity
  const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

router.put('/:id', async (req, res) => {
  const book = sanitizeBook(req.body)
  const { data, error } = await supabase
    .from('books')
    .update(book)
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
