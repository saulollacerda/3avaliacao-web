<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const router = useRouter()

async function handleRegister() {
  error.value = ''
  success.value = ''
  if (password.value !== confirm.value) {
    error.value = 'As senhas não coincidem.'
    return
  }
  loading.value = true
  try {
    await api.post('/api/auth/register', { email: email.value, password: password.value })
    success.value = 'Conta criada! Verifique seu e-mail e faça login.'
  } catch (e) {
    error.value = e.response?.data?.error ?? 'Erro ao criar conta.'
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
        <h1 class="text-2xl font-bold text-indigo-800 mt-3">Criar Conta</h1>
        <p class="text-gray-500 text-sm mt-1">BiblioSys — Sistema de Biblioteca</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input v-model="email" type="email" required placeholder="seu@email.com"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input v-model="password" type="password" required placeholder="Mínimo 6 caracteres"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
          <input v-model="confirm" type="password" required placeholder="Repita a senha"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <p v-if="error" class="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ error }}
        </p>
        <p v-if="success" class="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {{ success }}
        </p>

        <button type="submit" :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 mt-2">
          {{ loading ? 'Criando conta...' : 'Criar Conta' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Já tem conta?
        <RouterLink to="/login" class="text-indigo-600 hover:underline font-medium">Fazer login</RouterLink>
      </p>
    </div>
  </div>
</template>
