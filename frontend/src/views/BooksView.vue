<script setup>
import { ref, onMounted } from 'vue'
import { useBooksStore } from '../stores/books'
import BookModal from '../components/BookModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const store = useBooksStore()

const showModal = ref(false)
const showConfirm = ref(false)
const editingBook = ref(null)
const deletingId = ref(null)
const error = ref('')

onMounted(() => store.fetchBooks())

function openCreate() {
  editingBook.value = null
  showModal.value = true
}
function openEdit(book) {
  editingBook.value = { ...book }
  showModal.value = true
}
function openDelete(id) {
  deletingId.value = id
  showConfirm.value = true
}

async function handleSave(form) {
  error.value = ''
  try {
    if (editingBook.value) {
      await store.updateBook(editingBook.value.id, form)
    } else {
      await store.createBook(form)
    }
    showModal.value = false
  } catch (e) {
    error.value = e.response?.data?.error ?? 'Erro ao salvar livro.'
  }
}

async function handleDelete() {
  await store.deleteBook(deletingId.value)
  showConfirm.value = false
}
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Livros</h1>
      <button @click="openCreate"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
        + Novo Livro
      </button>
    </div>

    <p v-if="error" class="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4 text-sm">
      {{ error }}
    </p>

    <div v-if="store.loading" class="text-center py-12 text-gray-400">Carregando...</div>

    <div v-else class="bg-white rounded-xl shadow overflow-hidden">
      <table v-if="store.books.length" class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr class="text-left text-gray-600">
            <th class="px-4 py-3">Título</th>
            <th class="px-4 py-3">Autor</th>
            <th class="px-4 py-3">Gênero</th>
            <th class="px-4 py-3">Ano</th>
            <th class="px-4 py-3 text-center">Disp.</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in store.books" :key="book.id"
            class="border-b last:border-0 hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 font-medium text-gray-800">{{ book.title }}</td>
            <td class="px-4 py-3 text-gray-600">{{ book.author }}</td>
            <td class="px-4 py-3 text-gray-500">{{ book.genre ?? '—' }}</td>
            <td class="px-4 py-3 text-gray-500">{{ book.year ?? '—' }}</td>
            <td class="px-4 py-3 text-center">
              <span :class="book.available_quantity > 0 ? 'text-green-700 font-semibold' : 'text-red-600'">
                {{ book.available_quantity }}/{{ book.total_quantity }}
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-2">
              <button @click="openEdit(book)"
                class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Editar</button>
              <button @click="openDelete(book.id)"
                class="text-red-500 hover:text-red-700 font-medium transition-colors">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-gray-400 text-center py-12">
        Nenhum livro cadastrado.
        <button @click="openCreate" class="text-indigo-600 hover:underline ml-1">Adicionar primeiro livro</button>
      </p>
    </div>

    <BookModal v-if="showModal" :book="editingBook" @save="handleSave" @close="showModal = false" />
    <ConfirmDialog v-if="showConfirm" message="Tem certeza que deseja excluir este livro?"
      @confirm="handleDelete" @cancel="showConfirm = false" />
  </main>
</template>
