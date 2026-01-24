<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Upload, RotateCcw, Copy, Sparkles } from 'lucide-vue-next'
import { ref } from 'vue'

const uploadedVideo = ref<File | null>(null)
const replicationHistory = ref<any[]>([])

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadedVideo.value = target.files[0]
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold mb-2">Sora 2 爆款复刻</h1>
      <p class="text-sm text-muted-foreground">
        上传最长 30 秒的视频，AI 将深度理解视频内容的视频爆款复刻。
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- 提示词复刻 -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Sparkles class="w-4 h-4 text-green-600" />
          </div>
          <h3 class="font-semibold">提示词复刻</h3>
        </div>
        <p class="text-sm text-muted-foreground">
          上传视频立即开始分析复刻 Sora2 提示词
        </p>
        
        <div class="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <input
            type="file"
            accept="video/*"
            class="hidden"
            id="video-upload"
            @change="handleFileUpload"
          />
          <label for="video-upload" class="cursor-pointer">
            <div class="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Upload class="w-8 h-8 text-muted-foreground" />
            </div>
            <p class="font-medium mb-2">点击或拖拽文件到此区域</p>
            <p class="text-sm text-muted-foreground mb-4">
              上传视频立即开始分析复刻 Sora2 提示词
            </p>
          </label>
        </div>

        <div v-if="uploadedVideo" class="border rounded-lg p-4 bg-muted/50">
          <p class="text-sm font-medium mb-2">已上传: {{ uploadedVideo.name }}</p>
          <Button class="w-full" size="sm">
            <Sparkles class="w-4 h-4 mr-2" />
            开始分析
          </Button>
        </div>
      </div>

      <!-- 复刻结果 -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">复刻结果</h3>
          <div class="flex gap-2">
            <Button variant="ghost" size="sm">
              <RotateCcw class="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Copy class="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p class="text-sm text-muted-foreground">
          根据关键点，细节要求进一步修改提示词。
        </p>
        
        <div class="border rounded-lg p-6 min-h-[300px] flex items-center justify-center">
          <div class="text-center text-muted-foreground">
            <Sparkles class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>等待上传视频</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 复刻历史 -->
    <div class="mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">复刻历史</h2>
      </div>
      
      <div v-if="replicationHistory.length === 0" class="border rounded-lg p-12 text-center">
        <p class="text-muted-foreground">暂无记录</p>
      </div>
    </div>
  </div>
</template>