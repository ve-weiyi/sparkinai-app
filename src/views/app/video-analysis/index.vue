<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Upload, Link } from 'lucide-vue-next'

const activeTab = ref('分析视频')
</script>

<template>
  <div class="space-y-6">
    <div class="text-center space-y-4">
      <h1 class="text-3xl font-bold">分析、复刻或生成爆款视频</h1>
    </div>

    <div class="max-w-4xl mx-auto">
      <div class="border rounded-2xl p-6 bg-card shadow-sm">
        <div class="space-y-4">
          <div class="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              class="rounded-full"
              :class="{ 'bg-green-50 text-green-600 border-green-600': activeTab === '分析视频' }"
              @click="activeTab = '分析视频'"
            >
              分析视频
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="rounded-full"
              :class="{ 'bg-orange-50 text-orange-600 border-orange-600': activeTab === '复刻视频' }"
              @click="activeTab = '复刻视频'"
            >
              复刻视频
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="rounded-full"
              :class="{ 'bg-blue-50 text-blue-600 border-blue-600': activeTab === '创作视频' }"
              @click="activeTab = '创作视频'"
            >
              创作视频
            </Button>
          </div>

          <p class="text-sm text-muted-foreground text-center">
            上传视频文件或粘贴 TikTok 视频链接，然后问我任何问题...
          </p>

          <div class="flex gap-3 justify-center pt-2">
            <Button variant="outline" class="gap-2">
              <Upload class="w-4 h-4" />
              上传视频
            </Button>
            <Button variant="outline" class="gap-2">
              <Link class="w-4 h-4" />
              添加链接
            </Button>
          </div>
        </div>
      </div>
    </div>

    <Separator />

    <div class="max-w-4xl mx-auto">
      <h2 class="text-lg font-semibold mb-4">会话历史</h2>
      <div class="border rounded-lg p-12 text-center text-muted-foreground bg-muted/20">
        暂无会话历史
      </div>
    </div>
  </div>
</template>