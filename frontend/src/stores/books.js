import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useBooksStore = defineStore('books', () => {
  const books = ref([])
  const loading = ref(false)

  async function fetchBooks() {
    loading.value = true
    try {
      const { data } = await api.get('/api/books')
      books.value = data
    } finally {
      loading.value = false
    }
  }

  async function createBook(book) {
    const { data } = await api.post('/api/books', book)
    books.value.push(data)
  }

  async function updateBook(id, book) {
    const { data } = await api.put(`/api/books/${id}`, book)
    const index = books.value.findIndex(b => b.id === id)
    if (index !== -1) books.value[index] = data
  }

  async function deleteBook(id) {
    await api.delete(`/api/books/${id}`)
    books.value = books.value.filter(b => b.id !== id)
  }

  return { books, loading, fetchBooks, createBook, updateBook, deleteBook }
})
