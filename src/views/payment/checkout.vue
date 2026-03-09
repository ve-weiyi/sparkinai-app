<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, AlertCircle } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

// 从路由参数获取套餐信息
const planName = ref((route.query.plan as string) || "专业版");
const planPrice = ref(Number(route.query.price) || 249);
const packageId = ref(Number(route.query.packageId) || 1);

// 支付方式
const paymentMethod = ref<"alipay" | "wechat" | "stripe">("alipay");
const loading = ref(false);
const error = ref("");

const paymentMethods = [
  { value: "alipay", label: "支付宝", icon: "💳" },
  { value: "wechat", label: "微信支付", icon: "💚" },
  { value: "stripe", label: "Stripe (信用卡)", icon: "💳" },
];

// 处理支付
const handlePayment = async () => {
  if (!packageId.value) {
    error.value = "套餐信息缺失，请返回重新选择";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    // 跳转到支付处理页面
    await router.push({
      path: "/payment/process",
      query: {
        packageId: packageId.value,
        plan: planName.value,
        price: planPrice.value,
        method: paymentMethod.value,
      },
    });
  } catch (err) {
    console.error("Payment navigation failed:", err);
    error.value = "页面跳转失败，请重试";
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex-1 overflow-auto bg-gradient-to-br from-orange-50 via-white to-teal-50">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-orange-300/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-200/30 to-teal-300/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-6xl mx-auto px-4 py-12">
      <!-- Back button -->
      <div class="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <Button variant="ghost" size="sm" @click="router.back()" class="hover:bg-white/80 transition-all">
          <ArrowLeft class="w-4 h-4 mr-2" />
          返回
        </Button>
      </div>

      <!-- Page title -->
      <div class="text-center mb-12 animate-in fade-in slide-in-from-top-6 duration-700">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent mb-3">
          完成支付
        </h1>
        <p class="text-gray-600">安全便捷的支付体验</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left column: Order info and payment methods -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order information -->
          <div class="animate-in fade-in slide-in-from-left-4 duration-700">
            <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle class="text-2xl">订单信息</CardTitle>
                <CardDescription>请确认您的订单详情</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="flex justify-between items-center py-4 border-b border-gray-100">
                  <span class="text-gray-600">套餐名称</span>
                  <span class="font-semibold text-lg">{{ planName }}</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-gray-100">
                  <span class="text-gray-600">订阅周期</span>
                  <span class="font-semibold">1 个月</span>
                </div>
                <div class="flex justify-between items-center py-4">
                  <span class="text-gray-600">金额</span>
                  <span class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                    ¥{{ planPrice }}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Payment methods -->
          <div class="animate-in fade-in slide-in-from-left-6 duration-900">
            <Card class="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle class="text-2xl">选择支付方式</CardTitle>
                <CardDescription>支持多种支付方式，安全可靠</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div
                    v-for="method in paymentMethods"
                    :key="method.value"
                    @click="paymentMethod = method.value as any"
                    :class="[
                      'group relative flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-300',
                      paymentMethod === method.value
                        ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-teal-50 shadow-lg scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.01]',
                    ]"
                  >
                    <div class="text-3xl transition-transform group-hover:scale-110 duration-300">
                      {{ method.icon }}
                    </div>
                    <div class="flex-1">
                      <div class="font-semibold text-lg">{{ method.label }}</div>
                    </div>
                    <div
                      :class="[
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                        paymentMethod === method.value ? 'border-orange-500 bg-orange-500' : 'border-gray-300',
                      ]"
                    >
                      <div
                        v-if="paymentMethod === method.value"
                        class="w-2 h-2 rounded-full bg-white"
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Right column: Order summary -->
        <div class="lg:col-span-1">
          <div class="animate-in fade-in slide-in-from-right-4 duration-700 sticky top-6">
            <Card class="border-0 shadow-xl bg-gradient-to-br from-white via-orange-50/30 to-teal-50/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle class="text-2xl">订单摘要</CardTitle>
              </CardHeader>
              <CardContent class="space-y-6">
                <div class="space-y-3">
                  <div class="flex justify-between text-base">
                    <span class="text-gray-600">套餐费用</span>
                    <span class="font-semibold">¥{{ planPrice }}</span>
                  </div>
                  <div class="flex justify-between text-base">
                    <span class="text-gray-600">优惠</span>
                    <span class="text-green-600 font-semibold">-¥0</span>
                  </div>
                </div>

                <div class="border-t-2 border-gray-200 pt-6">
                  <div class="flex justify-between items-center mb-6">
                    <span class="text-lg font-semibold">总计</span>
                    <span class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                      ¥{{ planPrice }}
                    </span>
                  </div>

                  <Button
                    @click="handlePayment"
                    class="w-full bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    size="lg"
                    :disabled="loading"
                  >
                    <CreditCard class="w-5 h-5 mr-2" />
                    {{ loading ? "处理中..." : "确认支付" }}
                  </Button>

                  <div v-if="error" class="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg animate-in fade-in duration-300">
                    <AlertCircle class="w-4 h-4" />
                    <span>{{ error }}</span>
                  </div>
                </div>

                <div class="bg-gradient-to-r from-orange-100/50 to-teal-100/50 rounded-lg p-4">
                  <p class="text-xs text-gray-600 text-center leading-relaxed">
                    点击确认支付即表示您同意我们的<span class="text-orange-600 font-medium">服务条款</span>和<span class="text-teal-600 font-medium">隐私政策</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
