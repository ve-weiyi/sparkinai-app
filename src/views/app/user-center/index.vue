<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUserData } from '@/composables/useUserData'

const router = useRouter()
const route = useRoute()
const { currentUser } = useUserData()

const tabs = [
  { label: '账户', value: 'account' },
  { label: '我的订阅', value: 'subscription' },
  { label: '积分记录', value: 'credits' },
  { label: '我的邀请', value: 'invitation' }
]

const activeTab = ref((route.query.tab as string) || 'account')

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab as string
  }
})

// 模拟订单数据
const orders = ref([
  {
    id: 'ORD20260126001',
    plan: '专业版',
    amount: 249,
    status: 'active',
    startDate: '2026-01-26',
    endDate: '2026-02-26',
    paymentMethod: '支付宝'
  }
])

const goToPricing = () => {
  router.push('/pricing')
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold mb-2">用户中心</h1>
    </div>

    <div class="w-full">
      <div class="border-b">
        <div class="flex gap-8">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            class="pb-3 text-sm transition-colors relative"
            :class="activeTab === tab.value ? 'text-black font-medium' : 'text-gray-500 hover:text-gray-700'"
          >
            {{ tab.label }}
            <div
              v-if="activeTab === tab.value"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
            />
          </button>
        </div>
      </div>

      <div class="mt-6">
        <div v-show="activeTab === 'account'">
          <div class="max-w-4xl">
            <div class="bg-white rounded-lg border p-8 space-y-6">
              <div class="space-y-2">
                <h2 class="text-xl font-semibold">设置密码</h2>
                <p class="text-sm text-gray-500">为您的账户设置密码，以启用密码登录功能。</p>
              </div>

              <div class="bg-gray-50 rounded-lg p-6 space-y-4">
                <div class="space-y-2">
                  <h3 class="text-base font-medium">验证邮箱</h3>
                  <p class="text-sm text-gray-500">
                    为了安全起见，修改密码前需要先验证您的邮箱 {{ currentUser?.email }}。
                  </p>
                </div>
                <Button class="bg-black hover:bg-black/90 text-white h-10 px-5 text-sm rounded-md">
                  发送验证码
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'subscription'">
          <div class="bg-white rounded-lg border">
            <div class="p-6 border-b flex justify-between items-center">
              <div>
                <h2 class="text-lg font-semibold">我的订阅</h2>
                <p class="text-sm text-gray-600 mt-1">管理您的订阅和订单历史</p>
              </div>
              <Button @click="goToPricing" class="bg-black hover:bg-black/90 text-white">
                升级套餐
              </Button>
            </div>

            <div v-if="orders.length > 0" class="p-6">
              <div class="space-y-4">
                <div
                  v-for="order in orders"
                  :key="order.id"
                  class="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-semibold">{{ order.plan }}</h3>
                        <Badge
                          :variant="order.status === 'active' ? 'default' : 'secondary'"
                          class="text-xs"
                        >
                          {{ order.status === 'active' ? '使用中' : '已过期' }}
                        </Badge>
                      </div>
                      <p class="text-sm text-gray-600">订单号: {{ order.id }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold">¥{{ order.amount }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ order.paymentMethod }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p class="text-xs text-gray-500">开始日期</p>
                      <p class="text-sm font-medium mt-1">{{ order.startDate }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">到期日期</p>
                      <p class="text-sm font-medium mt-1">{{ order.endDate }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="p-12">
              <div class="text-center space-y-4">
                <div class="text-gray-400 text-5xl">📦</div>
                <div>
                  <p class="text-gray-600 mb-2">暂无订阅记录</p>
                  <p class="text-sm text-gray-500">立即购买套餐，开启您的创作之旅</p>
                </div>
                <Button @click="goToPricing" class="mt-4">
                  浏览套餐
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'credits'">
          <div class="bg-white rounded-lg border p-8">
            <div class="text-center py-12 text-gray-500">
              暂无积分记录
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'invitation'">
          <div class="bg-white rounded-lg border p-12">
            <div class="space-y-8">
              <div class="space-y-3">
                <h2 class="text-3xl font-bold">邀请好友</h2>
                <p class="text-gray-600 text-base">
                  邀请好友注册，双方各可获得 10 积分奖励
                </p>
              </div>

              <div class="flex flex-col items-center space-y-6 py-8">
                <p class="text-gray-500 text-sm">
                  邀请奖励仅对付费用户开放，升级后即可解锁。
                </p>
                <Button class="bg-black hover:bg-black/90 text-white h-10 px-6 rounded-lg">
                  升级会员计划
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
