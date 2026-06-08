const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const auth = require('../middleware/auth')

const router = express.Router()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

router.use(auth)

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('loans')
    .select('*, books(title, author)')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { book_id, borrower_name, borrower_email, loan_date, expected_return_date } = req.body

  const { data: book, error: bookError } = await supabase
    .from('books')
    .select('available_quantity')
    .eq('id', book_id)
    .single()
  if (bookError) return res.status(500).json({ error: bookError.message })
  if (book.available_quantity < 1) {
    return res.status(400).json({ error: 'Livro sem exemplares disponíveis' })
  }

  await supabase
    .from('books')
    .update({ available_quantity: book.available_quantity - 1 })
    .eq('id', book_id)

  const { data, error } = await supabase
    .from('loans')
    .insert({ book_id, borrower_name, borrower_email, loan_date, expected_return_date, status: 'active' })
    .select('*, books(title, author)')
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

router.put('/:id/return', async (req, res) => {
  const { data: loan, error: loanError } = await supabase
    .from('loans')
    .select('book_id')
    .eq('id', req.params.id)
    .single()
  if (loanError) return res.status(500).json({ error: loanError.message })

  const { data: book } = await supabase
    .from('books')
    .select('available_quantity')
    .eq('id', loan.book_id)
    .single()
  await supabase
    .from('books')
    .update({ available_quantity: book.available_quantity + 1 })
    .eq('id', loan.book_id)

  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('loans')
    .update({ return_date: today, status: 'returned' })
    .eq('id', req.params.id)
    .select('*, books(title, author)')
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
