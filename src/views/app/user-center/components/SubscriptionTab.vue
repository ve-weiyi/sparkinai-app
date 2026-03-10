<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentAPI } from "@/api/payment";
import { Loader2, Eye } from "lucide-vue-next";

const router = useRouter();

const orders = ref([]);
const loading = ref(false);
const selectedOrder = ref(null);
const showDetailDialog = ref(false);

// 订单状态映射
const statusMap = {
  1: { label: "待支付", variant: "secondary", color: "text-yellow-600" },
  2: { label: "已支付", variant: "default", color: "text-green-600" },
  3: { label: "已取消", variant: "outline", color: "text-gray-600" },
  4: { label: "已退款", variant: "destructive", color: "text-red-600" },
};

// 支付渠道映射
const channelMap = {
  alipay: "支付宝",
  wechat: "微信支付",
  stripe: "Stripe",
};

// 加载订单列表
const loadOrders = async () => {
  loading.value = true;
  try {
    const response = await PaymentAPI.getPaymentOrderList({
      page: 1,
      page_size: 20,
    });
    if (response.data?.list) {
      orders.value = response.data.list;
    }
  } catch (error) {
    console.error("加载订单失败:", error);
  } finally {
    loading.value = false;
  }
};

// 查看订单详情
const viewOrderDetail = (order: any) => {
  selectedOrder.value = order;
  showDetailDialog.value = true;
};

const goToPricing = () => {
  router.push("/pricing");
};

onMounted(() => {
  loadOrders();
});
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

    <!-- 加载状态 -->
    <div v-if="loading" class="p-12 flex justify-center items-center">
      <Loader2 class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <!-- 订单列表 -->
    <div v-else-if="orders.length > 0" class="p-6">
      <div class="space-y-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="border rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold">{{ order.package_name || "充值套餐" }}</h3>
                <Badge
                  :variant="statusMap[order.status]?.variant || 'secondary'"
                  class="text-xs"
                >
                  {{ statusMap[order.status]?.label || "未知" }}
                </Badge>
              </div>
              <p class="text-sm text-gray-600">订单号: {{ order.order_no }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold">¥{{ (order.pay_amount / 100).toFixed(2) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ channelMap[order.channel_code] || order.channel_code }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p class="text-xs text-gray-500">创建时间</p>
              <p class="text-sm font-medium mt-1">{{ new Date(order.created_at).toLocaleString("zh-CN") }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">支付时间</p>
              <p class="text-sm font-medium mt-1">
                {{ order.pay_time ? new Date(order.pay_time).toLocaleString("zh-CN") : "-" }}
              </p>
            </div>
          </div>

          <div class="flex justify-end mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              @click="viewOrderDetail(order)"
              class="gap-2"
            >
              <Eye class="w-4 h-4" />
              查看详情
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
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

    <!-- 订单详情弹窗 -->
    <Dialog v-model:open="showDetailDialog">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>订单详情</DialogTitle>
        </DialogHeader>
        <div v-if="selectedOrder" class="space-y-6">
          <!-- 订单状态 -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span class="text-sm text-gray-600">订单状态</span>
            <Badge :variant="statusMap[selectedOrder.status]?.variant || 'secondary'">
              {{ statusMap[selectedOrder.status]?.label || "未知" }}
            </Badge>
          </div>

          <!-- 订单信息 -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <p class="text-xs text-gray-500">订单号</p>
              <p class="text-sm font-medium font-mono">{{ selectedOrder.order_no }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500">套餐名称</p>
              <p class="text-sm font-medium">{{ selectedOrder.package_name || "-" }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500">支付金额</p>
              <p class="text-sm font-medium text-orange-600">¥{{ (selectedOrder.pay_amount / 100).toFixed(2) }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500">支付方式</p>
              <p class="text-sm font-medium">{{ channelMap[selectedOrder.channel_code] || selectedOrder.channel_code }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500">创建时间</p>
              <p class="text-sm font-medium">{{ new Date(selectedOrder.created_at).toLocaleString("zh-CN") }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500">支付时间</p>
              <p class="text-sm font-medium">
                {{ selectedOrder.pay_time ? new Date(selectedOrder.pay_time).toLocaleString("zh-CN") : "-" }}
              </p>
            </div>
          </div>

          <!-- 套餐详情 -->
          <div v-if="selectedOrder.package_credits" class="p-4 bg-gradient-to-r from-orange-50 to-teal-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-2">套餐内容</p>
            <p class="text-lg font-semibold">{{ selectedOrder.package_credits }} 积分</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
