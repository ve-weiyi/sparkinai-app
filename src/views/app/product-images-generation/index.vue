<template>
  <div class="flex flex-1 flex-col">
    <div class="relative flex w-full flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <!-- Tabs Header -->
      <div class="w-full px-6 pt-4">
        <Tabs v-model="activeTab" class="w-auto">
          <TabsList class="h-10">
            <TabsTrigger value="image-generator" class="gap-2 px-4">
              <FileImage class="h-4 w-4" />
              图片生成
            </TabsTrigger>
            <TabsTrigger value="image-product-set" class="gap-2 px-4">
              <Package class="h-4 w-4" />
              商品套图
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <!-- Main Content -->
      <div class="flex-1 px-6 py-6 overflow-hidden">
        <Card class="relative w-full h-full overflow-hidden rounded-2xl py-0">
          <div class="flex flex-col lg:flex-row h-full overflow-hidden">
            <!-- Left Panel - Form -->
            <div
              class="flex flex-col flex-shrink-0 bg-card lg:border-r lg:w-[28rem] lg:h-full rounded-tl-2xl lg:rounded-bl-2xl overflow-hidden"
            >
              <div class="flex-1 min-h-0 overflow-y-auto">
                <div class="flex flex-col gap-4 p-6">
                  <!-- Image Upload -->
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm font-medium">
                      <span class="text-foreground">上传图片</span>
                      <span class="text-muted-foreground">{{ uploadedImages.length }}/5</span>
                    </div>

                    <div class="flex flex-wrap items-start gap-3 p-4 rounded-2xl border bg-muted/20">
                      <!-- Uploaded Images Preview -->
                      <div
                        v-for="(image, index) in uploadedImages"
                        :key="index"
                        class="flex flex-col gap-2 flex-shrink-0"
                      >
                        <div class="relative w-25 h-25 rounded-xl overflow-hidden bg-white group">
                          <img
                            :src="image.preview"
                            :alt="image.file.name"
                            class="w-full h-full object-cover"
                          />
                          <!-- Hover Overlay -->
                          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              @click.stop="previewImage(image.preview)"
                              class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                              title="预览"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button
                              @click.stop="openNoteDialog(index)"
                              class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                              title="添加备注"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            </button>
                          </div>
                          <!-- Delete Button -->
                          <button
                            @click="removeImage(index)"
                            class="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-bold z-10"
                          >
                            ×
                          </button>
                          <!-- Index Badge -->
                          <div class="absolute bottom-2 left-2 w-5 h-5 rounded-full bg-white/80 text-foreground flex items-center justify-center text-[10px] font-bold">
                            {{ index + 1 }}
                          </div>
                        </div>
                        <!-- Note Display -->
                        <div
                          v-if="image.note"
                          class="w-25 text-xs text-muted-foreground line-clamp-2 px-1"
                          :title="image.note"
                        >
                          {{ index + 1 }}. {{ image.note }}
                        </div>
                      </div>

                      <!-- Add Button -->
                      <div
                        v-if="uploadedImages.length < 5"
                        @click="triggerFileInput"
                        @dragover.prevent="isDragging = true"
                        @dragleave.prevent="isDragging = false"
                        @drop.prevent="handleDrop"
                        :class="[
                          'w-25 h-25 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition flex-shrink-0',
                          isDragging
                            ? 'border-primary bg-primary/10'
                            : 'border-muted-foreground/40 hover:border-primary/50 hover:bg-muted/60'
                        ]"
                      >
                        <span class="text-3xl text-muted-foreground">+</span>
                        <input
                          ref="fileInputRef"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          multiple
                          class="hidden"
                          @change="handleFileChange"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Target Platform -->
                  <div class="space-y-2">
                    <Label>目标平台</Label>
                    <Select v-model="formData.platform">
                      <SelectTrigger class="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tiktok">TikTok Shop</SelectItem>
                        <SelectItem value="amazon">Amazon</SelectItem>
                        <SelectItem value="shopify">Shopify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Product Features Section - Hidden on mobile -->
                  <div class="hidden lg:block space-y-4">
                    <div class="flex items-center justify-between">
                      <Label class="text-sm font-medium">产品卖点与爆款风格</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="gap-1.5 text-primary hover:text-primary"
                      >
                        <Sparkles class="h-3.5 w-3.5" />
                        一键解析
                      </Button>
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center justify-between">
                        <Label class="text-sm">产品卖点</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          class="gap-1 text-xs text-primary hover:text-primary"
                        >
                          <Sparkles class="h-3 w-3" />
                          AI生成
                        </Button>
                      </div>
                      <Textarea
                        v-model="formData.sellingPoints"
                        class="resize-none rounded-xl text-sm"
                        rows="5"
                        placeholder="产品名：&#10;核心卖点：&#10;适用人群：&#10;期望场景：&#10;尺寸参数："
                      />
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center justify-between">
                        <Label class="text-sm">爆款风格选择</Label>
                      </div>
                      <p class="text-xs text-muted-foreground">
                        AI会基于您选择的目标平台、您的产品卖点为您推荐合适的爆款图片风格
                      </p>
                      <Button variant="outline" size="sm" class="w-full gap-1.5">
                        <Sparkles class="h-3.5 w-3.5" />
                        爆款风格分析
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="flex-shrink-0 border-t bg-card p-4 space-y-3">
                <Button
                  class="w-full"
                  :disabled="uploadedImages.length === 0"
                  @click="handleGenerate"
                >
                  <Sparkles class="mr-2 h-4 w-4" />
                  免费生成预览
                </Button>
                <p class="text-center text-xs text-muted-foreground">
                  {{ uploadedImages.length === 0 ? '请先上传至少一张产品图片' : '点击生成预览' }}
                </p>
              </div>
            </div>

            <!-- Right Panel - Preview -->
            <div
              class="relative flex flex-col flex-1 min-h-0 bg-muted/20 rounded-br-2xl lg:rounded-tr-2xl overflow-hidden"
            >
              <div class="flex-1 overflow-y-auto">
                <div class="flex flex-col h-full p-6">
                  <div class="text-center mb-6">
                    <h1 class="text-2xl font-bold text-foreground mb-2">AI商品套图</h1>
                    <p class="text-sm text-muted-foreground">
                      上传商品图，AI 即刻生成<span class="text-primary font-medium">
                        符合多电商平台规范 </span
                      >的高转化率商品套图
                    </p>
                  </div>

                  <!-- Mobile Layout -->
                  <div class="lg:hidden space-y-4">
                    <!-- Main image on top -->
                    <div class="relative rounded-3xl overflow-hidden bg-white shadow-sm aspect-square">
                      <div class="absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-sm font-bold">
                        01
                      </div>
                      <img
                        alt="AI Product Set Example 1"
                        class="w-full h-full object-cover"
                        :src="examples[0].src"
                      />
                    </div>
                    <!-- Grid items -->
                    <div class="grid grid-cols-2 gap-4">
                      <div
                        v-for="(example, index) in examples.slice(1)"
                        :key="index + 1"
                        class="relative rounded-3xl overflow-hidden bg-white shadow-sm aspect-square"
                      >
                        <div class="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-xs font-bold">
                          {{ String(index + 2).padStart(2, '0') }}
                        </div>
                        <div v-if="example.label" class="absolute bottom-3 left-3 right-3 z-10 text-white text-xs font-medium drop-shadow-lg">
                          {{ example.label }}
                        </div>
                        <img
                          :alt="`AI Product Set Example ${index + 2}`"
                          class="w-full h-full object-cover"
                          :src="example.src"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Desktop Layout -->
                  <div class="hidden lg:grid grid-cols-4 gap-4">
                    <!-- Large main image -->
                    <div class="relative rounded-3xl overflow-hidden bg-white shadow-sm col-span-2 row-span-2 aspect-square">
                      <div class="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-base font-bold">
                        01
                      </div>
                      <img
                        alt="AI Product Set Example 1"
                        class="w-full h-full object-cover"
                        :src="examples[0].src"
                      />
                    </div>
                    <!-- Grid items -->
                    <div
                      v-for="(example, index) in examples.slice(1)"
                      :key="index + 1"
                      class="relative rounded-3xl overflow-hidden bg-white shadow-sm aspect-square"
                    >
                      <div class="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-sm font-bold">
                        {{ String(index + 2).padStart(2, '0') }}
                      </div>
                      <div v-if="example.label" class="absolute bottom-3 left-3 right-3 z-10 text-white text-sm font-medium drop-shadow-lg">
                        {{ example.label }}
                      </div>
                      <img
                        :alt="`AI Product Set Example ${index + 2}`"
                        class="w-full h-full object-cover"
                        :src="example.src"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Note Dialog -->
    <div
      v-if="editingImageIndex !== null"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="cancelNote"
    >
      <div
        class="bg-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4">添加图片备注</h3>
        <Textarea
          v-model="editingNote"
          class="resize-none rounded-xl text-sm mb-4"
          rows="4"
          placeholder="请输入图片备注信息..."
          autofocus
        />
        <div class="flex gap-3 justify-end">
          <Button variant="outline" @click="cancelNote">取消</Button>
          <Button @click="saveNote">保存</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FileImage, Package, Sparkles, CloudUpload } from 'lucide-vue-next'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface UploadedImage {
  file: File
  preview: string
  note?: string
}

const activeTab = ref('image-product-set')
const uploadedImages = ref<UploadedImage[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const editingImageIndex = ref<number | null>(null)
const editingNote = ref('')

const formData = ref({
  platform: 'tiktok',
  market: 'us',
  language: 'en',
  sellingPoints: '',
})

const examples = [
  {
    label: '白底主图',
    src: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=800&fit=crop',
  },
  {
    label: '温馨猫窝特写',
    src: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&h=600&fit=crop',
  },
  {
    label: '标注图',
    src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
  },
  {
    label: '家居美学展示图',
    src: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=600&fit=crop',
  },
  {
    label: '多猫派对场景图',
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop',
  },
  {
    label: '多猫派对场景图',
    src: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&h=600&fit=crop',
  },
  {
    label: '耐磨抓柱细节图',
    src: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=600&fit=crop',
  },
  {
    label: '场景代入图',
    src: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop',
  },
  {
    label: '场景代入图',
    src: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=600&h=600&fit=crop',
  },
]

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const validateFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    alert('请上传 JPG、JPEG、PNG 或 WEBP 格式的图片')
    return false
  }

  if (file.size > maxSize) {
    alert(`文件 ${file.name} 超过 10MB，请选择较小的文件`)
    return false
  }

  return true
}

const addFiles = (files: FileList | File[]) => {
  const fileArray = Array.from(files)
  const remainingSlots = 5 - uploadedImages.value.length

  if (fileArray.length > remainingSlots) {
    alert(`最多只能上传 5 张图片，当前还可上传 ${remainingSlots} 张`)
    return
  }

  fileArray.forEach((file) => {
    if (validateFile(file) && uploadedImages.value.length < 5) {
      const preview = URL.createObjectURL(file)
      uploadedImages.value.push({ file, preview })
    }
  })
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    addFiles(target.files)
    target.value = ''
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    addFiles(event.dataTransfer.files)
  }
}

const removeImage = (index: number) => {
  URL.revokeObjectURL(uploadedImages.value[index].preview)
  uploadedImages.value.splice(index, 1)
}

const previewImage = (url: string) => {
  window.open(url, '_blank')
}

const openNoteDialog = (index: number) => {
  editingImageIndex.value = index
  editingNote.value = uploadedImages.value[index].note || ''
}

const saveNote = () => {
  if (editingImageIndex.value !== null) {
    uploadedImages.value[editingImageIndex.value].note = editingNote.value
    editingImageIndex.value = null
    editingNote.value = ''
  }
}

const cancelNote = () => {
  editingImageIndex.value = null
  editingNote.value = ''
}

const handleGenerate = () => {
  console.log('Generating preview...', {
    images: uploadedImages.value.map(img => img.file.name),
    formData: formData.value
  })
}
</script>
