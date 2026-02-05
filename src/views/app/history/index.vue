<template>
  <div class="flex flex-1 flex-col p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold">生成记录</h1>
          <p class="text-sm text-muted-foreground mt-1">
            查看您的所有内容生成历史记录
          </p>
        </div>
        <div class="flex items-center gap-3">
          <Select v-model="filterStatus">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="1">成功</SelectItem>
              <SelectItem value="0">进行中</SelectItem>
              <SelectItem value="2">失败</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <Loader2 class="animate-spin h-8 w-8 text-primary" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!generations || generations.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="text-center space-y-3">
          <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <FileText class="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 class="text-lg font-medium">暂无生成记录</h3>
          <p class="text-sm text-muted-foreground">
            开始创建您的第一个内容生成任务吧
          </p>
          <Button @click="$router.push('/app/product-images-generation')">
            <Sparkles class="mr-2 h-4 w-4" />
            开始生成
          </Button>
        </div>
      </div>

      <!-- Generations List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="item in generations"
          :key="item.id"
          class="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          @click="viewDetail(item)"
        >
          <CardContent class="p-0">
            <!-- Image Preview -->
            <div class="relative aspect-square bg-muted">
              <img
                v-if="item.image_url"
                :src="item.image_url"
                :alt="item.product_name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <ImageIcon class="h-12 w-12 text-muted-foreground" />
              </div>

              <!-- Status Badge -->
              <div class="absolute top-3 right-3">
                <Badge
                  :variant="getStatusVariant(item.status)"
                  class="shadow-sm"
                >
                  {{ getStatusText(item.status) }}
                </Badge>
              </div>

              <!-- Generation Type Badge -->
              <div class="absolute top-3 left-3">
                <Badge variant="secondary" class="shadow-sm">
                  {{ getTypeText(item.generation_type) }}
                </Badge>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4 space-y-3">
              <div>
                <h3 class="font-medium line-clamp-1">{{ item.product_name }}</h3>
                <p class="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {{ item.description }}
                </p>
              </div>

              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <span>{{ formatDate(item.created_at) }}</span>
                <div class="flex items-center gap-3">
                  <span v-if="item.cost_tokens > 0">{{ item.cost_tokens }} tokens</span>
                  <span v-if="item.generation_time > 0">{{ item.generation_time }}s</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  class="flex-1"
                  @click.stop="viewDetail(item)"
                >
                  查看详情
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  @click.stop="deleteGeneration(item.id)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Pagination -->
      <div v-if="total > pageSize" class="flex items-center justify-center gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          :disabled="page === 1"
          @click="page--"
        >
          上一页
        </Button>
        <span class="text-sm text-muted-foreground">
          第 {{ page }} 页，共 {{ Math.ceil(total / pageSize) }} 页
        </span>
        <Button
          variant="outline"
          size="sm"
          :disabled="page >= Math.ceil(total / pageSize)"
          @click="page++"
        >
          下一页
        </Button>
      </div>
    </div>

    <!-- Detail Dialog -->
    <Dialog :open="showDetailDialog" @update:open="showDetailDialog = $event">
      <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ selectedItem?.product_name }}</DialogTitle>
          <DialogDescription>
            生成时间: {{ selectedItem ? formatDate(selectedItem.created_at) : '' }}
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedItem" class="space-y-4">
          <!-- Product Image -->
          <div v-if="selectedItem.image_url" class="rounded-lg overflow-hidden border">
            <img
              :src="selectedItem.image_url"
              :alt="selectedItem.product_name"
              class="w-full h-auto"
            />
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <h4 class="font-medium">产品描述</h4>
            <p class="text-sm text-muted-foreground whitespace-pre-wrap">
              {{ selectedItem.description }}
            </p>
          </div>

          <!-- Copy Result -->
          <div v-if="selectedItem.copy_result" class="space-y-2">
            <h4 class="font-medium">生成文案</h4>
            <div class="bg-muted rounded-lg p-4">
              <pre class="text-sm whitespace-pre-wrap">{{ formatCopyResult(selectedItem.copy_result) }}</pre>
            </div>
          </div>

          <!-- Generated Images -->
          <div v-if="selectedItem.image_urls && selectedItem.image_urls.length > 0" class="space-y-2">
            <h4 class="font-medium">生成图片 ({{ selectedItem.image_urls.length }})</h4>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="(url, idx) in selectedItem.image_urls"
                :key="idx"
                class="aspect-square rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition"
                @click="previewImage(url)"
              >
                <img :src="url" :alt="`生成图片 ${idx + 1}`" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 pt-4 border-t">
            <div class="text-center">
              <div class="text-2xl font-bold">{{ selectedItem.cost_tokens }}</div>
              <div class="text-xs text-muted-foreground">消耗 Tokens</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">{{ selectedItem.generation_time }}s</div>
              <div class="text-xs text-muted-foreground">生成耗时</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">
                <Badge :variant="getStatusVariant(selectedItem.status)">
                  {{ getStatusText(selectedItem.status) }}
                </Badge>
              </div>
              <div class="text-xs text-muted-foreground">状态</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Image Preview Dialog -->
    <div
      v-if="previewImageUrl"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      @click="closePreview"
    >
      <div class="relative max-w-[90vw] max-h-[90vh]" @click.stop>
        <img :src="previewImageUrl" class="max-w-full max-h-[90vh] object-contain rounded-lg" />
        <button
          @click="closePreview"
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-foreground flex items-center justify-center text-xl font-bold transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import {
  Loader2,
  FileText,
  Sparkles,
  Trash2,
  Image as ImageIcon,
} from 'lucide-vue-next'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GenerateAPI } from '@/api/generate'
import type { GenerationItem } from '@/api/types'

const router = useRouter()

const loading = ref(false)
const generations = ref<GenerationItem[]>([])
const page = ref(1)
const pageSize = ref(12)
const total = ref(0)
const filterStatus = ref('all')
const showDetailDialog = ref(false)
const selectedItem = ref<GenerationItem | null>(null)
const previewImageUrl = ref('')

// Fetch generations
const fetchGenerations = async () => {
  loading.value = true
  try {
    const params: any = {
      page: page.value,
      page_size: pageSize.value,
    }

    if (filterStatus.value !== 'all') {
      params.status = parseInt(filterStatus.value)
    }

    const response = await GenerateAPI.getGenerations(params)
    generations.value = response.data.list || []
    total.value = response.data.total || 0
  } catch (error: any) {
    console.error('获取生成记录失败:', error)
    toast.error('获取生成记录失败: ' + (error.message || '请稍后重试'))
  } finally {
    loading.value = false
  }
}

// View detail
const viewDetail = (item: GenerationItem) => {
  selectedItem.value = item
  showDetailDialog.value = true
}

// Delete generation
const deleteGeneration = async (id: string) => {
  if (!confirm('确定要删除这条记录吗？')) return

  try {
    await GenerateAPI.deleteGeneration({ id })
    toast.success('删除成功')
    fetchGenerations()
  } catch (error: any) {
    console.error('删除失败:', error)
    toast.error('删除失败: ' + (error.message || '请稍后重试'))
  }
}

// Preview image
const previewImage = (url: string) => {
  previewImageUrl.value = url
}

const closePreview = () => {
  previewImageUrl.value = ''
}

// Format date
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

// Format copy result
const formatCopyResult = (copyResult: string) => {
  try {
    const parsed = JSON.parse(copyResult)
    if (typeof parsed === 'object') {
      return JSON.stringify(parsed, null, 2)
    }
    return copyResult
  } catch {
    return copyResult
  }
}

// Get status text
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '进行中',
    1: '成功',
    2: '失败',
  }
  return statusMap[status] || '未知'
}

// Get status variant
const getStatusVariant = (status: number): 'default' | 'secondary' | 'destructive' => {
  const variantMap: Record<number, 'default' | 'secondary' | 'destructive'> = {
    0: 'secondary',
    1: 'default',
    2: 'destructive',
  }
  return variantMap[status] || 'default'
}

// Get type text
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    copy: '文案',
    image: '图片',
    full: '完整',
  }
  return typeMap[type] || type
}

// Watch filters
watch([page, filterStatus], () => {
  fetchGenerations()
})

// Initial fetch
onMounted(() => {
  fetchGenerations()
})
</script>
