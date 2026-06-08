<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-indigo-700 text-white shadow-lg">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2 text-xl font-bold hover:text-indigo-200 transition-colors">
        📚 BiblioSys
      </RouterLink>

      <div class="flex items-center gap-6 text-sm font-medium">
        <RouterLink to="/" class="hover:text-indigo-200 transition-colors">Dashboard</RouterLink>
        <RouterLink to="/livros" class="hover:text-indigo-200 transition-colors">Livros</RouterLink>
        <RouterLink to="/emprestimos" class="hover:text-indigo-200 transition-colors">Empréstimos</RouterLink>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-sm text-indigo-200 hidden sm:block">{{ auth.user?.email }}</span>
        <button @click="handleLogout"
          class="bg-indigo-900 hover:bg-indigo-800 px-3 py-1 rounded text-sm transition-colors">
          Sair
        </button>
      </div>
    </div>
  </nav>
</template>
