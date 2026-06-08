import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/registro',
    component: () => import('../views/RegisterView.vue'),
    meta: { public: true },
  },
  { path: '/', component: () => import('../views/DashboardView.vue') },
  { path: '/livros', component: () => import('../views/BooksView.vue') },
  { path: '/emprestimos', component: () => import('../views/LoansView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) return '/login'
  if (to.path === '/login' && auth.isAuthenticated) return '/'
})

export default router
