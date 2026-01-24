<script setup lang="ts">
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from './components/sidebar/AppSidebar.vue'
import AppHeader from './components/header/AppHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <SidebarProvider
    :style="{
      '--sidebar-width': 'calc(var(--spacing) * 72)',
      '--header-height': 'calc(var(--spacing) * 12)',
    }"
  >
    <AppSidebar variant="inset" />
    <SidebarInset>
      <AppHeader />
      <div class="flex flex-1 flex-col gap-4 p-4 overflow-auto">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
