<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Heart, Download, Trash2, Image as ImageIcon, Video as VideoIcon } from 'lucide-vue-next'
import type { FavoriteItem } from '@/types'
import { toast } from 'vue-sonner'

// 筛选类型
const filterType = ref<string>('all')

// 模拟收藏数据
const favorites = ref<FavoriteItem[]>([
  {
    id: '1',
    type: 'image',
    title: '电商产品图 - 手机壳',
    thumbnail: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
    prompt: '简约风格手机壳,白色背景,产品摄影',
    style: '产品摄影',
    createdAt: '2026-01-26 14:30:00',
    favoritedAt: '2026-01-26 15:00:00',
    tags: ['产品', '手机配件', '简约']
  },
  {
    id: '2',
    type: 'image',
    title: '电商产品图 - 咖啡杯',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    prompt: '精致咖啡杯,温暖光线,生活方式摄影',
    style: '生活方式',
    createdAt: '2026-01-25 10:15:00',
    favoritedAt: '2026-01-25 11:30:00',
    tags: ['生活', '咖啡', '温馨']
  },
  {
    id: '3',
    type: 'video',
    title: '产品展示视频 - 智能手表',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    duration: '00:15',
    createdAt: '2026-01-24 16:45:00',
    favoritedAt: '2026-01-24 17:00:00',
    tags: ['科技', '智能设备', '展示']
  },
  {
    id: '4',
    type: 'image',
    title: '电商产品图 - 运动鞋',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    prompt: '运动鞋特写,动感光影,产品摄影',
    style: '产品摄影',
    createdAt: '2026-01-23 09:20:00',
    favoritedAt: '2026-01-23 10:00:00',
    tags: ['运动', '鞋类', '时尚']
  },
  {
    id: '5',
    type: 'image',
    title: '电商产品图 - 护肤品',
    thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    prompt: '高端护肤品,柔和光线,奢华感',
    style: '奢华风格',
    createdAt: '2026-01-22 18:30:00',
    favoritedAt: '2026-01-22 19:00:00',
    tags: ['美妆', '护肤', '奢华']
  },
  {
    id: '6',
    type: 'video',
    title: '产品展示视频 - 耳机',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    duration: '00:20',
    createdAt: '2026-01-21 08:00:00',
    favoritedAt: '2026-01-21 09:00:00',
    tags: ['音频', '科技', '产品']
  }
])

// 筛选后的收藏
const filteredFavorites = computed(() => {
  if (filterType.value === 'all') {
    return favorites.value
  }
  return favorites.value.filter(item => item.type === filterType.value)
})

// 统计数据
const stats = computed(() => {
  return {
    total: favorites.value.length,
    images: favorites.value.filter(item => item.type === 'image').length,
    videos: favorites.value.filter(item => item.type === 'video').length
  }
})

// 删除收藏
const itemToDelete = ref<FavoriteItem | null>(null)
const showDeleteDialog = ref(false)

const confirmDelete = (item: FavoriteItem) => {
  itemToDelete.value = item
  showDeleteDialog.value = true
}

const deleteItem = () => {
  if (itemToDelete.value) {
    const index = favorites.value.findIndex(item => item.id === itemToDelete.value!.id)
    if (index > -1) {
      favorites.value.splice(index, 1)
      toast.success('已取消收藏')
    }
  }
  showDeleteDialog.value = false
  itemToDelete.value = null
}

// 下载
const downloadItem = (item: FavoriteItem) => {
  // TODO: 实现下载功能
  toast.success(`正在下载: ${item.title}`)
}

// 批量操作
const selectedItems = ref<Set<string>>(new Set())
const isSelectionMode = ref(false)

const toggleSelection = (id: string) => {
  if (selectedItems.value.has(id)) {
    selectedItems.value.delete(id)
  } else {
    selectedItems.value.add(id)
  }
}

const selectAll = () => {
  if (selectedItems.value.size === filteredFavorites.value.length) {
    selectedItems.value.clear()
  } else {
    filteredFavorites.value.forEach(item => selectedItems.value.add(item.id))
  }
}

const deleteSelected = () => {
  favorites.value = favorites.value.filter(item => !selectedItems.value.has(item.id))
  selectedItems.value.clear()
  isSelectionMode.value = false
  toast.success(`已删除 ${selectedItems.value.size} 个收藏`)
}

const cancelSelection = () => {
  selectedItems.value.clear()
  isSelectionMode.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold mb-2">我的收藏</h1>
      <p class="text-gray-600">管理您收藏的图片和视频</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">全部收藏</p>
              <p class="text-2xl font-bold">{{ stats.total }}</p>
            </div>
            <Heart class="w-8 h-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">图片</p>
              <p class="text-2xl font-bold">{{ stats.images }}</p>
            </div>
            <ImageIcon class="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">视频</p>
              <p class="text-2xl font-bold">{{ stats.videos }}</p>
            </div>
            <VideoIcon class="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 工具栏 -->
    <div class="bg-white rounded-lg border p-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <Select v-model="filterType">
            <SelectTrigger class="w-32">
              <SelectValue placeholder="全部类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="image">图片</SelectItem>
              <SelectItem value="video">视频</SelectItem>
            </SelectContent>
          </Select>

          <div v-if="isSelectionMode" class="flex items-center gap-2">
            <Button variant="outline" size="sm" @click="selectAll">
              {{ selectedItems.size === filteredFavorites.length ? '取消全选' : '全选' }}
            </Button>
            <span class="text-sm text-gray-600">
              已选择 {{ selectedItems.size }} 项
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Button
            v-if="!isSelectionMode"
            variant="outline"
            size="sm"
            @click="isSelectionMode = true"
          >
            批量管理
          </Button>
          <template v-else>
            <Button
              variant="destructive"
              size="sm"
              :disabled="selectedItems.size === 0"
              @click="deleteSelected"
            >
              删除选中
            </Button>
            <Button variant="outline" size="sm" @click="cancelSelection">
              取消
            </Button>
          </template>
        </div>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div v-if="filteredFavorites.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="item in filteredFavorites"
        :key="item.id"
        class="group relative overflow-hidden cursor-pointer transition-all hover:shadow-lg"
        :class="{ 'ring-2 ring-blue-500': selectedItems.has(item.id) }"
        @click="isSelectionMode && toggleSelection(item.id)"
      >
        <CardContent class="p-0">
          <!-- 缩略图 -->
          <div class="relative aspect-video overflow-hidden bg-gray-100">
            <img
              :src="item.thumbnail"
              :alt="item.title"
              class="w-full h-full object-cover transition-transform group-hover:scale-105"
            />

            <!-- 类型标识 -->
            <div class="absolute top-3 left-3">
              <Badge :variant="item.type === 'image' ? 'default' : 'secondary'" class="text-xs">
                {{ item.type === 'image' ? '图片' : '视频' }}
              </Badge>
            </div>

            <!-- 视频时长 -->
            <div v-if="item.type === 'video' && item.duration" class="absolute bottom-3 right-3">
              <Badge variant="outline" class="text-xs bg-black/70 text-white border-0">
                {{ item.duration }}
              </Badge>
            </div>

            <!-- 选择框 -->
            <div
              v-if="isSelectionMode"
              class="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center"
              :class="{ 'bg-blue-500': selectedItems.has(item.id) }"
            >
              <div v-if="selectedItems.has(item.id)" class="w-3 h-3 rounded-full bg-white" />
            </div>

            <!-- 悬浮操作按钮 -->
            <div
              v-if="!isSelectionMode"
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
            >
              <Button
                size="sm"
                variant="secondary"
                class="rounded-full w-10 h-10 p-0"
                @click.stop="downloadItem(item)"
              >
                <Download class="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                class="rounded-full w-10 h-10 p-0"
                @click.stop="confirmDelete(item)"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <!-- 信息区域 -->
          <div class="p-4 space-y-2">
            <h3 class="font-semibold text-sm line-clamp-1">{{ item.title }}</h3>

            <p v-if="item.prompt" class="text-xs text-gray-500 line-clamp-2">
              {{ item.prompt }}
            </p>

            <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-1">
              <Badge
                v-for="tag in item.tags.slice(0, 3)"
                :key="tag"
                variant="outline"
                class="text-xs"
              >
                {{ tag }}
              </Badge>
            </div>

            <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
              <span>收藏于 {{ item.favoritedAt.split(' ')[0] }}</span>
              <Heart class="w-4 h-4 fill-red-500 text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 空状态 -->
    <div v-else class="bg-white rounded-lg border p-12">
      <div class="text-center space-y-4">
        <Heart class="w-16 h-16 text-gray-300 mx-auto" />
        <div>
          <p class="text-gray-600 mb-2">暂无收藏内容</p>
          <p class="text-sm text-gray-500">
            {{ filterType === 'all' ? '开始收藏您喜欢的图片和视频吧' : `暂无收藏的${filterType === 'image' ? '图片' : '视频'}` }}
          </p>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认取消收藏?</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要取消收藏"{{ itemToDelete?.title }}"吗? 此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false">
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            class="bg-red-600 hover:bg-red-700"
            @click="deleteItem"
          >
            确认删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
