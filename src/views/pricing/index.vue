<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Check, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()

const currency = ref<'CNY' | 'USD'>('CNY')
const selectedPlan = ref<string | null>(null)

const handlePurchase = (plan: any) => {
  if (plan.priceCNY === 0) {
    router.push('/app/dashboard')
  } else {
    router.push({
      path: '/payment/checkout',
      query: {
        plan: plan.name,
        price: currency.value === 'CNY' ? plan.priceCNY : plan.priceUSD
      }
    })
  }
}

const basePlans = [
  {
    name: '免费版',
    priceCNY: 0,
    priceUSD: 0,
    description: '适合试用 CreatOK',
    features: [
      '6 个积分',
      '最多生成/复刻 3 个视频',
      '标准质量渲染',
      '无法创建角色',
      '免费试用视频分析 3 次/天',
      '视频公开可见',
      '视频可在几天内查看和下载',
      '邮件客服支持'
    ],
    buttonText: '免费开始',
    buttonVariant: 'outline' as const
  },
  {
    name: '专业版',
    priceCNY: 249,
    priceUSD: 35,
    originalPriceCNY: 599,
    originalPriceUSD: 85,
    badge: '最受欢迎',
    highlight: true,
    description: '适合专业团队和工作室',
    features: [
      '每月 1000 个积分',
      '最多生成/复刻 500 个视频',
      '25 秒/高质量渲染',
      '不限制创建角色，锁定人物一致性',
      '生成无水印视频',
      '无限量分析视频，限时免费',
      '视频仅自己可见',
      '视频可在三个月内查看和下载',
      '优先混染队列',
      '优先客服支持'
    ],
    buttonText: '立即开始',
    buttonVariant: 'default' as const
  },
  {
    name: '基础版',
    priceCNY: 49,
    priceUSD: 7,
    originalPriceCNY: 99,
    originalPriceUSD: 14,
    badge: '早鸟优惠',
    description: '适合个人创作者',
    features: [
      '每月 110 个积分',
      '最多生成/复刻 55 个视频',
      '25 秒/高质量渲染',
      '最多创建 3 个角色，锁定人物一致性',
      '生成无水印视频',
      '无限量分析视频，限时免费',
      '视频仅自己可见',
      '视频可在一个月内查看和下载',
      '优先混染队列',
      '社群客服支持'
    ],
    buttonText: '立即开始',
    buttonVariant: 'default' as const
  }
]

const plans = computed(() => {
  return basePlans.map(plan => {
    const price = currency.value === 'CNY' ? plan.priceCNY : plan.priceUSD
    const originalPrice = currency.value === 'CNY' ? plan.originalPriceCNY : plan.originalPriceUSD
    const symbol = currency.value === 'CNY' ? '¥' : '$'
    const discount = originalPrice ? `立省 ${symbol}${originalPrice - price}` : undefined
    
    return {
      ...plan,
      price,
      originalPrice,
      symbol,
      discount
    }
  })
})
</script>

<template>
  <div class="flex-1 overflow-auto">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="flex justify-end mb-4">
        <Button variant="ghost" size="sm" @click="router.back()">
          <ArrowLeft class="w-4 h-4 mr-2" />
          返回
        </Button>
      </div>
      
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">简单透明的定价</h1>
        <p class="text-lg text-muted-foreground mb-6">选择适合你创作工作流的计划，随时升级或降级。</p>
        <select v-model="currency" class="border rounded-md px-4 py-2 text-sm">
          <option value="CNY">人民币 (CNY)</option>
          <option value="USD">美元 (USD)</option>
        </select>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="plan in plans"
          :key="plan.name"
          :class="[
            'rounded-lg border p-8 relative cursor-pointer transition-all',
            selectedPlan === plan.name ? 'ring-2 ring-primary border-primary' : ''
          ]"
          @click="selectedPlan = plan.name"
        >
          <div v-if="plan.badge" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
            {{ plan.badge }}
          </div>

          <div class="mb-6">
            <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
            <p class="text-sm text-muted-foreground mb-4">{{ plan.description }}</p>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-bold">{{ plan.symbol }}{{ plan.price }}</span>
              <span v-if="plan.originalPrice" class="text-lg text-muted-foreground line-through">{{ plan.symbol }}{{ plan.originalPrice }}</span>
            </div>
            <div v-if="plan.discount" class="inline-block mt-2 bg-green-50 text-green-600 px-2 py-1 rounded text-sm font-medium">
              {{ plan.discount }}
            </div>
            <div v-if="plan.price > 0" class="text-sm text-muted-foreground mt-1">{{ plan.symbol }}{{ plan.originalPrice || plan.price }}/月</div>
          </div>

          <Button
            :variant="plan.buttonVariant"
            class="w-full mb-6"
            @click="handlePurchase(plan)"
          >
            {{ plan.buttonText }}
          </Button>

          <div class="space-y-3">
            <div v-for="feature in plan.features" :key="feature" class="flex gap-3">
              <Check class="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span class="text-sm">{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
