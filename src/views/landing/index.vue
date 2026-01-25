<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Zap, Image, Wand2, TrendingUp, Shield, Clock } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGetStarted = () => {
  router.push('/login')
}

const features = [
  {
    icon: Wand2,
    title: 'AI 智能生成',
    description: '先进的 AI 算法，自动分析产品特征，生成专业级商品图片'
  },
  {
    icon: Image,
    title: '多场景适配',
    description: '支持电商、社交媒体等多平台，一键生成符合规范的内容'
  },
  {
    icon: Zap,
    title: '极速处理',
    description: '秒级生成高质量图片，大幅提升内容创作效率'
  },
  {
    icon: TrendingUp,
    title: '转化率提升',
    description: '专业的视觉呈现，有效提升商品点击率和转化率'
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: '企业级数据安全保障，保护您的商业机密'
  },
  {
    icon: Clock,
    title: '7x24 服务',
    description: '全天候在线服务，随时随地创作优质内容'
  }
]

const steps = [
  { number: '01', title: '上传图片', desc: '上传商品白底图或产品照片' },
  { number: '02', title: 'AI 分析', desc: 'AI 自动识别产品特征和属性' },
  { number: '03', title: '生成内容', desc: '一键生成多平台营销素材' },
  { number: '04', title: '下载使用', desc: '下载高清图片，立即投放使用' }
]

const stats = [
  { value: '100K+', label: '用户信赖' },
  { value: '1M+', label: '图片生成' },
  { value: '99.9%', label: '服务可用性' },
  { value: '4.9/5', label: '用户评分' }
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b">
      <div class="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold">内容生产平台</span>
        </div>
        <div class="flex items-center gap-4">
          <Button variant="ghost" @click="router.push('/pricing')">
            定价
          </Button>
          <Button variant="ghost" @click="router.push('/login')">
            登录
          </Button>
          <Button @click="handleGetStarted">
            立即开始
          </Button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="flex-1 flex flex-col items-center justify-center px-8 py-20 text-center">
      <div class="max-w-5xl space-y-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-pink-50 text-orange-600 text-sm font-medium border border-orange-200">
          <Sparkles class="w-4 h-4" />
          AI 驱动的内容创作神器
        </div>

        <h1 class="text-6xl font-bold leading-tight">
          让每一份好物，都成为<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-orange-500">
            多平台爆款内容
          </span>
        </h1>

        <p class="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          专为内容创作者设计的 AI 智能体。只需上传一张白底图，剩下的交给 AI。自动生成吸睛文案与电影级场景配图，精准还原产品，支持多平台内容生产，赋能企业高效运营。
        </p>

        <div class="flex items-center justify-center gap-4 pt-4">
          <Button size="lg" class="text-lg px-8 py-6" @click="handleGetStarted">
            立即开始体验 →
          </Button>
          <Button size="lg" variant="outline" class="text-lg px-8 py-6" @click="router.push('/pricing')">
            查看定价
          </Button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-4 gap-8 pt-12 max-w-3xl mx-auto">
          <div v-for="stat in stats" :key="stat.label" class="space-y-1">
            <div class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              {{ stat.value }}
            </div>
            <div class="text-sm text-muted-foreground">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="px-8 py-20 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center space-y-4 mb-16">
          <h2 class="text-4xl font-bold">强大功能，助力内容创作</h2>
          <p class="text-lg text-muted-foreground">一站式解决方案，让内容创作更简单高效</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="feature in features" :key="feature.title" class="border-2 hover:border-orange-200 hover:shadow-lg transition-all">
            <CardContent class="p-6 space-y-4">
              <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                <component :is="feature.icon" class="w-6 h-6 text-orange-600" />
              </div>
              <h3 class="text-xl font-semibold">{{ feature.title }}</h3>
              <p class="text-muted-foreground">{{ feature.description }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="px-8 py-20 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center space-y-4 mb-16">
          <h2 class="text-4xl font-bold">简单四步，轻松创作</h2>
          <p class="text-lg text-muted-foreground">从上传到发布，全程 AI 智能辅助</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div v-for="(step, index) in steps" :key="step.number" class="relative">
            <div class="text-center space-y-4">
              <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                {{ step.number }}
              </div>
              <h3 class="text-xl font-semibold">{{ step.title }}</h3>
              <p class="text-muted-foreground">{{ step.desc }}</p>
            </div>
            <div v-if="index < steps.length - 1" class="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-300 to-pink-300" />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="px-8 py-20 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
      <div class="max-w-4xl mx-auto text-center space-y-8">
        <h2 class="text-4xl font-bold">准备好开始创作了吗？</h2>
        <p class="text-xl opacity-90">加入数万创作者，让 AI 助力您的内容营销</p>
        <div class="flex items-center justify-center gap-4">
          <Button size="lg" variant="secondary" class="text-lg px-8 py-6" @click="handleGetStarted">
            免费开始使用
          </Button>
          <Button size="lg" variant="outline" class="text-lg px-8 py-6 bg-transparent text-white border-white hover:bg-white/10" @click="router.push('/pricing')">
            了解更多
          </Button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-8 py-12 bg-gray-900 text-gray-400">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles class="w-5 h-5 text-white" />
              </div>
              <span class="text-xl font-bold text-white">内容生产平台</span>
            </div>
            <p class="text-sm">AI 驱动的智能内容创作平台</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">产品</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">图片生成</a></li>
              <li><a href="#" class="hover:text-white transition-colors">视频分析</a></li>
              <li><a href="#" class="hover:text-white transition-colors">定价方案</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">支持</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">帮助中心</a></li>
              <li><a href="#" class="hover:text-white transition-colors">API 文档</a></li>
              <li><a href="#" class="hover:text-white transition-colors">联系我们</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">关于</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">关于我们</a></li>
              <li><a href="#" class="hover:text-white transition-colors">隐私政策</a></li>
              <li><a href="#" class="hover:text-white transition-colors">服务条款</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center text-sm">
          <p>© 2024 内容生产平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
