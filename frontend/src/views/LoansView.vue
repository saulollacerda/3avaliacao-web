<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLoansStore } from '../stores/loans'
import { useBooksStore } from '../stores/books'
import LoanModal from '../components/LoanModal.vue'

const loansStore = useLoansStore()
const booksStore = useBooksStore()

const showModal = ref(false)
const filter = ref('all')
const error = ref('')

onMounted(async () => {
  await Promise.all([loansStore.fetchLoans(), booksStore.fetchBooks()])
})

const filtered = computed(() => {
  if (filter.value === 'all') return loansStore.loans
  return loansStore.loans.filter(l => l.status === filter.value)
})

async function handleSave(form) {
  error.value = ''
  try {
    await loansStore.createLoan(form)
    await booksStore.fetchBooks()
    showModal.value = false
  } catch (e) {
    error.value = e.response?.data?.error ?? 'Erro ao registrar empréstimo.'
  }
}

async function handleReturn(loanId) {
  await loansStore.returnBook(loanId)
  await booksStore.fetchBooks()
}

function statusLabel(s) {
  return { active: 'Ativo', returned: 'Devolvido', overdue: 'Atrasado' }[s] ?? s
}
function statusClass(s) {
  return {
    active: 'bg-green-100 text-green-800',
    returned: 'bg-gray-100 text-gray-700',
    overdue: 'bg-red-100 text-red-800',
  }[s] ?? ''
}
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Empréstimos</h1>
      <button @click="showModal = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
        + Registrar Empréstimo
      </button>
    </div>

    <div class="flex gap-2 mb-4">
      <button v-for="opt in [['all','Todos'],['active','Ativos'],['returned','Devolvidos']]"
        :key="opt[0]" @click="filter = opt[0]"
        :class="filter === opt[0] ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'"
        class="px-3 py-1 rounded-full text-sm font-medium transition-colors">
        {{ opt[1] }}
      </button>
    </div>

    <p v-if="error" class="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4 text-sm">
      {{ error }}
    </p>

    <div v-if="loansStore.loading" class="text-center py-12 text-gray-400">Carregando...</div>

    <div v-else class="bg-white rounded-xl shadow overflow-hidden">
      <table v-if="filtered.length" class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr class="text-left text-gray-600">
            <th class="px-4 py-3">Livro</th>
            <th class="px-4 py-3">Tomador</th>
            <th class="px-4 py-3">Empréstimo</th>
            <th class="px-4 py-3">Devolução Prevista</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="loan in filtered" :key="loan.id"
            class="border-b last:border-0 hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 font-medium text-gray-800">{{ loan.books?.title }}</td>
            <td class="px-4 py-3 text-gray-600">{{ loan.borrower_name }}</td>
            <td class="px-4 py-3 text-gray-500">{{ loan.loan_date }}</td>
            <td class="px-4 py-3 text-gray-500">{{ loan.expected_return_date }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded text-xs font-semibold" :class="statusClass(loan.status)">
                {{ statusLabel(loan.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button v-if="loan.status === 'active'" @click="handleReturn(loan.id)"
                class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors text-sm">
                Devolver
              </button>
              <span v-else class="text-gray-400 text-xs">{{ loan.return_date }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-gray-400 text-center py-12">Nenhum empréstimo encontrado.</p>
    </div>

    <LoanModal v-if="showModal" @save="handleSave" @close="showModal = false" />
  </main>
</template>
