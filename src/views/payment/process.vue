<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-vue-next";
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

// 初始化支付
onMounted(async () => {
  try {
    const packageId = Number(route.query.packageId) || 1;
    const response = await PaymentAPI.createPaymentOrder({
      package_id: packageId,
      channel_code: paymentMethod.value,
    });
    orderId.value = response.data.order_no;

    if (paymentMethod.value === "alipay" || paymentMethod.value === "stripe") {
      simulatePayment();
    } else if (paymentMethod.value === "wechat") {
      qrCode.value = "mock-qr-code";
      loading.value = false;
      pollPaymentStatus();
    }
  } catch (error) {
    console.error("支付初始化失败:", error);
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
});

const simulatePayment = () => {
  processing.value = true;
  setTimeout(() => {
    router.push({
      path: "/payment/result",
      query: {
        status: "success",
        orderId: orderId.value,
        plan: planName.value,
        amount: amount.value,
      },
    });
  }, 2000);
};

const pollPaymentStatus = () => {
  const interval = setInterval(async () => {
    try {
      const status = await PaymentAPI.getPaymentOrder({ orderNo: orderId.value });
      if (status.data.status === 2) {
        clearInterval(interval);
        router.push({
          path: "/payment/result",
          query: {
            status: "success",
            orderId: orderId.value,
            plan: planName.value,
            amount: amount.value,
          },
        });
      } else if (status.data.status === 3) {
        clearInterval(interval);
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
    } catch (error) {
      clearInterval(interval);
    }
  }, 3000);
};
</script>

<template>
  <div class="flex-1 overflow-auto bg-gray-50/50">
    <div class="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>完成支付</CardTitle>
          <CardDescription>订单号: {{ orderId }}</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- 加载中 -->
          <div v-if="loading || processing" class="text-center py-12">
            <Loader2 class="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
            <p class="text-gray-600">{{ processing ? "正在处理支付..." : "正在初始化支付..." }}</p>
          </div>

          <!-- 微信支付二维码 -->
          <div v-else-if="paymentMethod === 'wechat' && qrCode" class="text-center py-8">
            <div class="mb-6">
              <div
                class="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <!-- 这里应该显示实际的二维码 -->
                <div class="text-6xl">📱</div>
              </div>
            </div>
            <h3 class="text-lg font-semibold mb-2">请使用微信扫码支付</h3>
            <p class="text-sm text-gray-600 mb-4">支付金额: ¥{{ amount }}</p>
            <p class="text-xs text-gray-500">支付完成后页面将自动跳转</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
