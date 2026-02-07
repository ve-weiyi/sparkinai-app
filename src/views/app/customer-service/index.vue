<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Headset, MessageCircle, Clock } from "lucide-vue-next";
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold mb-2">客服中心</h1>
      <p class="text-muted-foreground">我们随时为您提供帮助</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- 企业微信客服 -->
      <Card>
        <CardHeader>
          <div class="flex items-center gap-2">
            <Headset class="w-5 h-5 text-green-600" />
            <CardTitle>企业微信客服</CardTitle>
          </div>
          <CardDescription>扫码添加客服微信，获取一对一专属服务</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col items-center space-y-4">
          <div
            class="w-64 h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed"
          >
            <!-- 这里放置企业微信二维码图片 -->
            <div class="text-center space-y-2">
              <Headset class="w-12 h-12 mx-auto text-muted-foreground" />
              <p class="text-sm text-muted-foreground">企业微信客服二维码</p>
              <p class="text-xs text-muted-foreground">请联系管理员上传二维码</p>
            </div>
          </div>
          <div class="text-center space-y-1">
            <p class="text-sm font-medium">扫码添加客服微信</p>
            <p class="text-xs text-muted-foreground">工作时间：周一至周五 9:00-18:00</p>
          </div>
        </CardContent>
      </Card>

      <!-- 在线客服信息 -->
      <Card>
        <CardHeader>
          <div class="flex items-center gap-2">
            <MessageCircle class="w-5 h-5 text-blue-600" />
            <CardTitle>联系方式</CardTitle>
          </div>
          <CardDescription>多种方式联系我们的客服团队</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0"
              >
                <Headset class="w-5 h-5 text-green-600" />
              </div>
              <div class="flex-1">
                <h3 class="font-medium mb-1">企业微信</h3>
                <p class="text-sm text-muted-foreground">扫描左侧二维码添加客服微信</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0"
              >
                <MessageCircle class="w-5 h-5 text-blue-600" />
              </div>
              <div class="flex-1">
                <h3 class="font-medium mb-1">在线客服</h3>
                <p class="text-sm text-muted-foreground">support@sparkinai.com</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0"
              >
                <Clock class="w-5 h-5 text-orange-600" />
              </div>
              <div class="flex-1">
                <h3 class="font-medium mb-1">服务时间</h3>
                <p class="text-sm text-muted-foreground">周一至周五 9:00-18:00</p>
                <p class="text-sm text-muted-foreground">节假日休息</p>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t">
            <h3 class="font-medium mb-2">常见问题</h3>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• 如何购买积分和订阅？</li>
              <li>• 如何使用AI生成图片？</li>
              <li>• 支付遇到问题怎么办？</li>
              <li>• 如何邀请好友获得奖励？</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 温馨提示 -->
    <Card>
      <CardHeader>
        <CardTitle class="text-base">温馨提示</CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li>• 为了更快地解决您的问题，请在咨询时提供详细的问题描述和相关截图</li>
          <li>• 客服工作时间为周一至周五 9:00-18:00，非工作时间留言我们会在下个工作日及时回复</li>
          <li>• 如遇紧急问题，请发送邮件至 support@sparkinai.com，我们会优先处理</li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>
