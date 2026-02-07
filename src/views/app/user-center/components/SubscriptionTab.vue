<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const router = useRouter();

// 模拟订单数据
const orders = ref([
  {
    id: "ORD20260126001",
    plan: "专业版",
    amount: 249,
    status: "active",
    startDate: "2026-01-26",
    endDate: "2026-02-26",
    paymentMethod: "支付宝",
  },
]);

const goToPricing = () => {
  router.push("/pricing");
};
</script>

<template>
  <div class="bg-white rounded-lg border">
    <div class="p-6 border-b flex justify-between items-center">
      <div>
        <h2 class="text-lg font-semibold">我的订阅</h2>
        <p class="text-sm text-gray-600 mt-1">管理您的订阅和订单历史</p>
      </div>
      <Button @click="goToPricing" class="bg-black hover:bg-black/90 text-white">升级套餐</Button>
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
                  {{ order.status === "active" ? "使用中" : "已过期" }}
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
          <p class="text-sm text-gray-500">立即购买套餐,开启您的创作之旅</p>
        </div>
        <Button @click="goToPricing" class="mt-4">浏览套餐</Button>
      </div>
    </div>
  </div>
</template>
