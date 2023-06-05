import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user/login',
      name: 'UserLogin',
      component: () => import('../views/UserLoginView.vue')
    },
    {
      path: '/user/register',
      name: 'UserRegister',
      component: () => import('../views/UserRegisterView.vue')
    },
    {
      path: '/user/dashboard',
      name: 'UserDashboard',
      component: () => import('../views/UserView.vue')
    },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: () => import('../views/AdminLoginView.vue')
    },
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/user/dashboard'
    }
  ]
})

export default router
