<script setup>
import { ref, computed } from 'vue'
import { useBooksStore } from '../stores/books'

const emit = defineEmits(['save', 'close'])
const booksStore = useBooksStore()

const today = new Date().toISOString().split('T')[0]
const defaultReturn = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]

const form = ref({
  book_id: '',
  borrower_name: '',
  borrower_email: '',
  loan_date: today,
  expected_return_date: defaultReturn,
})

const availableBooks = computed(() => booksStore.books.filter(b => b.available_quantity > 0))

function submit() {
  emit('save', { ...form.value })
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
      <h2 class="text-lg font-bold text-gray-800 mb-5">Registrar Empréstimo</h2>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Livro *</label>
          <select v-model="form.book_id" required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Selecione um livro</option>
            <option v-for="book in availableBooks" :key="book.id" :value="book.id">
              {{ book.title }} — {{ book.author }} ({{ book.available_quantity }} disp.)
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Tomador *</label>
          <input v-model="form.borrower_name" required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-mail do Tomador</label>
          <input v-model="form.borrower_email" type="email"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data do Empréstimo</label>
            <input v-model="form.loan_date" type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Devolução Prevista</label>
            <input v-model="form.expected_return_date" type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button type="submit"
            class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium">
            Registrar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
