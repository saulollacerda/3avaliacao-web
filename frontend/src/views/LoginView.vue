<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch {
    error.value = 'E-mail ou senha inválidos.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-indigo-50 flex items-center justify-center px-4">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <span class="text-5xl">📚</span>
        <h1 class="text-2xl font-bold text-indigo-800 mt-3">BiblioSys</h1>
        <p class="text-gray-500 text-sm mt-1">Sistema de Gerenciamento de Biblioteca</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input v-model="email" type="email" required placeholder="seu@email.com"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input v-model="password" type="password" required placeholder="••••••••"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <p v-if="error" class="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ error }}
        </p>

        <button type="submit" :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 mt-2">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>
