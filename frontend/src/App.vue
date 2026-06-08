<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'

const auth = useAuthStore()
onMounted(() => auth.init())
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar v-if="auth.isAuthenticated" />
    <RouterView />
  </div>
</template>
