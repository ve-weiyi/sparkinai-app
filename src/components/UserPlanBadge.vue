<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'

defineProps<{
  credits: number
  plan: string
}>()
</script>

<template>
  <div class="flex items-center gap-1 bg-muted hover:bg-muted/80 rounded-md px-3 py-1.5 text-sm">
    <Sparkles class="h-4 w-4 text-green-600" />
    <span class="font-medium">{{ credits }}</span>
    <span class="text-muted-foreground">·</span>
    <span class="text-muted-foreground">{{ plan }}</span>
  </div>
</template>
