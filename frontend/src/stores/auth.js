import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const token = computed(() => session.value?.access_token)

  async function init() {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null

    supabase.auth.onAuthStateChange((_event, _session) => {
      session.value = _session
      user.value = _session?.user ?? null
    })
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    session.value = data.session
    user.value = data.user
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    session.value = null
  }

  return { user, session, isAuthenticated, token, init, login, logout }
})
