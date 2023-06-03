import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('../views/UserView.vue')
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/login'
    }
  ]
})

export default router
