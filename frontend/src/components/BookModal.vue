<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  book: { type: Object, default: null },
})
const emit = defineEmits(['save', 'close'])

const form = ref({
  title: '',
  author: '',
  isbn: '',
  genre: '',
  year: '',
  total_quantity: 1,
})

watch(() => props.book, (val) => {
  if (val) {
    form.value = { ...val }
  } else {
    form.value = { title: '', author: '', isbn: '', genre: '', year: '', total_quantity: 1 }
  }
}, { immediate: true })

function submit() {
  emit('save', { ...form.value })
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
      <h2 class="text-lg font-bold text-gray-800 mb-5">
        {{ book ? 'Editar Livro' : 'Novo Livro' }}
      </h2>

      <form @submit.prevent="submit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input v-model="form.title" required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Autor *</label>
            <input v-model="form.author" required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
            <input v-model="form.isbn"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
            <input v-model="form.genre"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ano</label>
            <input v-model="form.year" type="number" min="1000" max="2099"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantidade total</label>
            <input v-model="form.total_quantity" type="number" min="1"
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
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
