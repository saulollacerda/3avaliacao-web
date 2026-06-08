require('dotenv').config()
const express = require('express')
const cors = require('cors')
const booksRouter = require('./src/routes/books')
const loansRouter = require('./src/routes/loans')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/books', booksRouter)
app.use('/api/loans', loansRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
