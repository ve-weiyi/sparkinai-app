<script setup lang="ts">
import { useImages } from '@/composables/useImages.ts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Sparkles, Wand2 } from 'lucide-vue-next'
import { ref } from 'vue'

const platform = ref('TikTok Shop')
const market = ref('US (美国)')
const language = ref('English')
const productName = ref('')
const coreFeatures = ref('')
const targetAudience = ref('')
const expectedScenario = ref('')
const sizeQuantity = ref('')

const uploadedImages = ref<File[]>([])

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    uploadedImages.value = Array.from(target.files)
  }
}

const generateProductPoints = () => {
  // AI generate product points logic
  productName.value = '产品名：'
  coreFeatures.value = '核心卖点：'
  targetAudience.value = '适用人群：'
  expectedScenario.value = '期望场景：'
  sizeQuantity.value = '尺寸数量：'
}

const generatePreview = () => {
  // Generate preview logic
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

          <div
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

          <Button variant="outline" size="sm" class="w-full mt-2"> 选择文件 </Button>
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
              <Button variant="ghost" size="sm" @click="generateProductPoints">
                <Wand2 class="w-4 h-4 mr-1" />
                AI生成
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

          <Button class="w-full" size="lg" @click="generatePreview">
            <Sparkles class="w-4 h-4 mr-2" />
            免费生成预览
          </Button>

          <p class="text-xs text-muted-foreground text-center">请先上传至少一张商品图片</p>
        </div>
      </div>

      <!-- Right Panel - Preview -->
      <div>
        <h3 class="font-semibold mb-4">AI商品套图</h3>
        <p class="text-sm text-muted-foreground mb-4">
          上传商品图，AI 即刻生成 符合多电商平台规范 的高质化商品套图
        </p>

        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="i in 9"
            :key="i"
            class="aspect-square rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground border"
          >
            0{{ i }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
