<template>
  <div class="flex flex-1 flex-col">
    <div class="relative flex w-full flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <!-- Tabs Header -->
      <div class="w-full px-6 pt-4">
        <div class="space-y-2">
          <h1 class="text-2xl font-semibold">AI商品套图</h1>
          <p class="text-sm text-muted-foreground">
            上传商品图，AI 即刻生成 符合多电商平台规范 的高质化商品套图
          </p>
        </div>

        <Tabs v-model="activeTab" class="w-auto mt-5">
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
                        <div class="relative w-30 h-30 rounded-xl overflow-hidden bg-white group">
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
                          class="w-30 text-xs text-muted-foreground line-clamp-2 px-1"
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
                          'w-30 h-30 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition flex-shrink-0',
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

                    <p class="text-xs text-muted-foreground">
                      请选择主参考图，并可为每张图添加备注（如：包装/拆封/细节）
                    </p>
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

                  <!-- Product Name -->
                  <div class="space-y-2">
                    <Label>产品名称</Label>
                    <Input v-model="formData.productName" placeholder="请输入产品名称" />
                  </div>

                  <!-- Product Features Section - Hidden on mobile -->
                  <div class="hidden lg:block space-y-4">
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
                      <Label class="text-sm">生成内容数量</Label>
                      <Select v-model="formData.quantity">
                        <SelectTrigger class="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="option in quantityOptions" :key="option.value" :value="option.value">{{ option.label }}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="flex-shrink-0 border-t bg-card p-4 space-y-3">
                <Button
                  class="w-full"
                  :disabled="uploadedImages.length === 0 || !formData.productName || !formData.sellingPoints"
                  @click="handleGenerate"
                >
                  <Sparkles class="mr-2 h-4 w-4" />
                  免费生成预览
                </Button>
                <p class="text-center text-xs text-muted-foreground">
                  {{ uploadedImages.length === 0 ? '请先上传至少一张产品图片' : !formData.productName ? '请填写产品名称' : !formData.sellingPoints ? '请填写产品卖点' : '点击生成预览' }}
                </p>
              </div>
            </div>

            <!-- Right Panel - Preview -->
            <div
              class="relative flex flex-col flex-1 min-h-0 bg-muted/20 rounded-br-2xl lg:rounded-tr-2xl overflow-hidden"
            >
              <div class="flex-1 overflow-y-auto">
                <div class="flex flex-col h-full p-6">
                  <!-- Generated Tasks -->
                  <div v-if="generatedTask" class="space-y-4">
                    <div class="bg-card rounded-2xl border p-6 space-y-4">
                      <!-- Header -->
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <span class="text-2xl font-bold">{{ truncateProductName(generatedTask.productName || '产品名称') }}</span>
                          <span class="text-sm text-muted-foreground">{{ generatedTask.timestamp }}</span>
                        </div>
                        <Button variant="outline" size="icon" class="rounded-lg" @click="generatedTask = null">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </Button>
                      </div>

                      <!-- Tags -->
                      <div class="flex flex-wrap gap-2">
                        <span v-for="(tag, idx) in taskTags" :key="idx" class="px-3 py-1 rounded-full bg-muted text-sm">{{ tag }}</span>
                      </div>

                      <!-- Uploaded Images -->
                      <div class="flex gap-2">
                        <div
                          v-for="(img, idx) in generatedTask.images"
                          :key="idx"
                          class="w-16 h-16 rounded-lg overflow-hidden bg-muted"
                        >
                          <img :src="img.preview" class="w-full h-full object-cover" />
                        </div>
                      </div>

                      <!-- Settings -->
                      <div class="flex items-end gap-3">
                        <div class="space-y-1">
                          <div class="text-xs text-muted-foreground">风格选择</div>
                          <Select v-model="generatedTask.style">
                            <SelectTrigger class="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem v-for="option in styleOptions" :key="option.value" :value="option.value">{{ option.label }}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div class="space-y-1">
                          <div class="text-xs text-muted-foreground">分辨率选择</div>
                          <Select v-model="generatedTask.resolution">
                            <SelectTrigger class="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem v-for="option in resolutionOptions" :key="option.value" :value="option.value">{{ option.label }}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div class="space-y-1">
                          <div class="text-xs text-muted-foreground">图片比例</div>
                          <Select v-model="generatedTask.ratio">
                            <SelectTrigger class="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem v-for="option in ratioOptions" :key="option.value" :value="option.value">{{ option.label }}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <!-- Generate Button -->
                        <Button size="lg" @click="handleGenerateImages(generatedTask)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="21 12 16.5 14.6 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                          一键生成图片
                          <span class="ml-2">✨ 14</span>
                        </Button>
                      </div>

                      <!-- Image Types or Generated Images -->
                      <div v-if="generatedTask.isGenerating" class="flex flex-col items-center justify-center py-20">
                        <svg class="animate-spin h-12 w-12 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p class="text-sm text-muted-foreground">AI正在生成图片，请稍候...</p>
                      </div>
                      <div v-else-if="generatedTask.generatedImages" class="grid grid-cols-3 gap-4">
                        <div
                          v-for="(img, idx) in generatedTask.generatedImages"
                          :key="idx"
                          class="relative aspect-square rounded-lg overflow-hidden border group cursor-pointer bg-white"
                        >
                          <div class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium z-10">
                            {{ String(idx + 1).padStart(2, '0') }} {{ img.name }}
                          </div>
                          <img :src="img.url" :alt="img.name" class="w-full h-full object-cover" />
                          <div v-if="img.isRegenerating" class="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                          <div v-else class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                            <Button size="sm" variant="secondary" class="w-full" @click="downloadImage(img.url, img.name)">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                              下载
                            </Button>
                            <Button size="sm" variant="secondary" class="w-full" @click="regenerateImage(generatedTask, idx)">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                              重新生成
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div v-else class="grid grid-cols-3 gap-3">
                        <div
                          v-for="(type, idx) in generatedTask.imageTypes"
                          :key="idx"
                          @click="type.selected = !type.selected"
                          class="relative border-2 rounded-xl p-3 space-y-2 cursor-pointer transition-colors"
                          :class="type.selected ? 'border-foreground' : 'border-muted hover:border-muted-foreground'"
                        >
                          <div class="flex items-center justify-between">
                            <span class="px-2 py-0.5 rounded-full border text-xs font-medium">{{ type.name }}</span>
                            <div v-if="type.selected" class="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          </div>
                          <p class="text-xs text-muted-foreground line-clamp-2">{{ type.desc }}</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <!-- Empty State -->
                  <div v-else class="flex flex-col h-full">
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
import { ref, computed } from 'vue'
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
import { Input } from '@/components/ui/input'

interface UploadedImage {
  file: File
  preview: string
  note?: string
}

const platformLabels: Record<string, string> = {
  tiktok: 'TikTok Shop',
  amazon: 'Amazon',
  shopify: 'Shopify'
}

const taskTags = computed(() => {
  if (!generatedTask.value) return []
  return [
    platformLabels[generatedTask.value.platform] || generatedTask.value.platform,
    generatedTask.value.style,
    generatedTask.value.resolution,
    generatedTask.value.ratio
  ]
})

const activeTab = ref('image-product-set')
const uploadedImages = ref<UploadedImage[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const editingImageIndex = ref<number | null>(null)
const editingNote = ref('')
const generatedTask = ref<any>(null)

const styleOptions = [
  { value: '极简留白', label: '极简留白' },
  { value: '真实评测', label: '真实评测' },
  { value: '美式波普', label: '美式波普' },
  { value: '沉浸体验', label: '沉浸体验' }
]

const resolutionOptions = [
  { value: '2K ✨ 2', label: '2K ✨ 2' },
  { value: '4K', label: '4K' },
  { value: 'HD', label: 'HD' }
]

const ratioOptions = [
  { value: '1:1', label: '1:1' },
  { value: '16:9', label: '16:9' },
  { value: '4:3', label: '4:3' }
]

const quantityOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' }
]

const formData = ref({
  platform: 'tiktok',
  productName: '',
  market: 'us',
  language: 'en',
  sellingPoints: '',
  quantity: '1',
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
  const task = {
    id: Date.now(),
    timestamp: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    platform: formData.value.platform,
    productName: formData.value.productName,
    images: uploadedImages.value.map(img => ({ preview: img.preview, note: img.note })),
    style: '极简留白',
    resolution: '2K ✨ 2',
    ratio: '1:1',
    isGenerating: false,
    generatedImages: null,
    imageTypes: [
      { name: '主图', selected: true, desc: '纯白背景产品主图，展现...' },
      { name: '细节特写图', selected: true, desc: '微距镜头展示产品材质与...' },
      { name: '场景展示图', selected: true, desc: '美式现代家居场景，体现...' },
      { name: '功能解析图', selected: true, desc: '通过留白构图标注核心功...' },
      { name: '尺寸对比图', selected: true, desc: '直观展示产品尺寸参数与...' },
      { name: '人群适用图', selected: true, desc: '目标用户群体使用场景，...' },
      { name: '品牌背书图', selected: true, desc: '极简构图展示品牌Logo与...' }
    ]
  }
  generatedTask.value = task
}

const truncateProductName = (name: string) => {
  return name.length > 20 ? name.substring(0, 20) + '...' : name
}

const downloadImage = (url: string, name: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = `${name}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const regenerateImage = async (task: any, index: number) => {
  const mockImageUrls = [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=600&fit=crop'
  ]
  
  task.generatedImages[index].isRegenerating = true
  
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * mockImageUrls.length)
    task.generatedImages[index].url = mockImageUrls[randomIndex]
    task.generatedImages[index].isRegenerating = false
  }, 1500)
}

const handleGenerateImages = async (task: any) => {
  const selectedTypes = task.imageTypes.filter((type: any) => type.selected)
  if (selectedTypes.length === 0) {
    alert('请至少选择一个图片类型')
    return
  }
  
  task.isGenerating = true
  
  const mockImageUrls = [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=600&fit=crop'
  ]
  
  // 模拟生成图片
  setTimeout(() => {
    task.generatedImages = selectedTypes.map((type: any, index: number) => ({
      name: type.name,
      url: mockImageUrls[index % mockImageUrls.length],
      isRegenerating: false
    }))
    task.isGenerating = false
  }, 2000)
}
</script>
