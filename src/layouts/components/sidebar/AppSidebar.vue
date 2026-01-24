<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { RouterLink } from 'vue-router'
import { useUserData } from '@/composables/useUserData'

import { History, Home, Image, Sparkles, Video } from 'lucide-vue-next'
import NavMain from './NavMain.vue'
import NavUser from './NavUser.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const { currentUser } = useUserData()

const data = {
  mainNav: [
    {
      title: '首页',
      url: '/app/dashboard',
      icon: Home,
      isActive: true,
    },
    {
      title: '图片生成',
      url: '/app/image-generation',
      icon: Image,
    },
  ],
  createNav: [
    {
      title: '视频生成',
      url: '/app/video-generation',
      icon: Video,
      badge: 'Veo 3.1等',
    },
  ],
  toolsNav: [
    {
      title: '视频分析',
      url: '/app/video-analysis',
      icon: Sparkles,
    },
  ],
  historyNav: [
    {
      title: '会话历史',
      url: '#',
      icon: History,
      items: [],
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <RouterLink to="/app/dashboard">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <Sparkles class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">CreatOK</span>
                <span class="truncate text-xs">爆款机器人</span>
              </div>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.mainNav" />
      <NavMain title="创作" :items="data.createNav" />
      <NavMain title="工具" :items="data.toolsNav" />
      <NavMain :items="data.historyNav" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser
        v-if="currentUser"
        :user="{ ...currentUser, plan: currentUser.plan, credits: currentUser.credits }"
      />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
