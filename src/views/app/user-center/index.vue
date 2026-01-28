<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AccountTab from './components/AccountTab.vue'
import SubscriptionTab from './components/SubscriptionTab.vue'
import CreditsTab from './components/CreditsTab.vue'
import InvitationTab from './components/InvitationTab.vue'

const route = useRoute()

const tabs = [
  { label: '账户', value: 'account' },
  { label: '我的订阅', value: 'subscription' },
  { label: '积分记录', value: 'credits' },
  { label: '我的邀请', value: 'invitation' }
]

const activeTab = ref((route.query.tab as string) || 'account')

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab as string
  }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold mb-2">用户中心</h1>
    </div>

    <div class="w-full">
      <div class="border-b">
        <div class="flex gap-8">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            class="pb-3 text-sm transition-colors relative"
            :class="activeTab === tab.value ? 'text-black font-medium' : 'text-gray-500 hover:text-gray-700'"
          >
            {{ tab.label }}
            <div
              v-if="activeTab === tab.value"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
            />
          </button>
        </div>
      </div>

      <div class="mt-6">
        <AccountTab v-show="activeTab === 'account'" />
        <SubscriptionTab v-show="activeTab === 'subscription'" />
        <CreditsTab v-show="activeTab === 'credits'" />
        <InvitationTab v-show="activeTab === 'invitation'" />
      </div>
    </div>
  </div>
</template>
