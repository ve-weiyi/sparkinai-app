import { Home, Image, Video, Sparkles, History } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

// Extend Vue Router's meta type to include our custom properties
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: Component
    badge?: string
    showInMenu?: boolean
    showInBreadcrumb?: boolean
    isGroup?: boolean
    isCollapsible?: boolean
  }
}

// App route components (lazy loaded)
const DashboardPage = () => import('@/views/app/dashboard/index.vue')
const ImageGenerationPage = () => import('@/views/app/image-generation/index.vue')
const ProductImagesGenerationPage = () => import('@/views/app/product-images-generation/index.vue')
const VideoGenerationPage = () => import('@/views/app/video-generation/index.vue')
const VideoGenerationRecordsPage = () => import('@/views/app/video-generation/records.vue')
const VideoAnalysisPage = () => import('@/views/app/video-analysis/index.vue')
const UserCenterPage = () => import('@/views/app/user-center/index.vue')

const AppLayout = () => import('@/layouts/AppLayout.vue')

// Menu configuration using RouteRecordRaw with children for grouping
export const menuConfig: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: ProductImagesGenerationPage,
    meta: {
      title: '图片生成',
      icon: Image,
    },
  },
  // {
  //   path: 'product-images-generation',
  //   name: 'product-images-generation',
  //   component: ProductImagesGenerationPage,
  //   meta: {
  //     title: '商品套图',
  //     icon: Image,
  //   },
  // },
  // {
  //   path: 'image-generation',
  //   name: 'image-generation',
  //   component: ImageGenerationPage,
  //   meta: {
  //     title: '图片生成',
  //     icon: Image,
  //   },
  // },
  // {
  //   path: 'creation',
  //   name: 'creation',
  //   component: AppLayout,
  //   meta: {
  //     title: '创作',
  //     isGroup: true,
  //   },
  //   children: [
  //     {
  //       path: 'creation/video-generation',
  //       name: 'video-generation',
  //       component: VideoGenerationPage,
  //       meta: {
  //         title: '视频生成',
  //         icon: Video,
  //         badge: 'Veo 3.1等',
  //       },
  //     },
  //     {
  //       path: 'creation/records',
  //       name: 'video-generation-records',
  //       component: VideoGenerationRecordsPage,
  //       meta: {
  //         title: '生成记录',
  //         showInMenu: false,
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: 'tools',
  //   name: 'tools',
  //   component: AppLayout,
  //   meta: {
  //     title: '工具',
  //     isGroup: true,
  //   },
  //   children: [
  //     {
  //       path: 'tools/video-analysis',
  //       name: 'video-analysis',
  //       component: VideoAnalysisPage,
  //       meta: {
  //         title: '视频分析',
  //         icon: Sparkles,
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: 'chat-history',
  //   name: 'chat-history',
  //   component: AppLayout,
  //   meta: {
  //     title: '会话历史',
  //     icon: History,
  //     isCollapsible: true,
  //   },
  //   children: [],
  // },
]

const flattenRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
  return routes.flatMap((route) => {
    const result: RouteRecordRaw[] = [route]
    if (route.children) {
      result.push(...flattenRoutes(route.children))
    }
    return result
  })
}

export const appRoutes: RouteRecordRaw[] = flattenRoutes(menuConfig)

appRoutes.push({
  path: 'user-center',
  name: 'user-center',
  component: UserCenterPage,
  meta: {
    title: '个人中心',
    showInMenu: false,
  },
})

/**
 * Build a flat map of routes for breadcrumb generation
 */
const buildRouteMap = (
  routes: RouteRecordRaw[],
  parentPath = '',
  parent?: RouteRecordRaw,
): Map<string, { route: RouteRecordRaw; parent?: RouteRecordRaw }> => {
  const map = new Map<string, { route: RouteRecordRaw; parent?: RouteRecordRaw }>()

  routes.forEach((route) => {
    const fullPath = parentPath + '/' + route.path
    const normalizedPath = fullPath.replace(/\/+/g, '/')

    map.set(normalizedPath, { route, parent })

    if (route.children) {
      buildRouteMap(route.children, normalizedPath, route).forEach((value, key) =>
        map.set(key, value),
      )
    }
  })

  return map
}

// Build route map for all routes
const routeMap = new Map([...buildRouteMap(appRoutes, '/app')])

export const getRouteByPath = (path: string) => {
  return routeMap.get(path)
}
