<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Home, FileText } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

// 支付状态
const status = ref<"success" | "failed">((route.query.status as any) || "success");
const orderId = ref((route.query.orderId as string) || "ORD" + Date.now());
const planName = ref((route.query.plan as string) || "专业版");
const amount = ref((route.query.amount as string) || "249");

const goToHome = () => {
  router.push("/app/dashboard");
};

const goToOrders = () => {
  router.push("/app/user-center?tab=subscription");
};
</script>

<template>
  <div class="flex-1 overflow-auto bg-gradient-to-br from-orange-50 via-white to-teal-50">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-if="status === 'success'"
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/30 to-teal-300/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        v-else
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/30 to-orange-300/20 rounded-full blur-3xl animate-pulse"
      ></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-200/30 to-blue-300/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <div class="relative max-w-3xl mx-auto px-4 py-12">
      <div class="animate-in fade-in zoom-in duration-700">
        <Card class="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardContent class="pt-16 pb-12">
            <div class="text-center space-y-8">
              <!-- Success icon -->
              <div v-if="status === 'success'" class="flex justify-center animate-in zoom-in duration-500" style="animation-delay: 200ms">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-green-200 to-teal-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div class="relative w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-2xl">
                    <CheckCircle2 class="w-16 h-16 text-white animate-in zoom-in duration-300" style="animation-delay: 400ms" />
                  </div>
                </div>
              </div>

              <!-- Failure icon -->
              <div v-else class="flex justify-center animate-in zoom-in duration-500" style="animation-delay: 200ms">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-red-200 to-orange-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div class="relative w-28 h-28 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-2xl">
                    <XCircle class="w-16 h-16 text-white animate-in zoom-in duration-300" style="animation-delay: 400ms" />
                  </div>
                </div>
              </div>

              <!-- Title and description -->
              <div v-if="status === 'success'" class="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500" style="animation-delay: 300ms">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  支付成功！
                </h1>
                <p class="text-lg text-gray-600">感谢您的购买，您的订单已完成</p>
              </div>
              <div v-else class="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500" style="animation-delay: 300ms">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  支付失败
                </h1>
                <p class="text-lg text-gray-600">很抱歉，您的支付未能完成</p>
              </div>

              <!-- Order details -->
              <div class="animate-in fade-in slide-in-from-bottom-6 duration-700" style="animation-delay: 400ms">
                <div
                  :class="[
                    'rounded-2xl p-8 space-y-4 text-left max-w-md mx-auto shadow-lg',
                    status === 'success'
                      ? 'bg-gradient-to-br from-green-50 to-teal-50'
                      : 'bg-gradient-to-br from-red-50 to-orange-50'
                  ]"
                >
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-600">订单号</span>
                    <span class="font-mono text-sm font-semibold bg-white px-3 py-1 rounded-lg shadow-sm">
                      {{ orderId }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-600">套餐</span>
                    <span class="font-semibold text-lg">{{ planName }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-600">金额</span>
                    <span
                      :class="[
                        'text-3xl font-bold bg-clip-text text-transparent',
                        status === 'success'
                          ? 'bg-gradient-to-r from-green-600 to-teal-600'
                          : 'bg-gradient-to-r from-red-600 to-orange-600'
                      ]"
                    >
                      ¥{{ amount }}
                    </span>
                  </div>
                  <div v-if="status === 'success'" class="flex justify-between items-center py-2 border-t border-gray-200 pt-4">
                    <span class="text-gray-600">支付时间</span>
                    <span class="text-sm font-medium">{{ new Date().toLocaleString("zh-CN") }}</span>
                  </div>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex flex-wrap gap-4 justify-center pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700" style="animation-delay: 500ms">
                <Button
                  @click="goToHome"
                  variant="outline"
                  size="lg"
                  class="border-2 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                >
                  <Home class="w-5 h-5 mr-2" />
                  返回首页
                </Button>
                <Button
                  v-if="status === 'success'"
                  @click="goToOrders"
                  size="lg"
                  class="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <FileText class="w-5 h-5 mr-2" />
                  查看订单
                </Button>
                <Button
                  v-else
                  @click="router.back()"
                  size="lg"
                  class="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  重新支付
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
