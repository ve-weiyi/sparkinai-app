<script setup lang="ts">
import SignupForm from "@/components/SignupForm.vue";
</script>

<template>
  <div class="auth-panel-content">
    <div class="auth-panel-header">
      <span class="panel-pill">注册</span>
      <h2 class="panel-title">快速创建你的团队账号</h2>
      <p class="panel-subtitle">填写邮箱和密码，完成验证即可进入控制台。</p>
    </div>
    <SignupForm class="auth-form" />
  </div>
</template>
