<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="bg-white rounded-lg border p-12">
    <div class="space-y-8">
      <div class="space-y-3">
        <h2 class="text-3xl font-bold">邀请好友</h2>
        <p class="text-gray-600 text-base">
          邀请好友注册,双方各可获得 10 积分奖励
        </p>
      </div>

      <div class="flex flex-col items-center space-y-6 py-8">
        <p class="text-gray-500 text-sm">
          邀请奖励仅对付费用户开放,升级后即可解锁。
        </p>
        <Button class="bg-black hover:bg-black/90 text-white h-10 px-6 rounded-lg">
          升级会员计划
        </Button>
      </div>
    </div>
  </div>
</template>
