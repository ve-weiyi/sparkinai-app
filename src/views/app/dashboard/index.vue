<script setup lang="ts">
import { useVideos } from '@/composables/useVideos.ts'
import { useUserData } from '@/composables/useUserData.ts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Heart, Play, Eye, Upload, Video, Mic, Sparkles, Image as ImageIcon, Send, Link, FileText, TrendingUp, Wand2, ArrowUp, Loader2 } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const { videos } = useVideos()
const { currentUser } = useUserData()
const router = useRouter()

const activeTab = ref('视频生成')
const promptText = ref('')
const quickAction = ref('')
const isGenerating = ref(false)
const fileInput = ref<HTMLInputElement>()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) {
    promptText.value = `已上传文件: ${target.files[0].name}\n\n` + promptText.value
  }
}

const handleAddLink = () => {
  const link = prompt('请输入视频链接（支持 TikTok、抖音等）')
  if (link) {
    promptText.value = `视频链接: ${link}\n\n` + promptText.value
  }
}

const handleGenerate = async () => {
  if (!promptText.value.trim()) return
  
  isGenerating.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isGenerating.value = false
  const targetRoute = activeTab.value === '视频分析' ? '/app/video-analysis' : '/app/video-generation'
  promptText.value = ''
  router.push(targetRoute)
}

const handleQuickActionClick = (action: string) => {
  quickAction.value = action
  const prompts: Record<string, string> = {
    analyze: '请帮我分析这个视频的脚本结构、镜头语言和文案风格',
    remake: '请帮我复刻这个爆款视频，保持相同的风格和节奏',
    create: '请根据这个视频的风格，帮我创作一个新的爆款视频'
  }
  promptText.value = prompts[action] || ''
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center space-y-4">
      <h1 class="text-3xl font-bold">分析、复刻或生成爆款视频</h1>

      <div class="flex gap-4 justify-center">
        <Button
          variant="ghost"
          :class="{ 'text-blue-600 border-b-2 border-blue-600': activeTab === '视频生成' }"
          @click="activeTab = '视频生成'"
        >
          视频生成
        </Button>
        <Button
          variant="ghost"
          :class="{ 'text-blue-600 border-b-2 border-blue-600': activeTab === '视频分析' }"
          @click="activeTab = '视频分析'"
        >
          视频分析
        </Button>
      </div>
    </div>

    <div class="max-w-4xl mx-auto">
      <div class="border rounded-2xl p-6 bg-card shadow-sm">
        <div class="space-y-4">
          <!-- 视频分析模式 -->
          <template v-if="activeTab === '视频分析'">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-sm text-muted-foreground">想做什么</span>
              <Button
                variant="outline"
                size="sm"
                class="rounded-full gap-2"
                :class="{ 'border-green-600 text-green-600 bg-green-50': quickAction === 'analyze' }"
                @click="handleQuickActionClick('analyze')"
              >
                <FileText class="w-4 h-4" />
                分析脚本
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="rounded-full gap-2"
                :class="{ 'border-orange-600 text-orange-600 bg-orange-50': quickAction === 'remake' }"
                @click="handleQuickActionClick('remake')"
              >
                <TrendingUp class="w-4 h-4" />
                复刻爆款
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="rounded-full gap-2"
                :class="{ 'border-blue-600 text-blue-600 bg-blue-50': quickAction === 'create' }"
                @click="handleQuickActionClick('create')"
              >
                <Wand2 class="w-4 h-4" />
                创作爆款
              </Button>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex-1">
                <Textarea
                  v-model="promptText"
                  placeholder="上传视频文件或粘贴 TikTok 视频链接，然后问我任何问题..."
                  class="min-h-[120px] resize-none border-0 focus-visible:ring-0 p-0 text-base"
                />
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t">
              <div class="flex items-center gap-2">
                <Button variant="ghost" size="sm" class="gap-2" @click="fileInput?.click()">
                  <Upload class="w-4 h-4" />
                  上传视频
                </Button>
                <input ref="fileInput" type="file" accept="video/*" class="hidden" @change="handleFileUpload" />
                <Button variant="ghost" size="sm" class="gap-2" @click="handleAddLink">
                  <Link class="w-4 h-4" />
                  添加链接
                </Button>
              </div>

              <Button size="sm" class="rounded-full w-10 h-10 p-0" :disabled="!promptText.trim() || isGenerating" @click="handleGenerate">
                <Loader2 v-if="isGenerating" class="w-4 h-4 animate-spin" />
                <ArrowUp v-else class="w-4 h-4" />
              </Button>
            </div>
          </template>

          <!-- 视频生成模式 -->
          <template v-else>
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Sparkles class="w-5 h-5" />
              </div>
              <div class="flex-1">
                <Textarea
                  v-model="promptText"
                  placeholder="上传视频链接，我们将深度分析视频内容和数据（人物、场景、动作等），帮您生成人物介绍、故事情节等信息。

新手用户提醒：请先上传视频"
                  class="min-h-[120px] resize-none border-0 focus-visible:ring-0 p-0 text-base"
                />
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t">
              <div class="flex items-center gap-2">
                <Button variant="ghost" size="sm" class="gap-2" @click="fileInput?.click()">
                  <Upload class="w-4 h-4" />
                  文件
                </Button>
                <input ref="fileInput" type="file" accept="video/*,image/*" class="hidden" @change="handleFileUpload" />
                <Button variant="ghost" size="sm" class="gap-2">
                  <Video class="w-4 h-4" />
                  视频 / 图像
                </Button>
                <Button variant="ghost" size="sm" class="gap-2">
                  <Mic class="w-4 h-4" />
                  选择音频
                </Button>
                <Button variant="ghost" size="sm" class="gap-2">
                  <Sparkles class="w-4 h-4" />
                  提示词模板
                </Button>
                <Button variant="ghost" size="sm" class="gap-2">
                  <ImageIcon class="w-4 h-4" />
                  画质
                </Button>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">{{ promptText.length }}/10000</span>
                <Button size="sm" class="rounded-full w-8 h-8 p-0" :disabled="!promptText.trim() || isGenerating" @click="handleGenerate">
                  <Loader2 v-if="isGenerating" class="w-4 h-4 animate-spin" />
                  <Send v-else class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="text-center mt-4">
        <Button variant="link" class="text-sm text-muted-foreground" as-child>
          <RouterLink :to="activeTab === '视频分析' ? '/app/video-analysis' : '/app/video-generation/records'">
            {{ activeTab === '视频分析' ? '我的会话记录' : '我生成的视频' }} →
          </RouterLink>
        </Button>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">灵感广场</h2>
        <Button variant="link">More</Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div
          v-for="video in videos"
          :key="video.id"
          class="group cursor-pointer"
        >
          <div class="relative aspect-[9/16] rounded-lg overflow-hidden bg-muted mb-2">
            <img
              :src="video.thumbnail"
              :alt="video.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play class="w-12 h-12 text-white" />
            </div>
            <div class="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {{ video.duration }}
            </div>
          </div>
          <div class="flex items-center gap-2 mb-1">
            <Avatar class="w-6 h-6">
              <AvatarImage :src="video.creator.avatar" />
              <AvatarFallback>{{ video.creator.name[0] }}</AvatarFallback>
            </Avatar>
            <span class="text-sm font-medium">{{ video.creator.name }}</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-muted-foreground">
            <span class="flex items-center gap-1">
              <Eye class="w-3 h-3" />
              {{ video.views }}
            </span>
            <span class="flex items-center gap-1">
              <Heart class="w-3 h-3" />
              {{ video.likes }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
