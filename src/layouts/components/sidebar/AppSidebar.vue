<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { SidebarProps } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { Sparkles } from "lucide-vue-next";
import NavMain from "./NavMain.vue";
import NavUser from "./NavUser.vue";
import NavChatHistory from "./NavChatHistory.vue";
import { menuConfig } from "@/router/routes";

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
});

const store = useUserStore();
const { currentUser } = storeToRefs(store);
</script>

<template>
  <Sidebar v-bind="props" class="app-sidebar">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <RouterLink to="/app/dashboard">
              <div
                style="background: linear-gradient(135deg, #ff6a3d, #ffb07a)"
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <Sparkles class="size-4" />
              </div>
              <div class="sidebar-brand-text grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">SparkInAI</span>
                <span class="truncate text-xs">智燃创造</span>
              </div>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :groups="menuConfig" />
      <NavChatHistory />
    </SidebarContent>
    <SidebarFooter>
      <NavUser v-if="currentUser" :user="currentUser" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
