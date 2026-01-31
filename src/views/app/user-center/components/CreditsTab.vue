<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUserStore } from '@/store/modules/user'
import type { CreditRecord } from '@/types'

const router = useRouter()
const store = useUserStore()
const { currentUser } = storeToRefs(store)

// 筛选类型
const filterType = ref<string>('all')

// 模拟积分记录数据
const creditRecords = ref<CreditRecord[]>([
  {
    id: '1',
    type: 'earn',
    amount: 100,
    balance: 106,
    description: '购买专业版套餐',
    createdAt: '2026-01-26 14:30:00',
    relatedOrder: 'ORD20260126001'
  },
  {
    id: '2',
    type: 'earn',
    amount: 10,
    balance: 16,
    description: '邀请好友注册',
    createdAt: '2026-01-25 10:15:00'
  },
  {
    id: '3',
    type: 'spend',
    amount: -5,
    balance: 6,
    description: '生成产品图片',
    createdAt: '2026-01-24 16:45:00'
  },
  {
    id: '4',
    type: 'spend',
    amount: -3,
    balance: 11,
    description: '生成产品视频',
    createdAt: '2026-01-23 09:20:00'
  },
  {
    id: '5',
    type: 'refund',
    amount: 5,
    balance: 14,
    description: '生成失败退款',
    createdAt: '2026-01-22 18:30:00'
  },
  {
    id: '6',
    type: 'earn',
    amount: 10,
    balance: 9,
    description: '每日签到奖励',
    createdAt: '2026-01-21 08:00:00'
  }
])

// 筛选后的记录
const filteredRecords = computed(() => {
  if (filterType.value === 'all') {
    return creditRecords.value
  }
  return creditRecords.value.filter(record => record.type === filterType.value)
})

// 获取类型标签
const getTypeLabel = (type: CreditRecord['type']) => {
  const labels = {
    earn: '获得',
    spend: '消费',
    refund: '退款',
    expire: '过期'
  }
  return labels[type]
}

// 获取类型样式
const getTypeVariant = (type: CreditRecord['type']) => {
  const variants = {
    earn: 'default',
    spend: 'secondary',
    refund: 'outline',
    expire: 'destructive'
  }
  return variants[type] as 'default' | 'secondary' | 'outline' | 'destructive'
}

// 获取金额颜色
const getAmountColor = (amount: number) => {
  if (amount > 0) return 'text-green-600'
  if (amount < 0) return 'text-red-600'
  return 'text-gray-600'
}

// 格式化金额
const formatAmount = (amount: number) => {
  if (amount > 0) return `+${amount}`
  return amount.toString()
}

// 跳转到定价页面
const goToPricing = () => {
  router.push('/pricing')
}

// 统计数据
const stats = computed(() => {
  const totalEarned = creditRecords.value
    .filter(r => r.type === 'earn' || r.type === 'refund')
    .reduce((sum, r) => sum + Math.abs(r.amount), 0)

  const totalSpent = creditRecords.value
    .filter(r => r.type === 'spend')
    .reduce((sum, r) => sum + Math.abs(r.amount), 0)

  return {
    totalEarned,
    totalSpent,
    current: currentUser.value?.credits || 0
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- 积分概览 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg border p-6">
        <div class="space-y-2">
          <p class="text-sm text-gray-500">当前积分</p>
          <p class="text-3xl font-bold">{{ stats.current }}</p>
        </div>
      </div>
      <div class="bg-white rounded-lg border p-6">
        <div class="space-y-2">
          <p class="text-sm text-gray-500">累计获得</p>
          <p class="text-3xl font-bold text-green-600">{{ stats.totalEarned }}</p>
        </div>
      </div>
      <div class="bg-white rounded-lg border p-6">
        <div class="space-y-2">
          <p class="text-sm text-gray-500">累计消费</p>
          <p class="text-3xl font-bold text-gray-600">{{ stats.totalSpent }}</p>
        </div>
      </div>
    </div>

    <!-- 积分记录 -->
    <div class="bg-white rounded-lg border">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold">积分记录</h2>
            <p class="text-sm text-gray-600 mt-1">查看您的积分获取和使用记录</p>
          </div>
          <div class="flex items-center gap-3">
            <Select v-model="filterType">
              <SelectTrigger class="w-32">
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="earn">获得</SelectItem>
                <SelectItem value="spend">消费</SelectItem>
                <SelectItem value="refund">退款</SelectItem>
                <SelectItem value="expire">过期</SelectItem>
              </SelectContent>
            </Select>
            <Button @click="goToPricing" class="bg-black hover:bg-black/90 text-white">
              购买积分
            </Button>
          </div>
        </div>
      </div>

      <div v-if="filteredRecords.length > 0" class="divide-y">
        <div
          v-for="record in filteredRecords"
          :key="record.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-3">
                <Badge :variant="getTypeVariant(record.type)" class="text-xs">
                  {{ getTypeLabel(record.type) }}
                </Badge>
                <h3 class="text-base font-medium">{{ record.description }}</h3>
              </div>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>{{ record.createdAt }}</span>
                <span v-if="record.relatedOrder" class="flex items-center gap-1">
                  订单号: {{ record.relatedOrder }}
                </span>
              </div>
            </div>
            <div class="text-right space-y-1">
              <p :class="['text-xl font-bold', getAmountColor(record.amount)]">
                {{ formatAmount(record.amount) }}
              </p>
              <p class="text-xs text-gray-500">
                余额: {{ record.balance }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-12">
        <div class="text-center space-y-4">
          <div class="text-gray-400 text-5xl">💰</div>
          <div>
            <p class="text-gray-600 mb-2">暂无积分记录</p>
            <p class="text-sm text-gray-500">购买套餐或完成任务即可获得积分</p>
          </div>
          <Button @click="goToPricing" class="mt-4">
            立即购买
          </Button>
        </div>
      </div>
    </div>

    <!-- 积分说明 -->
    <div class="bg-blue-50 rounded-lg border border-blue-200 p-6">
      <h3 class="text-base font-semibold mb-3">积分说明</h3>
      <div class="space-y-2 text-sm text-gray-700">
        <div class="flex items-start gap-2">
          <span class="text-blue-600 mt-0.5">•</span>
          <p>积分可用于生成图片、视频等 AI 内容</p>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-blue-600 mt-0.5">•</span>
          <p>购买套餐可获得对应积分,邀请好友注册双方各得 10 积分</p>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-blue-600 mt-0.5">•</span>
          <p>生成失败的积分会自动退回账户</p>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-blue-600 mt-0.5">•</span>
          <p>积分永久有效,不会过期</p>
        </div>
      </div>
    </div>
  </div>
</template>
