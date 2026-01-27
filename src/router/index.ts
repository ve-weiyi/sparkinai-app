import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { appRoutes } from '@/router/routes.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Standalone routes (landing, login, register, pricing, payment)
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/landing/index.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index.vue'),
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('@/views/pricing/index.vue'),
    },
    {
      path: '/payment/checkout',
      name: 'payment-checkout',
      component: () => import('@/views/payment/checkout.vue'),
    },
    {
      path: '/payment/process',
      name: 'payment-process',
      component: () => import('@/views/payment/process.vue'),
    },
    {
      path: '/payment/result',
      name: 'payment-result',
      component: () => import('@/views/payment/result.vue'),
    },

    // App routes (with layout)
    {
      path: '/app',
      component: AppLayout,
      children: appRoutes,
    },
  ],
})

export default router
