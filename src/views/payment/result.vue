<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, Home, FileText } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// 支付状态
const status = ref<'success' | 'failed'>(route.query.status as any || 'success')
const orderId = ref(route.query.orderId as string || 'ORD' + Date.now())
const planName = ref(route.query.plan as string || '专业版')
const amount = ref(route.query.amount as string || '249')

const goToHome = () => {
  router.push('/app/dashboard')
}

const goToOrders = () => {
  router.push('/app/user-center?tab=subscription')
}
</script>

<template>
  <div class="flex-1 overflow-auto bg-gray-50/50">
    <div class="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardContent class="pt-12 pb-8">
          <div class="text-center space-y-6">
            <!-- 成功图标 -->
            <div v-if="status === 'success'" class="flex justify-center">
              <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 class="w-12 h-12 text-green-600" />
              </div>
            </div>

            <!-- 失败图标 -->
            <div v-else class="flex justify-center">
              <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle class="w-12 h-12 text-red-600" />
              </div>
            </div>

            <!-- 标题和描述 -->
            <div v-if="status === 'success'" class="space-y-2">
              <h1 class="text-3xl font-bold">支付成功！</h1>
              <p class="text-gray-600">感谢您的购买，您的订单已完成</p>
            </div>
            <div v-else class="space-y-2">
              <h1 class="text-3xl font-bold">支付失败</h1>
              <p class="text-gray-600">很抱歉，您的支付未能完成</p>
            </div>

            <!-- 订单详情 -->
            <div class="bg-gray-50 rounded-lg p-6 space-y-3 text-left max-w-md mx-auto">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">订单号</span>
                <span class="font-mono text-sm">{{ orderId }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">套餐</span>
                <span class="font-medium">{{ planName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">金额</span>
                <span class="font-bold text-lg">¥{{ amount }}</span>
              </div>
              <div v-if="status === 'success'" class="flex justify-between">
                <span class="text-sm text-gray-600">支付时间</span>
                <span class="text-sm">{{ new Date().toLocaleString('zh-CN') }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-4 justify-center pt-4">
              <Button @click="goToHome" variant="outline" size="lg">
                <Home class="w-4 h-4 mr-2" />
                返回首页
              </Button>
              <Button v-if="status === 'success'" @click="goToOrders" size="lg">
                <FileText class="w-4 h-4 mr-2" />
                查看订单
              </Button>
              <Button v-else @click="router.back()" size="lg">
                重新支付
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>