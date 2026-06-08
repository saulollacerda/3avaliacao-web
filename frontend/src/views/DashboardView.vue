<script setup>
import { computed, onMounted } from 'vue'
import { useBooksStore } from '../stores/books'
import { useLoansStore } from '../stores/loans'

const booksStore = useBooksStore()
const loansStore = useLoansStore()

onMounted(async () => {
  await Promise.all([booksStore.fetchBooks(), loansStore.fetchLoans()])
})

const today = new Date().toISOString().split('T')[0]

const totalBooks = computed(() => booksStore.books.length)
const totalAvailable = computed(() => booksStore.books.reduce((sum, b) => sum + b.available_quantity, 0))
const activeLoans = computed(() => loansStore.loans.filter(l => l.status === 'active').length)
const dueToday = computed(() => loansStore.loans.filter(l => l.status === 'active' && l.expected_return_date === today).length)
const recentLoans = computed(() => loansStore.loans.slice(0, 5))

const stats = computed(() => [
  { label: 'Total de Livros', value: totalBooks.value, color: 'border-indigo-500', text: 'text-indigo-700' },
  { label: 'Disponíveis', value: totalAvailable.value, color: 'border-green-500', text: 'text-green-700' },
  { label: 'Empréstimos Ativos', value: activeLoans.value, color: 'border-yellow-500', text: 'text-yellow-700' },
  { label: 'Devoluções Hoje', value: dueToday.value, color: 'border-red-500', text: 'text-red-700' },
])

function statusLabel(status) {
  return { active: 'Ativo', returned: 'Devolvido', overdue: 'Atrasado' }[status] ?? status
}
function statusClass(status) {
  return {
    active: 'bg-green-100 text-green-800',
    returned: 'bg-gray-100 text-gray-700',
    overdue: 'bg-red-100 text-red-800',
  }[status] ?? ''
}
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label"
        class="bg-white rounded-xl shadow p-5 border-l-4" :class="stat.color">
        <p class="text-sm text-gray-500 mb-1">{{ stat.label }}</p>
        <p class="text-3xl font-bold" :class="stat.text">{{ stat.value }}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Empréstimos Recentes</h2>

      <div v-if="loansStore.loading" class="text-center py-8 text-gray-400">Carregando...</div>

      <table v-else-if="recentLoans.length" class="w-full text-sm">
        <thead>
          <tr class="text-left text-gray-500 border-b">
            <th class="pb-2 pr-4">Livro</th>
            <th class="pb-2 pr-4">Tomador</th>
            <th class="pb-2 pr-4">Devolução Prevista</th>
            <th class="pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="loan in recentLoans" :key="loan.id" class="border-b last:border-0 hover:bg-gray-50">
            <td class="py-3 pr-4 font-medium text-gray-800">{{ loan.books?.title }}</td>
            <td class="py-3 pr-4 text-gray-600">{{ loan.borrower_name }}</td>
            <td class="py-3 pr-4 text-gray-600">{{ loan.expected_return_date }}</td>
            <td class="py-3">
              <span class="px-2 py-0.5 rounded text-xs font-semibold" :class="statusClass(loan.status)">
                {{ statusLabel(loan.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-gray-400 text-center py-6">Nenhum empréstimo registrado.</p>
    </div>
  </main>
</template>
