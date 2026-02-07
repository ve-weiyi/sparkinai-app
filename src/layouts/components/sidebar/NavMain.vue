<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router";
import { RouterLink } from "vue-router";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{
  groups: RouteRecordRaw[];
}>();

const processedGroups = computed(() => {
  const result: Array<{ title?: string; items: any[] }> = [];

  props.groups.forEach((route) => {
    if (route.meta?.isGroup && route.children) {
      // 分组项
      result.push({
        title: route.meta.title,
        items: route.children
          .filter((c) => c.meta?.showInMenu !== false)
          .map((child) => ({
            title: child.meta?.title,
            url: `/app/${child.path}`,
            icon: child.meta?.icon,
            badge: child.meta?.badge,
          })),
      });
    } else if (route.meta?.isCollapsible) {
      // 可折叠项
      result.push({
        items: [
          {
            title: route.meta.title,
            icon: route.meta.icon,
            isActive: true,
            items: route.children || [],
          },
        ],
      });
    } else if (route.meta?.showInMenu !== false) {
      // 普通项
      if (result.length === 0 || result[result.length - 1]?.title) {
        result.push({ items: [] });
      }
      result[result.length - 1]?.items.push({
        title: route.meta?.title,
        url: `/app/${route.path}`,
        icon: route.meta?.icon,
      });
    }
  });

  return result;
});
</script>

<template>
  <SidebarGroup v-for="(group, index) in processedGroups" :key="index">
    <SidebarGroupLabel v-if="group.title">{{ group.title }}</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible
        v-for="item in group.items"
        :key="item.title"
        as-child
        :default-open="item.isActive"
        class="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger v-if="item.items" as-child>
            <SidebarMenuButton :tooltip="item.title">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <SidebarMenuButton v-else :tooltip="item.title" as-child>
            <RouterLink :to="item.url">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
              <span v-if="item.badge" class="ml-auto text-xs text-muted-foreground">
                {{ item.badge }}
              </span>
            </RouterLink>
          </SidebarMenuButton>
          <CollapsibleContent v-if="item.items">
            <SidebarMenuSub>
              <SidebarMenuSubItem v-if="item.items.length === 0">
                <div class="px-2 py-1.5 text-sm text-muted-foreground">No chats</div>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem v-else v-for="subItem in item.items" :key="subItem.title">
                <SidebarMenuSubButton as-child>
                  <RouterLink :to="subItem.url">
                    <span>{{ subItem.title }}</span>
                  </RouterLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
