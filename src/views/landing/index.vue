<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGetStarted = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between px-8 py-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <Sparkles class="w-5 h-5 text-white" />
        </div>
        <span class="text-xl font-bold">内容生产平台</span>
      </div>
      <div class="flex items-center gap-4">
        <Button variant="ghost" @click="router.push('/login')">
          登录
        </Button>
        <Button @click="handleGetStarted">
          立即开始
        </Button>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="flex-1 flex flex-col items-center justify-center px-8 text-center">
      <div class="max-w-4xl space-y-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm">
          <Sparkles class="w-4 h-4" />
          AI 驱动的内容创作神器
        </div>

        <h1 class="text-6xl font-bold leading-tight">
          让每一份好物，都成为<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-orange-500">
            多平台爆款内容
          </span>
        </h1>

        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          专为内容创作者设计的 AI 智能体。只需上传一张白底图，剩下的交给 AI。自动生成吸睛文案与电影级场景配图，精准还原产品，支持多平台内容生产，赋能企业高效运营。
        </p>

        <div class="pt-4">
          <Button size="lg" class="text-lg px-8 py-6" @click="handleGetStarted">
            立即开始体验 →
          </Button>
        </div>
      </div>
    </main>
  </div>
</template>
