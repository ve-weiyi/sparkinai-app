import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { appRoutes } from "@/router/routes";
import { App } from "vue";

export const AppLayout = () => import("@/layouts/AppLayout.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  // Standalone routes (landing, login, register, pricing, payment)
  {
    path: "/",
    name: "landing",
    component: () => import("@/views/landing/index.vue"),
  },
  {
    path: "/auth",
    component: () => import("@/views/auth/index.vue"),
    redirect: "/login",
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("@/views/auth/login/index.vue"),
        alias: "/login",
      },
      {
        path: "register",
        name: "register",
        component: () => import("@/views/auth/register/index.vue"),
        alias: "/register",
      },
    ],
  },
  {
    path: "/pricing",
    name: "pricing",
    component: () => import("@/views/pricing/index.vue"),
  },
  {
    path: "/payment/checkout",
    name: "payment-checkout",
    component: () => import("@/views/payment/checkout.vue"),
  },
  {
    path: "/payment/process",
    name: "payment-process",
    component: () => import("@/views/payment/process.vue"),
  },
  {
    path: "/payment/result",
    name: "payment-result",
    component: () => import("@/views/payment/result.vue"),
  },

  // App routes (with layout)
  {
    path: "/app",
    component: AppLayout,
    children: appRoutes,
    meta: { requiresAuth: true },
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  //滚动行为
  scrollBehavior(to, from, savedPosition) {
    // to：即将进入的路由对象
    // from：当前导航正要离开的路由对象
    // savedPosition：上次记录的滚动位置
    // 默认行为，如果有记录的滚动位置，则恢复到该位置
    if (savedPosition) {
      return savedPosition;
    }
    // 没有记录的滚动位置，则滚动到页面顶部
    return { top: 0 };
  },
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
