<script setup lang="ts">
import { useRouter, useLink } from "vue-router";
import { Plus, Trash2, MessageSquare } from "lucide-vue-next";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useChatStore } from "@/store/modules/chat";
import { storeToRefs } from "pinia";
import { MessageSquarePlus, ChevronRight } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();
const chatStore = useChatStore();
const { sortedSessions, activeSessionId } = storeToRefs(chatStore);

const isActive = computed(() => route.path.startsWith("/app/image-generation-chat"));

const newChat = () => {
  const active = chatStore.activeSession;
  if (!active || active.messages.length > 0) {
    chatStore.createSession();
  }
  router.push("/app/image-generation-chat");
};

const selectSession = (id: string) => {
  chatStore.setActiveSession(id);
  router.push("/app/image-generation-chat");
};
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <Collapsible as-child :default-open="true" class="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton :is-active="isActive" :tooltip="'图文生成'">
              <MessageSquarePlus class="h-4 w-4" />
              <span>图文生成</span>
              <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton @click="newChat" class="cursor-pointer">
                  <Plus class="h-3.5 w-3.5" />
                  <span>新对话</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem v-if="sortedSessions.length === 0">
                <div class="px-2 py-1 text-xs text-muted-foreground">暂无对话</div>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem v-for="session in sortedSessions" :key="session.id" class="group/item">
                <SidebarMenuSubButton
                  :is-active="session.id === activeSessionId && isActive"
                  @click="selectSession(session.id)"
                  class="cursor-pointer"
                >
                  <MessageSquare class="h-3.5 w-3.5 shrink-0" />
                  <span class="truncate">{{ session.title }}</span>
                </SidebarMenuSubButton>
                <SidebarMenuAction
                  class="opacity-0 group-hover/item:opacity-100"
                  @click.stop="chatStore.deleteSession(session.id)"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </SidebarMenuAction>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
