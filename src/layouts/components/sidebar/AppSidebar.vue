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
import { Sparkles } from 'lucide-vue-next'
import NavMain from './NavMain.vue'
import NavUser from './NavUser.vue'
import { menuConfig } from '@/router/routes.ts'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const { currentUser } = useUserData()

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
                <span class="truncate font-semibold">SparkInAI</span>
                <span class="truncate text-xs">爆款机器人</span>
              </div>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :groups="menuConfig" />
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
