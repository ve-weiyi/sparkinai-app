<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CreditCard } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// 从路由参数获取套餐信息
const planName = ref(route.query.plan as string || '专业版')
const planPrice = ref(Number(route.query.price) || 249)

// 支付方式
const paymentMethod = ref<'alipay' | 'wechat' | 'stripe'>('alipay')

const paymentMethods = [
  { value: 'alipay', label: '支付宝', icon: '💳' },
  { value: 'wechat', label: '微信支付', icon: '💚' },
  { value: 'stripe', label: 'Stripe (信用卡)', icon: '💳' }
]

// 处理支付
const handlePayment = async () => {
  // 这里将调用支付服务
  router.push({
    path: '/payment/process',
    query: {
      plan: planName.value,
      price: planPrice.value,
      method: paymentMethod.value
    }
  })
}
</script>

<template>
  <div class="flex-1 overflow-auto bg-gray-50/50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-6">
        <Button variant="ghost" size="sm" @click="router.back()">
          <ArrowLeft class="w-4 h-4 mr-2" />
          返回
        </Button>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <!-- 订单信息 -->
        <div class="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>订单信息</CardTitle>
              <CardDescription>请确认您的订单详情</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex justify-between items-center py-3 border-b">
                <span class="text-sm text-gray-600">套餐名称</span>
                <span class="font-medium">{{ planName }}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b">
                <span class="text-sm text-gray-600">订阅周期</span>
                <span class="font-medium">1 个月</span>
              </div>
              <div class="flex justify-between items-center py-3">
                <span class="text-sm text-gray-600">金额</span>
                <span class="text-2xl font-bold text-primary">¥{{ planPrice }}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>选择支付方式</CardTitle>
              <CardDescription>请选择您的支付方式</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div
                  v-for="method in paymentMethods"
                  :key="method.value"
                  @click="paymentMethod = method.value as any"
                  :class="[
                    'flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all',
                    paymentMethod === method.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="text-2xl">{{ method.icon }}</div>
                  <div class="flex-1">
                    <div class="font-medium">{{ method.label }}</div>
                  </div>
                  <div
                    :class="[
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      paymentMethod === method.value
                        ? 'border-primary'
                        : 'border-gray-300'
                    ]"
                  >
                    <div
                      v-if="paymentMethod === method.value"
                      class="w-3 h-3 rounded-full bg-primary"
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- 订单摘要 -->
        <div class="md:col-span-1">
          <Card class="sticky top-6">
            <CardHeader>
              <CardTitle>订单摘要</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">套餐费用</span>
                  <span>¥{{ planPrice }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">优惠</span>
                  <span class="text-green-600">-¥0</span>
                </div>
              </div>
              <div class="border-t pt-4">
                <div class="flex justify-between items-center mb-4">
                  <span class="font-medium">总计</span>
                  <span class="text-2xl font-bold text-primary">¥{{ planPrice }}</span>
                </div>
                <Button @click="handlePayment" class="w-full" size="lg">
                  <CreditCard class="w-4 h-4 mr-2" />
                  确认支付
                </Button>
              </div>
              <p class="text-xs text-gray-500 text-center">
                点击确认支付即表示您同意我们的服务条款
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>