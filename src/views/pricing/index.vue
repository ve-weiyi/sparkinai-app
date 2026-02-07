<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Sparkles } from "lucide-vue-next";

const router = useRouter();

const currency = ref<"CNY" | "USD">("CNY");
const selectedPlan = ref<string | null>("专业版");

const handlePurchase = (plan: any) => {
  if (plan.priceCNY === 0) {
    router.push("/app/dashboard");
  } else {
    router.push({
      path: "/payment/checkout",
      query: {
        plan: plan.name,
        price: currency.value === "CNY" ? plan.priceCNY : plan.priceUSD,
      },
    });
  }
};

const basePlans = [
  {
    name: "免费版",
    priceCNY: 0,
    priceUSD: 0,
    description: "适合试用 SparkInAI",
    features: [
      "6 个积分",
      "最多生成/复刻 3 个视频",
      "标准质量渲染",
      "无法创建角色",
      "免费试用视频分析 3 次/天",
      "视频公开可见",
      "视频可在几天内查看和下载",
      "邮件客服支持",
    ],
    buttonText: "免费开始",
    buttonVariant: "outline" as const,
  },
  {
    name: "专业版",
    priceCNY: 249,
    priceUSD: 35,
    originalPriceCNY: 599,
    originalPriceUSD: 85,
    badge: "最受欢迎",
    highlight: false,
    description: "适合专业团队和工作室",
    features: [
      "每月 1000 个积分",
      "最多生成/复刻 500 个视频",
      "25 秒/高质量渲染",
      "不限制创建角色，锁定人物一致性",
      "生成无水印视频",
      "无限量分析视频，限时免费",
      "视频仅自己可见",
      "视频可在三个月内查看和下载",
      "优先混染队列",
      "优先客服支持",
    ],
    buttonText: "立即开始",
    buttonVariant: "outline" as const,
  },
  {
    name: "基础版",
    priceCNY: 49,
    priceUSD: 7,
    originalPriceCNY: 99,
    originalPriceUSD: 14,
    badge: "早鸟优惠",
    description: "适合个人创作者",
    features: [
      "每月 110 个积分",
      "最多生成/复刻 55 个视频",
      "25 秒/高质量渲染",
      "最多创建 3 个角色，锁定人物一致性",
      "生成无水印视频",
      "无限量分析视频，限时免费",
      "视频仅自己可见",
      "视频可在一个月内查看和下载",
      "优先混染队列",
      "社群客服支持",
    ],
    buttonText: "立即开始",
    buttonVariant: "outline" as const,
  },
];

const plans = computed(() => {
  return basePlans.map((plan) => {
    const price = currency.value === "CNY" ? plan.priceCNY : plan.priceUSD;
    const originalPrice = currency.value === "CNY" ? plan.originalPriceCNY : plan.originalPriceUSD;
    const symbol = currency.value === "CNY" ? "¥" : "$";
    const discount = originalPrice ? `立省 ${symbol}${originalPrice - price}` : undefined;

    return {
      ...plan,
      price,
      originalPrice,
      symbol,
      discount,
    };
  });
});
</script>

<template>
  <div class="pricing-root">
    <header class="pricing-header">
      <div class="brand">
        <div class="brand-mark">
          <Sparkles class="brand-icon" />
        </div>
        <div>
          <p class="brand-name">内容生产平台</p>
          <p class="brand-sub">透明定价与灵活升级</p>
        </div>
      </div>
      <button type="button" class="back-button" @click="router.back()">
        <ArrowLeft class="back-icon" />
        返回
      </button>
    </header>

    <main class="pricing-main">
      <section class="pricing-hero">
        <div class="hero-copy">
          <span class="hero-pill">定价方案</span>
          <h1 class="hero-title">简单透明的定价</h1>
          <p class="hero-subtitle">选择适合你创作工作流的计划，随时升级或降级。</p>
        </div>
        <div class="hero-metrics">
          <div class="metric-card">
            <p class="metric-value">100K+</p>
            <p class="metric-label">创作者信赖</p>
          </div>
          <div class="metric-card">
            <p class="metric-value">10x</p>
            <p class="metric-label">内容效率提升</p>
          </div>
          <div class="metric-card">
            <p class="metric-value">99.9%</p>
            <p class="metric-label">稳定可用</p>
          </div>
        </div>
      </section>

      <section class="pricing-controls">
        <div class="currency-toggle">
          <button
            type="button"
            class="toggle-item"
            :class="{ active: currency === 'CNY' }"
            @click="currency = 'CNY'"
          >
            人民币 CNY
          </button>
          <button
            type="button"
            class="toggle-item"
            :class="{ active: currency === 'USD' }"
            @click="currency = 'USD'"
          >
            美元 USD
          </button>
        </div>
        <p class="pricing-note">按月计费，支持随时取消，团队方案可联系客服定制。</p>
      </section>

      <section class="pricing-grid">
        <article
          v-for="plan in plans"
          :key="plan.name"
          :class="[
            'plan-card',
            selectedPlan === plan.name ? 'is-selected' : '',
          ]"
          @click="selectedPlan = plan.name"
        >
          <div v-if="plan.badge" class="plan-badge">{{ plan.badge }}</div>
          <div class="plan-head">
            <h3 class="plan-title">{{ plan.name }}</h3>
            <p class="plan-desc">{{ plan.description }}</p>
          </div>
          <div class="plan-price">
            <span class="price-main">{{ plan.symbol }}{{ plan.price }}</span>
            <span v-if="plan.originalPrice" class="price-old">
              {{ plan.symbol }}{{ plan.originalPrice }}
            </span>
          </div>
          <div class="plan-meta">
            <p v-if="plan.discount" class="plan-discount">{{ plan.discount }}</p>
            <p v-else class="plan-discount placeholder">占位</p>
            <p v-if="plan.price > 0" class="plan-cycle">
              {{ plan.symbol }}{{ plan.originalPrice || plan.price }}/月
            </p>
            <p v-else class="plan-cycle placeholder">占位</p>
          </div>
          <Button
            :variant="plan.buttonVariant"
            class="plan-cta"
            :class="plan.buttonVariant === 'outline' ? 'plan-cta-outline' : 'plan-cta-primary'"
            @click="handlePurchase(plan)"
          >
            {{ plan.buttonText }}
          </Button>
          <div class="plan-features">
            <div v-for="feature in plan.features" :key="feature" class="feature-item">
              <Check class="feature-icon" />
              <span>{{ feature }}</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap");

.pricing-root {
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

.pricing-root::before {
  content: "";
  position: absolute;
  width: 520px;
  height: 520px;
  top: -180px;
  right: -160px;
  background: radial-gradient(circle, rgba(255, 154, 96, 0.3), transparent 70%);
  filter: blur(8px);
  z-index: 0;
}

.pricing-root::after {
  content: "";
  position: absolute;
  width: 420px;
  height: 420px;
  bottom: -200px;
  left: -140px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.22), transparent 70%);
  filter: blur(10px);
  z-index: 0;
}

.pricing-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 28px rgba(255, 106, 61, 0.25);
}

.brand-icon {
  width: 20px;
  height: 20px;
  color: #fff;
}

.brand-name {
  font-size: 1rem;
  font-weight: 600;
}

.brand-sub {
  font-size: 0.8rem;
  color: #64748b;
}

.back-button {
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
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(255, 106, 61, 0.3);
  transition: transform 0.2s ease, filter 0.2s ease;
}

.back-button:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.back-icon {
  width: 16px;
  height: 16px;
}

.pricing-main {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.pricing-hero {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.hero-copy {
  max-width: 540px;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 106, 61, 0.12);
  color: #c2410c;
  font-weight: 600;
  font-size: 0.75rem;
}

.hero-title {
  margin-top: 12px;
  font-family: "Unbounded", "Noto Serif SC", serif;
  font-size: clamp(2.2rem, 1.6rem + 1.5vw, 3rem);
  letter-spacing: -0.02em;
}

.hero-subtitle {
  margin-top: 12px;
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.metric-card {
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.metric-value {
  font-size: 1.2rem;
  font-weight: 700;
}

.metric-label {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 4px;
}

.pricing-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.currency-toggle {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.25);
  padding: 4px;
  border-radius: 999px;
  display: inline-flex;
  gap: 4px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.toggle-item {
  border: none;
  background: transparent;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-item.active {
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: #fff;
  box-shadow: 0 10px 22px rgba(255, 106, 61, 0.28);
}

.pricing-note {
  font-size: 0.85rem;
  color: #64748b;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.plan-card {
  position: relative;
  padding: 28px 24px;
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
  cursor: pointer;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 48px rgba(15, 23, 42, 0.12);
}

.plan-card.is-selected {
  border-color: rgba(255, 154, 96, 0.6);
  box-shadow: 0 30px 50px rgba(255, 154, 96, 0.18);
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 24px;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  box-shadow: 0 12px 24px rgba(255, 106, 61, 0.28);
}

.plan-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.plan-title {
  font-size: 1.3rem;
  font-weight: 700;
}

.plan-desc {
  font-size: 0.85rem;
  color: #64748b;
}

.plan-price {
  margin-top: 18px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.price-main {
  font-size: 2.4rem;
  font-weight: 700;
}

.price-old {
  font-size: 1rem;
  color: #94a3b8;
  text-decoration: line-through;
}

.plan-discount {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(45, 212, 191, 0.14);
  color: #0f766e;
  font-size: 0.75rem;
  font-weight: 600;
}

.plan-cycle {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #94a3b8;
}

.plan-meta {
  min-height: 52px;
}

.plan-discount.placeholder,
.plan-cycle.placeholder {
  visibility: hidden;
}

.plan-cta {
  width: 100%;
  margin: 20px 0 18px;
  font-weight: 600;
}

.plan-cta-primary {
  border: none;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: #fff;
  box-shadow: 0 18px 40px rgba(255, 106, 61, 0.3);
  transition: transform 0.2s ease, filter 0.2s ease;
}

.plan-cta-primary:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.plan-cta-outline {
  border: 1px solid rgba(255, 154, 96, 0.5);
  color: #c2410c;
  background: rgba(255, 255, 255, 0.9);
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  gap: 10px;
  font-size: 0.85rem;
  color: #0f172a;
}

.feature-icon {
  width: 18px;
  height: 18px;
  color: #22c55e;
  margin-top: 2px;
  flex-shrink: 0;
}

@media (max-width: 960px) {
  .pricing-header {
    padding: 16px 20px;
  }

  .hero-metrics {
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
}
</style>
