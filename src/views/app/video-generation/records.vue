<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal, Video, Plus } from 'lucide-vue-next'
import { ref } from 'vue'

const searchQuery = ref('')
const filterTime = ref('all')
const filterType = ref('all')
const filterProduct = ref('all')
const filterTag = ref('all')

const records = ref<any[]>([])
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold mb-1">首页 › 生成记录</h1>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" class="gap-2">
          <SlidersHorizontal class="w-4 h-4" />
          批量操作
        </Button>
        <Button class="gap-2">
          <Plus class="w-4 h-4" />
          批量生成
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <select v-model="filterTime" class="border rounded-md px-3 py-2 text-sm min-w-[140px]">
        <option value="all">时长/清晰度</option>
        <option value="short">短视频</option>
        <option value="long">长视频</option>
      </select>

      <select v-model="filterType" class="border rounded-md px-3 py-2 text-sm min-w-[140px]">
        <option value="all">视频类型</option>
        <option value="product">产品视频</option>
        <option value="tutorial">教程视频</option>
      </select>

      <select v-model="filterProduct" class="border rounded-md px-3 py-2 text-sm min-w-[140px]">
        <option value="all">商品分类</option>
        <option value="electronics">电子产品</option>
        <option value="fashion">时尚服饰</option>
      </select>

      <select v-model="filterTag" class="border rounded-md px-3 py-2 text-sm min-w-[140px]">
        <option value="all">参考图</option>
        <option value="with">有参考图</option>
        <option value="without">无参考图</option>
      </select>

      <select class="border rounded-md px-3 py-2 text-sm min-w-[140px]">
        <option value="all">标签</option>
      </select>

      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="搜索提示词或关键词回车"
          class="pl-9"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="records.length === 0" class="border-2 border-dashed rounded-lg p-16 text-center">
      <div class="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
        <Video class="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-semibold mb-2">暂无生成记录，立即创建你的第一个视频！</h3>
      <Button class="mt-4">
        <Plus class="w-4 h-4 mr-2" />
        创建视频
      </Button>
    </div>
  </div>
</template>
