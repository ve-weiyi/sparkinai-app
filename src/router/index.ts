import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/landing/index.vue'
import LoginPage from '@/views/login/index.vue'
import RegisterPage from '@/views/register/index.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import DashboardPage from '@/views/app/dashboard/index.vue'
import VideoAnalysisPage from '@/views/app/video-analysis/index.vue'
import VideoGenerationPage from '@/views/app/video-generation/index.vue'
import VideoGenerationRecordsPage from '@/views/app/video-generation/records.vue'
import ImageGenerationPage from '@/views/app/image-generation/index.vue'
import UserCenterPage from '@/views/app/user-center/index.vue'
import PricingPage from '@/views/pricing/index.vue'
import PaymentCheckoutPage from '@/views/payment/checkout.vue'
import PaymentProcessPage from '@/views/payment/process.vue'
import PaymentResultPage from '@/views/payment/result.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
    },
    {
      path: '/app',
      component: AppLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardPage,
        },
        {
          path: 'video-analysis',
          name: 'video-analysis',
          component: VideoAnalysisPage,
        },
        {
          path: 'video-generation',
          name: 'video-generation',
          component: VideoGenerationPage,
        },
        {
          path: 'video-generation/records',
          name: 'video-generation-records',
          component: VideoGenerationRecordsPage,
        },
        {
          path: 'image-generation',
          name: 'image-generation',
          component: ImageGenerationPage,
        },
        {
          path: 'user-center',
          name: 'user-center',
          component: UserCenterPage,
        },
      ],
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: PricingPage,
    },
    {
      path: '/payment/checkout',
      name: 'payment-checkout',
      component: PaymentCheckoutPage,
    },
    {
      path: '/payment/process',
      name: 'payment-process',
      component: PaymentProcessPage,
    },
    {
      path: '/payment/result',
      name: 'payment-result',
      component: PaymentResultPage,
    },
  ],
})

export default router
