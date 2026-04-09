<script setup lang="ts">
import { useRouter } from "vue-router";
import { Plus, Trash2, MessageSquare } from "lucide-vue-next";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/store/modules/chat";
import { storeToRefs } from "pinia";

const router = useRouter();
const chatStore = useChatStore();
const { sortedSessions, activeSessionId } = storeToRefs(chatStore);

const newChat = () => {
  chatStore.createSession();
  router.push("/app/dashboard");
};

const selectSession = (id: string) => {
  chatStore.setActiveSession(id);
  router.push("/app/dashboard");
};
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel class="flex items-center justify-between pr-1">
      <span>对话历史</span>
      <button
        @click="newChat"
        class="flex items-center justify-center rounded-md p-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <Plus class="h-3.5 w-3.5" />
      </button>
    </SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-if="sortedSessions.length === 0">
        <div class="px-2 py-1.5 text-xs text-muted-foreground">暂无对话</div>
      </SidebarMenuItem>
      <SidebarMenuItem v-for="session in sortedSessions" :key="session.id" class="group/item">
        <SidebarMenuButton
          :is-active="session.id === activeSessionId"
          @click="selectSession(session.id)"
        >
          <MessageSquare class="h-4 w-4 shrink-0" />
          <span class="truncate text-sm">{{ session.title }}</span>
        </SidebarMenuButton>
        <SidebarMenuAction
          class="opacity-0 group-hover/item:opacity-100"
          @click.stop="chatStore.deleteSession(session.id)"
        >
          <Trash2 class="h-3.5 w-3.5" />
        </SidebarMenuAction>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
