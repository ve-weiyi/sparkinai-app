<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronRight,
  ChevronsUpDown,
  Crown,
  Gift,
  Heart,
  Languages,
  LogOut,
  Monitor,
  Moon,
  ShoppingCart,
  Sparkles,
  Sun,
  User,
} from 'lucide-vue-next'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  user: {
    name: string
    email: string
    avatar: string
    plan: string
    credits: number
  }
}>()

const { isMobile } = useSidebar()
const router = useRouter()

const theme = ref<'light' | 'dark' | 'system'>('system')

onMounted(() => {
  theme.value = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system'
  applyTheme()
})

const applyTheme = () => {
  if (theme.value === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', isDark)
  } else {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
  }
}

const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  applyTheme()
}

const handleLogout = () => {
  localStorage.clear()
  sessionStorage.clear()
  router.push('/')
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground px-4"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user.avatar" :alt="user.name" />
              <AvatarFallback class="rounded-lg bg-green-600 text-white">
                {{ user.name[0] }}
              </AvatarFallback>
            </Avatar>
            <div
              class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden"
            >
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[230px] rounded-lg p-3 overflow-hidden"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <div class="flex items-center gap-2 px-1 py-2 min-w-0">
            <Avatar class="h-9 w-9 rounded-lg flex-shrink-0">
              <AvatarImage :src="user.avatar" :alt="user.name" />
              <AvatarFallback class="rounded-lg bg-green-600 text-white">
                {{ user.name[0] }}
              </AvatarFallback>
            </Avatar>
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-sm truncate">{{ user.name }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ user.email }}</p>
            </div>
          </div>

          <DropdownMenuSeparator class="my-2" />

          <div class="bg-muted/50 rounded-lg p-2 space-y-2">
            <div class="flex items-center justify-between px-1">
              <span class="text-sm font-semibold">{{ user.plan }} 计划</span>
              <Button variant="ghost" size="sm" class="h-6 gap-1 text-orange-600 text-xs px-2">
                <Crown class="w-3 h-3" />
                升级
              </Button>
            </div>

            <div class="flex items-center justify-between px-1">
              <span class="text-xs text-muted-foreground">积分</span>
              <div class="flex items-center gap-1.5">
                <Sparkles class="w-3 h-3.5 text-green-600" />
                <span class="text-sm font-medium">{{ user.credits }}</span>
                <ChevronRight class="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </div>
          </div>

          <DropdownMenuSeparator class="my-2" />

          <DropdownMenuItem class="py-1 px-1">
            <Heart class="w-4 h-4 mr-2" />
            <span class="text-sm">我的收藏</span>
          </DropdownMenuItem>

          <DropdownMenuItem class="py-1 px-1">
            <Gift class="w-4 h-4 mr-2" />
            <span class="text-sm">我的邀请</span>
          </DropdownMenuItem>

          <DropdownMenuItem class="py-1 px-1">
            <ShoppingCart class="w-4 h-4 mr-2" />
            <span class="text-sm">我的订单</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator class="my-2" />

          <DropdownMenuItem class="py-1 px-1" @click="router.push('/app/user-center')">
            <User class="w-4 h-4 mr-2" />
            <span class="text-sm">账户</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator class="my-2" />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger class="py-1 px-1">
              <Languages class="w-4 h-4 mr-4" />
              <span class="text-sm">语言</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem class="py-1 px-1">
                <span class="text-sm">简体中文</span>
              </DropdownMenuItem>
              <DropdownMenuItem class="py-1 px-1">
                <span class="text-sm">English</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger class="py-1 px-1">
              <Sun class="w-4 h-4 mr-4" />
              <span class="text-sm">主题</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem class="py-1 px-1" @click="setTheme('light')">
                <Sun class="w-4 h-4 mr-2" />
                <span class="text-sm">浅色</span>
              </DropdownMenuItem>
              <DropdownMenuItem class="py-1 px-1" @click="setTheme('dark')">
                <Moon class="w-4 h-4 mr-2" />
                <span class="text-sm">深色</span>
              </DropdownMenuItem>
              <DropdownMenuItem class="py-1 px-1" @click="setTheme('system')">
                <Monitor class="w-4 h-4 mr-2" />
                <span class="text-sm">系统</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator class="my-2" />

          <DropdownMenuItem class="py-1 px-1" @click="handleLogout">
            <LogOut class="w-4 h-4 mr-2" />
            <span class="text-sm">退出</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>


