<script setup>
defineProps({
  message: { type: String, default: 'Tem certeza que deseja excluir?' },
})
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
      <p class="text-gray-800 font-medium mb-6">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button @click="$emit('cancel')"
          class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button @click="$emit('confirm')"
          class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
          Excluir
        </button>
      </div>
    </div>
  </div>
</template>
