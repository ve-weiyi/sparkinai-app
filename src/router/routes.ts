import { Heart, Wand2, LayoutDashboard } from "lucide-vue-next";
import type { Component } from "vue";
import type { RouteRecordRaw } from "vue-router";

// Extend Vue Router's meta type to include our custom properties
declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    icon?: Component;
    badge?: string;
    showInMenu?: boolean;
    showInBreadcrumb?: boolean;
    isGroup?: boolean;
    isCollapsible?: boolean;
  }
}

// App route components (lazy loaded)
const DashboardPage = () => import("@/views/app/dashboard/index.vue");
const ImageGenerationChatPage = () => import("@/views/app/image-generation-chat/index.vue");
const ProductImagesGenerationPage = () => import("@/views/app/product-images-generation/index.vue");
const FavoritesPage = () => import("@/views/app/favorites/index.vue");
const UserCenterPage = () => import("@/views/app/user-center/index.vue");
const CustomerServicePage = () => import("@/views/app/customer-service/index.vue");

// Menu configuration using RouteRecordRaw with children for grouping
export const menuConfig: RouteRecordRaw[] = [
  {
    path: "dashboard",
    name: "dashboard",
    component: DashboardPage,
    meta: {
      title: "首页",
      icon: LayoutDashboard,
    },
  },
  {
    path: "image-generation",
    name: "image-generation",
    component: ProductImagesGenerationPage,
    meta: {
      title: "商品图文",
      icon: Wand2,
    },
  },
  {
    path: "image-generation-chat",
    name: "image-generation-chat",
    component: ImageGenerationChatPage,
    meta: {
      title: "图文生成",
      showInMenu: false,
    },
  },
  {
    path: "favorites",
    name: "favorites",
    component: FavoritesPage,
    meta: {
      title: "我的收藏",
      icon: Heart,
      showInMenu: false,
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
];

const flattenRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
  return routes.flatMap((route) => {
    const result: RouteRecordRaw[] = [route];
    if (route.children) {
      result.push(...flattenRoutes(route.children));
    }
    return result;
  });
};

export const appRoutes: RouteRecordRaw[] = flattenRoutes(menuConfig);

appRoutes.push({
  path: "user-center",
  name: "user-center",
  component: UserCenterPage,
  meta: {
    title: "个人中心",
    showInMenu: false,
  },
});

appRoutes.push({
  path: "customer-service",
  name: "customer-service",
  component: CustomerServicePage,
  meta: {
    title: "客服中心",
    showInMenu: false,
  },
});

/**
 * Build a flat map of routes for breadcrumb generation
 */
const buildRouteMap = (
  routes: RouteRecordRaw[],
  parentPath = "",
  parent?: RouteRecordRaw
): Map<string, { route: RouteRecordRaw; parent?: RouteRecordRaw }> => {
  const map = new Map<string, { route: RouteRecordRaw; parent?: RouteRecordRaw }>();

  routes.forEach((route) => {
    const fullPath = parentPath + "/" + route.path;
    const normalizedPath = fullPath.replace(/\/+/g, "/");

    map.set(normalizedPath, { route, parent });

    if (route.children) {
      buildRouteMap(route.children, normalizedPath, route).forEach((value, key) =>
        map.set(key, value)
      );
    }
  });

  return map;
};

// Build route map for all routes
const routeMap = new Map(buildRouteMap(appRoutes, "/app"));

export const getRouteByPath = (path: string) => {
  return routeMap.get(path);
};
