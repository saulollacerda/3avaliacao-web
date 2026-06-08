import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useLoansStore = defineStore('loans', () => {
  const loans = ref([])
  const loading = ref(false)

  async function fetchLoans() {
    loading.value = true
    try {
      const { data } = await api.get('/api/loans')
      loans.value = data
    } finally {
      loading.value = false
    }
  }

  async function createLoan(loan) {
    const { data } = await api.post('/api/loans', loan)
    loans.value.unshift(data)
  }

  async function returnBook(loanId) {
    const { data } = await api.put(`/api/loans/${loanId}/return`)
    const index = loans.value.findIndex(l => l.id === loanId)
    if (index !== -1) loans.value[index] = data
  }

  return { loans, loading, fetchLoans, createLoan, returnBook }
})
