<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-vue-next";
import { PaymentAPI } from "@/api/payment";

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const processing = ref(false);
const qrCode = ref("");
const paymentMethod = ref((route.query.method as string) || "alipay");
const planName = ref((route.query.plan as string) || "专业版");
const amount = ref(Number(route.query.price) || 249);
const orderId = ref("");
const error = ref("");

let pollInterval: NodeJS.Timeout | null = null;
let pollTimeout: NodeJS.Timeout | null = null;
const POLL_INTERVAL = 3000; // 3秒轮询一次
const POLL_TIMEOUT = 300000; // 5分钟超时

// 清理定时器
const clearTimers = () => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  if (pollTimeout) {
    clearTimeout(pollTimeout);
    pollTimeout = null;
  }
};

// 组件卸载时清理
onUnmounted(() => {
  clearTimers();
});

// 初始化支付
onMounted(async () => {
  try {
    const packageId = Number(route.query.packageId);

    if (!packageId) {
      throw new Error("套餐信息缺失");
    }

    const response = await PaymentAPI.createPaymentOrder({
      package_id: packageId,
      channel_code: paymentMethod.value,
    });

    if (!response.data) {
      throw new Error("创建订单失败");
    }

    orderId.value = response.data.order_no;

    // 根据支付方式处理
    if (paymentMethod.value === "alipay") {
      handleAlipayPayment(response.data.pay_data);
    } else if (paymentMethod.value === "stripe") {
      handleStripePayment(response.data.pay_data);
    } else if (paymentMethod.value === "wechat") {
      handleQRCodePayment(response.data.pay_data);
    }
  } catch (err: any) {
    console.error("支付初始化失败:", err);
    error.value = err.message || "支付初始化失败";
    loading.value = false;

    // 3秒后跳转到失败页面
    setTimeout(() => {
      router.push({
        path: "/payment/result",
        query: {
          status: "failed",
          orderId: orderId.value,
          plan: planName.value,
          amount: amount.value,
          error: error.value,
        },
      });
    }, 3000);
  }
});

// 处理 Stripe 支付（跳转到 Stripe Checkout 页面）
const handleStripePayment = (payData: Record<string, any>) => {
  const payUrl = payData.pay_url;
  if (!payUrl) {
    error.value = "获取Stripe支付链接失败";
    loading.value = false;
    return;
  }
  window.location.href = payUrl;
};

// 处理支付宝支付
const handleAlipayPayment = (payData: Record<string, any>) => {
  const payUrl = payData.pay_url;
  if (!payUrl) {
    error.value = "获取支付宝支付链接失败";
    loading.value = false;
    return;
  }
  window.location.href = payUrl;
};

// 处理二维码支付（云购OS / 微信直连）
const handleQRCodePayment = (payData: Record<string, any>) => {
  qrCode.value = payData.qr_code || payData.qrCode || "";
  loading.value = false;
  startPolling();
};

// 开始轮询支付状态
const startPolling = () => {
  // 设置轮询超时
  pollTimeout = setTimeout(() => {
    clearTimers();
    router.push({
      path: "/payment/result",
      query: {
        status: "timeout",
        orderId: orderId.value,
        plan: planName.value,
        amount: amount.value,
      },
    });
  }, POLL_TIMEOUT);

  // 开始轮询
  pollInterval = setInterval(async () => {
    try {
      const response = await PaymentAPI.getPaymentOrder({ orderNo: orderId.value });

      if (!response.data) {
        return;
      }

      // status: 1-待支付, 2-已支付, 3-已取消, 4-已退款
      if (response.data.status === 2) {
        clearTimers();
        router.push({
          path: "/payment/result",
          query: {
            status: "success",
            orderId: orderId.value,
            plan: planName.value,
            amount: amount.value,
          },
        });
      } else if (response.data.status === 3) {
        clearTimers();
        router.push({
          path: "/payment/result",
          query: {
            status: "failed",
            orderId: orderId.value,
            plan: planName.value,
            amount: amount.value,
          },
        });
      }
    } catch (err) {
      console.error("轮询支付状态失败:", err);
      // 继续轮询，不中断
    }
  }, POLL_INTERVAL);
};

// 取消支付
const cancelPayment = () => {
  clearTimers();
  router.push({
    path: "/payment/checkout",
    query: {
      packageId: route.query.packageId,
      plan: planName.value,
      price: amount.value,
    },
  });
};
</script>

<template>
  <div class="flex-1 overflow-auto bg-gradient-to-br from-orange-50 via-white to-teal-50">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-200/30 to-teal-300/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <div class="relative max-w-3xl mx-auto px-4 py-12">
      <div class="animate-in fade-in slide-in-from-top-4 duration-700">
        <Card class="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader class="text-center pb-6">
            <CardTitle class="text-3xl bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
              完成支付
            </CardTitle>
            <CardDescription v-if="orderId" class="text-base mt-2">
              订单号: <span class="font-mono font-semibold">{{ orderId }}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <!-- 错误提示 -->
            <div v-if="error" class="text-center py-16 animate-in fade-in zoom-in duration-500">
              <div class="relative inline-block mb-6">
                <div class="absolute inset-0 bg-red-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div class="relative w-20 h-20 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                  <AlertCircle class="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">支付初始化失败</h3>
              <p class="text-gray-600 mb-6 max-w-md mx-auto">{{ error }}</p>
              <div class="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                <Loader2 class="w-4 h-4 animate-spin" />
                <span>页面将自动跳转...</span>
              </div>
            </div>

            <!-- 加载中 -->
            <div v-else-if="loading || processing" class="text-center py-16 animate-in fade-in zoom-in duration-500">
              <div class="relative inline-block mb-6">
                <div class="absolute inset-0 bg-gradient-to-r from-orange-200 to-teal-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div class="relative w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Loader2 class="w-12 h-12 animate-spin text-white" />
                </div>
              </div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent mb-3">
                {{ processing ? "正在处理支付" : "正在初始化支付" }}
              </h3>
              <p class="text-gray-600">请稍候，不要关闭页面...</p>
            </div>

            <!-- 二维码支付（云购OS / 微信直连）-->
            <div v-else-if="paymentMethod === 'wechat' && qrCode" class="text-center py-12 animate-in fade-in zoom-in duration-700">
              <div class="mb-8">
                <div class="relative inline-block">
                  <div class="absolute inset-0 bg-gradient-to-r from-orange-200 to-teal-200 rounded-2xl blur-2xl opacity-30 animate-pulse"></div>
                  <div class="relative w-72 h-72 mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-4 flex items-center justify-center border-4 border-white">
                    <img
                      :src="`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrCode)}`"
                      class="w-full h-full object-contain"
                      alt="微信支付二维码"
                    />
                  </div>
                </div>
              </div>

              <h3 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent mb-3">
                请使用微信扫码支付
              </h3>
              <div class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-teal-100 px-6 py-3 rounded-full mb-4">
                <span class="text-lg font-semibold text-gray-700">支付金额:</span>
                <span class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                  ¥{{ amount }}
                </span>
              </div>

              <div class="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>支付完成后页面将自动跳转</span>
              </div>

              <Button
                variant="outline"
                @click="cancelPayment"
                class="border-2 hover:bg-gray-50 transition-all duration-300"
                size="lg"
              >
                取消支付
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
