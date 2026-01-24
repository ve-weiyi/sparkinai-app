<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUserData } from '@/composables/useUserData'

const { currentUser } = useUserData()
</script>

<template>
  <div class="flex-1 space-y-4 p-8 bg-gray-50/50">
    <h1 class="text-2xl font-semibold">用户中心</h1>

    <Tabs default-value="account" class="w-full">
      <TabsList class="bg-gray-200 rounded-lg w-auto justify-start h-auto p-1 inline-flex">
        <TabsTrigger
          value="account"
          class="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-normal data-[state=active]:font-medium"
        >
          账户
        </TabsTrigger>
        <TabsTrigger
          value="subscription"
          class="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-normal data-[state=active]:font-medium"
        >
          我的订阅
        </TabsTrigger>
        <TabsTrigger
          value="credits"
          class="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-normal data-[state=active]:font-medium"
        >
          积分记录
        </TabsTrigger>
        <TabsTrigger
          value="invitation"
          class="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-normal data-[state=active]:font-medium"
        >
          我的邀请
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account" class="mt-6">
        <div class="max-w-3xl">
          <div class="bg-white rounded-lg border p-6 space-y-6">
            <div class="space-y-2">
              <h2 class="text-lg font-semibold">设置密码</h2>
              <p class="text-sm text-gray-600">为您的账户设置密码，以启用密码登录功能。</p>
            </div>

            <div class="bg-gray-50 rounded-md p-5 space-y-4">
              <div class="space-y-2">
                <h3 class="text-sm font-medium">验证邮箱</h3>
                <p class="text-sm text-gray-600">
                  为了安全起见，修改密码前需要先验证您的邮箱 {{ currentUser?.email }}。
                </p>
              </div>
              <Button class="bg-black hover:bg-black/90 text-white h-9 px-4 text-sm">
                发送验证码
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="subscription" class="mt-6">
        <div class="bg-white rounded-lg border p-8">
          <div class="text-center py-12 text-gray-500">
            暂无订阅信息
          </div>
        </div>
      </TabsContent>

      <TabsContent value="credits" class="mt-6">
        <div class="bg-white rounded-lg border p-8">
          <div class="text-center py-12 text-gray-500">
            暂无积分记录
          </div>
        </div>
      </TabsContent>

      <TabsContent value="invitation" class="mt-6">
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
      </TabsContent>
    </Tabs>
  </div>
</template>
