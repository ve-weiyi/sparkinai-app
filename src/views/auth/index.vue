<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { Sparkles } from "lucide-vue-next";

const route = useRoute();
</script>

<template>
  <div class="auth-root">
    <div class="auth-shell">
      <RouterLink to="/" class="back-home-button">
        <span class="back-home-icon">←</span>
        返回首页
      </RouterLink>
      <div class="auth-container">
        <section class="auth-hero">
          <RouterLink to="/" class="auth-brand auth-brand-link">
            <div class="brand-mark">
              <Sparkles class="brand-icon" />
            </div>
            <div>
              <p class="brand-name">内容生产平台</p>
              <p class="brand-sub">AI 驱动的电商内容生产线</p>
            </div>
          </RouterLink>
          <h1 class="auth-title">让内容生产变成流水线</h1>
          <p class="auth-subtitle">主图、详情页、短视频脚本与多平台文案，在一个控制台完成。</p>
          <div class="auth-highlights">
            <div class="highlight-card">
              <p class="highlight-title">多平台适配</p>
              <p class="highlight-desc">小红书、抖音、快手、电商详情一键同步。</p>
            </div>
            <div class="highlight-card">
              <p class="highlight-title">风格快速切换</p>
              <p class="highlight-desc">极简、实拍、潮流、节日主题随时切换。</p>
            </div>
            <div class="highlight-card">
              <p class="highlight-title">协作更顺畅</p>
              <p class="highlight-desc">素材沉淀与版本管理，团队协作更轻松。</p>
            </div>
            <div class="highlight-card">
              <p class="highlight-title">企业级安全</p>
              <p class="highlight-desc">权限隔离与资产加密，保障品牌资产。</p>
            </div>
          </div>
          <div class="auth-footnote">
            <span class="auth-dot"></span>
            已服务 100K+ 创作者与品牌团队
          </div>
        </section>
        <section class="auth-panel">
          <RouterView v-slot="{ Component }">
            <Transition name="auth-panel-fade" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </Transition>
          </RouterView>
        </section>
      </div>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap");

.auth-root {
  --accent-1: #ff6a3d;
  --accent-2: #ffb07a;
  --accent-3: #2dd4bf;
  min-height: 100vh;
  background: radial-gradient(circle at top left, #fff5ec 0%, #ffffff 45%, #fef6e8 100%);
  color: #0f172a;
  font-family: "Space Grotesk", "Noto Sans SC", sans-serif;
  position: relative;
  overflow: hidden;
}

.auth-root::before {
  content: "";
  position: absolute;
  width: 520px;
  height: 520px;
  top: -180px;
  right: -160px;
  background: radial-gradient(circle, rgba(255, 154, 96, 0.3), transparent 70%);
  filter: blur(8px);
}

.auth-root::after {
  content: "";
  position: absolute;
  width: 420px;
  height: 420px;
  bottom: -200px;
  left: -140px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.22), transparent 70%);
  filter: blur(10px);
}

.auth-root .auth-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  position: relative;
  z-index: 1;
}

.auth-root .back-home-button {
  position: absolute;
  top: 24px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 18px 40px rgba(255, 106, 61, 0.3);
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
}

.auth-root .back-home-button:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.auth-root .back-home-icon {
  font-size: 0.9rem;
  line-height: 1;
}

.auth-root .auth-container {
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 440px);
  gap: 40px;
  align-items: center;
}

.auth-root .auth-hero {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-root .auth-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-root .auth-brand-link {
  text-decoration: none;
  color: inherit;
}

.auth-root .brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 14px 35px rgba(255, 106, 61, 0.25);
}

.auth-root .brand-icon {
  width: 22px;
  height: 22px;
  color: #fff;
}

.auth-root .brand-name {
  font-size: 1.05rem;
  font-weight: 600;
}

.auth-root .brand-sub {
  font-size: 0.85rem;
  color: #64748b;
}

.auth-root .auth-title {
  font-family: "Unbounded", "Noto Serif SC", serif;
  font-size: clamp(2.1rem, 1.6rem + 1.2vw, 3rem);
  letter-spacing: -0.02em;
}

.auth-root .auth-subtitle {
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
}

.auth-root .auth-highlights {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.auth-root .highlight-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 16px 35px rgba(15, 23, 42, 0.08);
}

.auth-root .highlight-title {
  font-weight: 600;
  color: #0f172a;
}

.auth-root .highlight-desc {
  margin-top: 6px;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
}

.auth-root .auth-footnote {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #475569;
}

.auth-root .auth-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
}

.auth-root .auth-panel {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 26px;
  padding: 28px 24px;
  box-shadow: 0 22px 45px rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(10px);
}

.auth-root .auth-panel-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-root .auth-panel-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-root .panel-pill {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 106, 61, 0.12);
  color: #c2410c;
  font-weight: 600;
  font-size: 0.75rem;
}

.auth-root .panel-title {
  font-family: "Unbounded", "Noto Serif SC", serif;
  font-size: 1.5rem;
  letter-spacing: -0.01em;
}

.auth-root .panel-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
}

.auth-root .auth-form {
  margin-top: 12px;
}

.auth-root .auth-form [data-slot="card"] {
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: none;
  background: rgba(255, 255, 255, 0.65);
}

.auth-root .auth-form [data-slot="card-title"] {
  font-family: "Unbounded", "Noto Serif SC", serif;
  font-size: 1.25rem;
  letter-spacing: -0.01em;
}

.auth-root .auth-form [data-slot="card-description"] {
  color: #64748b;
}

.auth-root .auth-form [data-slot="field-label"] {
  color: #0f172a;
  font-weight: 600;
}

.auth-root .auth-form [data-slot="input"] {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(148, 163, 184, 0.4);
}

.auth-root .auth-form [data-slot="input"]:focus-visible {
  border-color: rgba(255, 154, 96, 0.9);
  box-shadow: 0 0 0 3px rgba(255, 154, 96, 0.18);
}

.auth-root .auth-form [data-slot="button"].bg-primary {
  border: none;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: #fff;
  box-shadow: 0 18px 40px rgba(255, 106, 61, 0.3);
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
}

.auth-root .auth-form [data-slot="button"].bg-primary:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.auth-root .auth-form a {
  color: #c2410c;
  font-weight: 600;
}

.auth-root .auth-form a:hover {
  color: #ea580c;
}

.auth-panel-fade-enter-active,
.auth-panel-fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.auth-panel-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.auth-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 960px) {
  .auth-root .auth-container {
    grid-template-columns: 1fr;
  }

  .auth-root .auth-panel {
    order: 1;
  }

  .auth-root .auth-hero {
    order: 2;
    text-align: center;
  }

  .auth-root .auth-brand {
    justify-content: center;
  }

  .auth-root .auth-highlights {
    grid-template-columns: 1fr;
  }

  .auth-root .auth-footnote {
    justify-content: center;
  }
}
</style>
