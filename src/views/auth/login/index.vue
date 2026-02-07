<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";
</script>

<template>
  <div class="auth-panel-content">
    <div class="auth-panel-header">
      <span class="panel-pill">登录</span>
      <h2 class="panel-title">进入你的 AI 生成控制台</h2>
      <p class="panel-subtitle">使用企业邮箱或第三方账号登录，继续你的创作任务。</p>
    </div>
    <LoginForm class="auth-form" />
  </div>
</template>
