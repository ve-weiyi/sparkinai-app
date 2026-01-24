<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue'
import { Sparkles } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8">
    <div class="w-full max-w-md">
      <div class="flex items-center justify-center gap-2 mb-8">
        <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <Sparkles class="w-5 h-5 text-white" />
        </div>
        <span class="text-xl font-bold">内容生产平台</span>
      </div>
      <LoginForm />
    </div>
  </div>
</template>
