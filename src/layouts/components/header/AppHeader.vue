<script setup lang="ts">
import { computed } from 'vue'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { RouterLink, useRoute } from 'vue-router'
import { HelpCircle, MessageSquare, Crown, Sparkles, Zap } from 'lucide-vue-next'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserData } from '@/composables/useUserData'
import { getRouteByPath } from '@/router/routes.ts'

const route = useRoute()
const { currentUser, creditOptions } = useUserData()

const breadcrumbs = computed(() => {
  const result = getRouteByPath(route.path)
  if (!result) return []

  const items: Array<{ title: string; path: string; isCurrent?: boolean }> = []

  items.push({ title: result.route.meta?.title || '', path: route.path, isCurrent: true })

  return items
})
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
    <SidebarTrigger class="-ml-1" />
    <Separator orientation="vertical" class="mr-2 h-4" />
    <Breadcrumb>
      <BreadcrumbList>
        <template v-for="(item, index) in breadcrumbs" :key="item.title">
          <BreadcrumbItem>
            <BreadcrumbLink v-if="!item.isCurrent" as-child>
              <RouterLink :to="item.path">
                {{ item.title }}
              </RouterLink>
            </BreadcrumbLink>
            <BreadcrumbPage v-else>
              {{ item.title }}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
        </template>
      </BreadcrumbList>
    </Breadcrumb>
    <div class="ml-auto flex items-center gap-2">
      <Button variant="ghost" size="icon" class="h-9 w-9">
        <HelpCircle class="h-5 w-5 text-muted-foreground" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="h-9 w-9">
            <MessageSquare class="h-5 w-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-[300px] p-6">
          <div class="text-center space-y-4">
            <div class="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
              <img
                src="https://placehold.co/200x200/png?text=QR+Code"
                alt="微信二维码"
                class="w-full h-full"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-1">微信扫码</h3>
              <p class="text-sm text-muted-foreground">加入用户交流群</p>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="sm"
        class="gap-1 text-orange-600 hover:text-orange-700"
        as-child
      >
        <RouterLink to="/pricing">
          <Crown class="h-4 w-4" />
          升级
        </RouterLink>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="sm" class="gap-1 bg-muted hover:bg-muted/80">
            <Sparkles class="h-4 w-4 text-green-600" />
            {{ currentUser?.credits || 0 }}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-[350px] p-6">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <Zap class="w-5 h-5 text-green-600" />
              <h3 class="text-lg font-semibold">{{ currentUser?.plan }} 计划</h3>
            </div>

            <div class="bg-muted/50 rounded-lg p-4">
              <div class="h-2 bg-muted rounded-full mb-3" />
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-medium"
                  >{{ currentUser?.credits || 0 }}/{{ currentUser?.credits || 6 }} 积分</span
                >
                <Button variant="link" size="sm" class="h-auto p-0 text-sm">
                  剩余 {{ currentUser?.credits || 6 }} 积分 →
                </Button>
              </div>

              <div class="space-y-3">
                <p class="text-sm font-medium">积分消耗说明</p>
                <div
                  v-for="option in creditOptions"
                  :key="option.name"
                  class="flex justify-between text-sm"
                >
                  <span>{{ option.name }}</span>
                  <span v-if="option.label" class="text-green-600 font-medium">{{
                    option.label
                  }}</span>
                  <span v-else class="font-medium">{{ option.credits }} 积分</span>
                </div>
              </div>

              <Button class="w-full mt-4" size="sm" as-child>
                <RouterLink to="/pricing">
                  <Crown class="w-4 h-4 mr-2" />
                  升级/续费
                </RouterLink>
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
