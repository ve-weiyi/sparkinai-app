<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Sparkles, Wand2, Download, X, Loader2, Image as ImageIcon } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { generateImages, analyzeProduct } from '@/services/imageGeneration'

const platform = ref('TikTok Shop')
const market = ref('US (美国)')
const language = ref('English')
const productName = ref('')
const coreFeatures = ref('')
const targetAudience = ref('')
const expectedScenario = ref('')
const sizeQuantity = ref('')

const uploadedImages = ref<File[]>([])
const uploadedImagePreviews = ref<string[]>([])
const generatedImages = ref<string[]>([])
const isGenerating = ref(false)
const isAnalyzing = ref(false)

const canGenerate = computed(() => {
  return uploadedImages.value.length > 0 && !isGenerating.value
})

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const files = Array.from(target.files).slice(0, 5 - uploadedImages.value.length)
    uploadedImages.value.push(...files)

    // 生成预览
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          uploadedImagePreviews.value.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    })
  }
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
  uploadedImagePreviews.value.splice(index, 1)
}

const generateProductPoints = async () => {
  if (uploadedImages.value.length === 0) {
    alert('请先上传商品图片')
    return
  }

  isAnalyzing.value = true
  try {
    const result = await analyzeProduct(uploadedImages.value[0])
    productName.value = result.productName || ''
    coreFeatures.value = result.coreFeatures || ''
    targetAudience.value = result.targetAudience || ''
    expectedScenario.value = result.expectedScenario || ''
    sizeQuantity.value = result.sizeQuantity || ''
  } catch (error) {
    console.error('产品分析失败:', error)
  } finally {
    isAnalyzing.value = false
  }
}

const generatePreview = async () => {
  if (!canGenerate.value) {
    alert('请先上传至少一张商品图片')
    return
  }

  isGenerating.value = true
  generatedImages.value = []

  try {
    const result = await generateImages({
      images: uploadedImages.value,
      platform: platform.value,
      market: market.value,
      language: language.value,
      productName: productName.value,
      coreFeatures: coreFeatures.value,
      targetAudience: targetAudience.value,
      expectedScenario: expectedScenario.value,
      sizeQuantity: sizeQuantity.value
    })

    generatedImages.value = result.images
  } catch (error) {
    console.error('图片生成失败:', error)
    alert('图片生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

const downloadImage = (imageUrl: string, index: number) => {
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = `generated-image-${index + 1}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadAllImages = () => {
  generatedImages.value.forEach((image, index) => {
    setTimeout(() => {
      downloadImage(image, index)
    }, index * 200)
  })
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold mb-2">AI商品套图</h1>
      <p class="text-sm text-muted-foreground">
        上传商品图，AI 即刻生成 符合多电商平台规范 的高质化商品套图
      </p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Left Panel - Upload and Settings -->
      <div class="space-y-6">
        <!-- Tabs -->
        <div class="flex gap-2 border-b">
          <Button variant="ghost" class="border-b-2 border-primary rounded-none"> 图片生成 </Button>
          <Button variant="ghost" class="rounded-none"> 商品套图 </Button>
        </div>

        <!-- Upload Section -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold">上传图片</h3>
            <span class="text-sm text-muted-foreground">{{ uploadedImages.length }}/5</span>
          </div>

          <!-- 已上传图片预览 -->
          <div v-if="uploadedImages.length > 0" class="grid grid-cols-3 gap-2 mb-3">
            <div
              v-for="(preview, index) in uploadedImagePreviews"
              :key="index"
              class="relative aspect-square rounded-lg overflow-hidden border group"
            >
              <img :src="preview" alt="上传的图片" class="w-full h-full object-cover" />
              <button
                @click="removeImage(index)"
                class="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X class="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div
            v-if="uploadedImages.length < 5"
            class="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              id="image-upload"
              @change="handleFileUpload"
            />
            <label for="image-upload" class="cursor-pointer">
              <div
                class="w-16 h-16 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center"
              >
                <Upload class="w-8 h-8 text-muted-foreground" />
              </div>
              <p class="font-medium mb-1">点击或拖拽上传图片</p>
              <p class="text-xs text-muted-foreground">
                支持 JPG、JPEG、PNG、WEBP，单张不超过 10MB
              </p>
            </label>
          </div>
        </div>

        <!-- Platform Settings -->
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">目标平台</label>
            <select v-model="platform" class="w-full border rounded-md px-3 py-2">
              <option>TikTok Shop</option>
              <option>Amazon</option>
              <option>Shopify</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium mb-2 block">目标市场</label>
              <select v-model="market" class="w-full border rounded-md px-3 py-2">
                <option>🇺🇸 US (美国)</option>
                <option>🇬🇧 UK (英国)</option>
                <option>🇯🇵 JP (日本)</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">文案语言</label>
              <select v-model="language" class="w-full border rounded-md px-3 py-2">
                <option>🇺🇸 English</option>
                <option>🇯🇵 日本语</option>
                <option>🇨🇳 中文</option>
              </select>
            </div>
          </div>

          <!-- Product Details -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium">产品卖点与爆款风格</label>
              <Button
                variant="ghost"
                size="sm"
                @click="generateProductPoints"
                :disabled="isAnalyzing || uploadedImages.length === 0"
              >
                <Loader2 v-if="isAnalyzing" class="w-4 h-4 mr-1 animate-spin" />
                <Wand2 v-else class="w-4 h-4 mr-1" />
                {{ isAnalyzing ? '分析中...' : 'AI生成' }}
              </Button>
            </div>
            <div class="space-y-2">
              <Input v-model="productName" placeholder="产品名：" class="text-sm" />
              <Input v-model="coreFeatures" placeholder="核心卖点：" class="text-sm" />
              <Input v-model="targetAudience" placeholder="适用人群：" class="text-sm" />
              <Input v-model="expectedScenario" placeholder="期望场景：" class="text-sm" />
              <Input v-model="sizeQuantity" placeholder="尺寸数量：" class="text-sm" />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium mb-2 block">爆款风格选择</label>
            <p class="text-xs text-muted-foreground mb-2">
              AI会基于您选择的目标平台、您的商品内容为您推荐合适的爆款风格
            </p>
            <Button variant="outline" size="sm" class="w-full">
              <Sparkles class="w-4 h-4 mr-2" />
              爆款风格分析
            </Button>
          </div>

          <Button
            class="w-full"
            size="lg"
            @click="generatePreview"
            :disabled="!canGenerate"
          >
            <Loader2 v-if="isGenerating" class="w-4 h-4 mr-2 animate-spin" />
            <Sparkles v-else class="w-4 h-4 mr-2" />
            {{ isGenerating ? '生成中...' : '免费生成预览' }}
          </Button>

          <p class="text-xs text-muted-foreground text-center">
            {{ uploadedImages.length === 0 ? '请先上传至少一张商品图片' : '点击按钮开始生成图片' }}
          </p>
        </div>
      </div>

      <!-- Right Panel - Preview -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">AI商品套图</h3>
          <Button
            v-if="generatedImages.length > 0"
            variant="outline"
            size="sm"
            @click="downloadAllImages"
          >
            <Download class="w-4 h-4 mr-2" />
            下载全部
          </Button>
        </div>

        <!-- 生成中状态 -->
        <div v-if="isGenerating" class="flex flex-col items-center justify-center py-20">
          <Loader2 class="w-12 h-12 animate-spin text-primary mb-4" />
          <p class="text-sm text-gray-600">AI正在生成图片，请稍候...</p>
          <p class="text-xs text-gray-500 mt-2">这可能需要几秒钟</p>
        </div>

        <!-- 生成结果 -->
        <div v-else-if="generatedImages.length > 0" class="space-y-4">
          <p class="text-sm text-muted-foreground">
            已生成 {{ generatedImages.length }} 张图片
          </p>
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="(image, index) in generatedImages"
              :key="index"
              class="relative aspect-square rounded-lg overflow-hidden border group cursor-pointer"
            >
              <img :src="image" :alt="`生成的图片 ${index + 1}`" class="w-full h-full object-cover" />
              <div
                class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Button
                  size="sm"
                  variant="secondary"
                  @click="downloadImage(image, index)"
                >
                  <Download class="w-4 h-4 mr-1" />
                  下载
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
          <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ImageIcon class="w-10 h-10 text-gray-400" />
          </div>
          <p class="text-sm text-gray-600 mb-2">暂无生成结果</p>
          <p class="text-xs text-gray-500">上传图片并点击生成按钮开始创作</p>
        </div>
      </div>
    </div>
  </div>
</template>
