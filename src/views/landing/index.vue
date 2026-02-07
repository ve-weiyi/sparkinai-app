<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ref, onUnmounted } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import {
  BadgeCheck,
  Clock,
  Cpu,
  Image,
  LayoutGrid,
  Layers,
  Palette,
  Rocket,
  Scan,
  Shield,
  Sparkles,
  TrendingUp,
  Wand2,
  Zap,
} from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();

const handleGetStarted = () => {
  router.push("/login");
};

const copyInput = ref("");
const generatedCopy = ref("输入产品名，即刻生成可直接发布的短文案。");
const isGeneratingCopy = ref(false);
const copyError = ref("");
const imageError = ref("");
const imagePreviewUrl = ref("");
const imageBase64 = ref("");
const imageInputRef = ref<HTMLInputElement | null>(null);

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

const COPY_PREVIEW_SYSTEM_PROMPT = `# Role: 电商内容创作助手
你是一个擅长短文案的电商内容创作助手，面向中国电商与社媒平台用户。

## 任务
根据用户提供的“产品名称”，生成 1 条可直接发布的短文案（不超过 60 字）。

## 要求
- 输出为中文，口吻自然、有行动号召
- 不夸大、不使用虚假承诺
- 尽量突出产品使用场景或核心卖点
- 只输出文案正文，不要加标题、编号或引号
`;

const triggerImageInput = () => {
  imageInputRef.value?.click();
};

const clearImage = () => {
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }
  imagePreviewUrl.value = "";
  imageBase64.value = "";
  imageError.value = "";
  if (imageInputRef.value) {
    imageInputRef.value.value = "";
  }
};

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    imageError.value = "请上传图片格式文件";
    return;
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    imageError.value = "图片大小需小于 5MB";
    return;
  }
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }
  imageError.value = "";
  imagePreviewUrl.value = URL.createObjectURL(file);
  const reader = new FileReader();
  reader.onload = () => {
    imageBase64.value = String(reader.result || "");
  };
  reader.readAsDataURL(file);
};

const generateCopyPreview = async () => {
  if (isGeneratingCopy.value) return;
  isGeneratingCopy.value = true;
  copyError.value = "";
  try {
    const productName = copyInput.value.trim() || "这款产品";
    const userContent = imageBase64.value
      ? [
          { type: "text", text: `产品名称：${productName}` },
          { type: "image_url", image_url: { url: imageBase64.value } },
        ]
      : `产品名称：${productName}`;
    const response = await fetch("/api/v1/chat/completions", {
      method: "POST",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "copy-preview",
        messages: [
          {
            role: "system",
            content: COPY_PREVIEW_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userContent,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "生成失败");
    }
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("返回内容为空");
    }
    generatedCopy.value = content;
  } catch (error) {
    console.error("生成文案失败:", error);
    copyError.value = "生成失败，请稍后重试";
  } finally {
    isGeneratingCopy.value = false;
  }
};

onUnmounted(() => {
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }
});

const platforms = ["小红书", "抖音", "快手", "淘宝", "天猫", "亚马逊", "独立站"];

const metrics = [
  { value: "100K+", label: "创作者使用" },
  { value: "1M+", label: "内容生成" },
  { value: "99.9%", label: "稳定性" },
  { value: "4.9/5", label: "口碑评分" },
];

const capabilities = [
  {
    icon: Wand2,
    title: "视觉智能",
    description: "理解产品材质与细节，自动生成主图、场景图、细节图。",
    accent: "from-[#ff8a5b] to-[#ffb07a]",
  },
  {
    icon: Cpu,
    title: "多模型协同",
    description: "文案、构图与风格联动，输出更一致、更可用的素材。",
    accent: "from-[#2dd4bf] to-[#38bdf8]",
  },
  {
    icon: Palette,
    title: "风格控制",
    description: "极简、实拍、潮流、节日主题一键切换，适配多渠道。",
    accent: "from-[#ffd166] to-[#ff8a5b]",
  },
  {
    icon: Scan,
    title: "高保真还原",
    description: "细节还原真实材质与光影，让 AI 图看起来像实拍。",
    accent: "from-[#60a5fa] to-[#2dd4bf]",
  },
  {
    icon: TrendingUp,
    title: "转化提升",
    description: "优化视觉结构与文案节奏，提高点击率与停留时长。",
    accent: "from-[#fb7185] to-[#fdba74]",
  },
  {
    icon: Shield,
    title: "企业级安全",
    description: "安全隔离与权限体系，保障企业素材与数据安全。",
    accent: "from-[#94a3b8] to-[#cbd5f5]",
  },
];

const workflow = [
  { number: "01", title: "上传图片", desc: "上传白底图或场景图，标注主图" },
  { number: "02", title: "智能理解", desc: "AI 分析卖点、材质与人群画像" },
  { number: "03", title: "生成内容", desc: "输出多风格图文，支持一键套图" },
  { number: "04", title: "发布增长", desc: "下载即用，适配多平台规范" },
];

const useCases = [
  {
    title: "新品冷启动",
    description: "上新 24 小时内生成完整素材包，快速投放验证。",
    tag: "电商运营",
    icon: Rocket,
  },
  {
    title: "活动主图",
    description: "节日、上新、清仓活动主题图一键切换风格。",
    tag: "营销设计",
    icon: LayoutGrid,
  },
  {
    title: "详情页叙事",
    description: "批量生成细节图与场景图，强化产品故事。",
    tag: "商品详情",
    icon: Image,
  },
  {
    title: "多平台分发",
    description: "自动裁切比例与文案语气，适配不同平台规则。",
    tag: "内容矩阵",
    icon: Layers,
  },
];

const trustPoints = [
  { icon: BadgeCheck, text: "行业标准流程，开箱即用" },
  { icon: Clock, text: "平均 90 秒内生成全套素材" },
  { icon: Zap, text: "比传统设计效率提升 8 倍" },
];

const comparisonRows = [
  { label: "出图速度", traditional: "2-3 天", ai: "90 秒" },
  { label: "跨平台适配", traditional: "手动裁切", ai: "自动输出多规格" },
  { label: "风格一致性", traditional: "依赖个人经验", ai: "策略模板统一" },
  { label: "成本控制", traditional: "人力占比高", ai: "降低 60%+ 成本" },
];

const faqs = [
  {
    question: "需要准备哪些素材？",
    answer:
      "准备白底图或场景图即可，系统会自动识别主图，并生成完整的图片与文案包。",
  },
  {
    question: "生成的图片能直接商用吗？",
    answer: "支持商用授权，平台提供企业级内容合规模板与审核流程。",
  },
  {
    question: "是否支持自定义风格？",
    answer: "可选择预设风格，也可输入描述自定义，AI 会保持风格一致性。",
  },
  {
    question: "是否支持团队协作？",
    answer: "支持多人协同、权限分级与素材库管理，适合团队共用。",
  },
];
</script>

<template>
  <div class="landing-root min-h-screen">
    <header class="landing-header">
      <div class="mx-auto flex items-center justify-between px-6 py-4 max-w-7xl">
        <div class="flex items-center gap-3">
          <div class="brand-mark">
            <Sparkles class="w-4 h-4 text-white" />
          </div>
          <div>
            <p class="text-lg font-semibold">内容生产平台</p>
            <p class="text-xs text-muted-foreground">AI Content Studio</p>
          </div>
        </div>
        <nav class="hidden md:flex items-center gap-6 text-sm">
          <button class="nav-link" @click="router.push('/pricing')">定价</button>
          <button class="nav-link" @click="router.push('/login')">登录</button>
          <Button class="cta-primary" @click="handleGetStarted">立即开始</Button>
        </nav>
        <Button class="md:hidden cta-primary" @click="handleGetStarted">开始</Button>
      </div>
    </header>

    <main>
      <section class="hero-section">
        <div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="space-y-8 hero-content">
            <div class="hero-pill">
              <Sparkles class="w-4 h-4" />
              AI 驱动的视觉营销生产线
            </div>
            <h1 class="landing-heading text-5xl md:text-6xl">
              让每一件商品都拥有
              <span class="text-gradient">多平台爆款素材</span>
            </h1>
            <p class="text-lg text-muted-foreground leading-relaxed max-w-xl">
              从白底图到场景图，从卖点提炼到文案生成。SparkInAI 让内容生产
              变成一条可复制的流水线，帮助团队更快上线、持续增长。
            </p>
            <div class="flex flex-wrap gap-4">
              <Button size="lg" class="cta-primary" @click="handleGetStarted">
                免费开始体验 →
              </Button>
              <Button
                size="lg"
                variant="outline"
                class="cta-secondary"
                @click="router.push('/pricing')"
              >
                查看定价
              </Button>
            </div>
            <div class="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              <div
                v-for="(item, index) in metrics"
                :key="item.label"
                class="stat-card"
                :style="{ '--i': index }"
              >
                <p class="stat-value">{{ item.value }}</p>
                <p class="stat-label">{{ item.label }}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-3 pt-2">
              <span v-for="point in trustPoints" :key="point.text" class="trust-chip">
                <component :is="point.icon" class="w-4 h-4" />
                {{ point.text }}
              </span>
            </div>
          </div>
          <div class="hero-preview">
            <div class="preview-card">
              <div class="preview-header">
                <div class="flex items-center gap-2">
                  <span class="dot dot-red" />
                  <span class="dot dot-yellow" />
                  <span class="dot dot-green" />
                </div>
                <span class="text-xs text-muted-foreground">AI 生成控制台</span>
              </div>
              <div class="preview-body">
                <div class="preview-panel">
                  <div class="panel-title">风格预设</div>
                  <div class="panel-row">
                    <span class="panel-chip">极简留白</span>
                    <span class="panel-chip">实拍质感</span>
                    <span class="panel-chip">节日主题</span>
                  </div>
                  <div class="panel-title">输出清单</div>
                  <ul class="panel-list">
                    <li>主图 + 3 张场景图</li>
                    <li>卖点文案 4 组</li>
                    <li>多平台规格包</li>
                  </ul>
                </div>
                <div class="copy-card">
                  <div class="panel-title">文案生成</div>
                  <div class="copy-panel">
                    <div class="upload-box" @click="triggerImageInput">
                      <input
                        ref="imageInputRef"
                        type="file"
                        class="hidden"
                        accept="image/*"
                        @change="handleImageChange"
                      />
                      <div v-if="imagePreviewUrl" class="upload-preview">
                        <img :src="imagePreviewUrl" alt="产品预览" />
                        <button class="upload-remove" @click.stop="clearImage">×</button>
                      </div>
                      <div v-else class="upload-placeholder">
                        <span>上传产品图</span>
                        <small>支持 jpg/png/webp</small>
                      </div>
                    </div>
                    <input
                      v-model="copyInput"
                      class="copy-input"
                      placeholder="输入产品名，例如：轻奢保温杯"
                    />
                    <Button
                      size="sm"
                      class="copy-button"
                      :disabled="isGeneratingCopy"
                      @click="generateCopyPreview"
                    >
                      {{ isGeneratingCopy ? "生成中..." : "生成一句" }}
                    </Button>
                    <div class="copy-output">
                      {{ generatedCopy }}
                    </div>
                    <p v-if="imageError" class="copy-error">{{ imageError }}</p>
                    <p v-if="copyError" class="copy-error">{{ copyError }}</p>
                  </div>
                </div>
                <div class="preview-canvas">
                  <div class="preview-label">主图生成</div>
                  <div class="preview-image" />
                </div>
              </div>
            </div>
            <div class="floating-badge">
              <Zap class="w-4 h-4" />
              平均 90 秒出图
            </div>
          </div>
        </div>
      </section>

      <section class="platform-section">
        <div class="mx-auto flex flex-col gap-6 max-w-6xl px-6 py-10">
          <p class="text-sm uppercase tracking-[0.4em] text-muted-foreground">适配平台</p>
          <div class="flex flex-wrap gap-3">
            <span v-for="platform in platforms" :key="platform" class="platform-chip">
              {{ platform }}
            </span>
          </div>
        </div>
      </section>

      <section class="capability-section">
        <div class="mx-auto max-w-7xl px-6 py-16">
          <div class="section-title">
            <h2 class="landing-heading text-4xl">强大能力，构建内容生产壁垒</h2>
            <p class="text-muted-foreground">每一步都可控，让内容稳定、高质量输出。</p>
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card
              v-for="item in capabilities"
              :key="item.title"
              class="capability-card"
            >
              <CardContent class="p-6 space-y-4">
                <div class="icon-badge bg-gradient-to-br" :class="item.accent">
                  <component :is="item.icon" class="w-5 h-5" />
                </div>
                <h3 class="text-xl font-semibold">{{ item.title }}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  {{ item.description }}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section class="workflow-section">
        <div class="mx-auto max-w-6xl px-6 py-16">
          <div class="section-title">
            <h2 class="landing-heading text-4xl">四步跑通内容生产</h2>
            <p class="text-muted-foreground">AI 全流程接管，让团队专注策略和创意。</p>
          </div>
          <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div v-for="(step, index) in workflow" :key="step.number" class="step-card">
              <div class="step-number">{{ step.number }}</div>
              <h3 class="text-lg font-semibold">{{ step.title }}</h3>
              <p class="text-sm text-muted-foreground">{{ step.desc }}</p>
              <div v-if="index < workflow.length - 1" class="step-line" />
            </div>
          </div>
        </div>
      </section>

      <section class="comparison-section">
        <div class="mx-auto max-w-6xl px-6 py-16">
          <div class="section-title">
            <h2 class="landing-heading text-4xl">传统制作 VS SparkInAI</h2>
            <p class="text-muted-foreground">把流程数字化，效率与一致性同步提升。</p>
          </div>
          <div class="comparison-grid">
            <div class="comparison-card comparison-legacy">
              <p class="text-xs uppercase tracking-widest text-muted-foreground">传统方式</p>
              <h3 class="text-2xl font-semibold mt-3">依赖人力与沟通</h3>
              <ul class="comparison-list">
                <li>多个角色协作，流程冗长</li>
                <li>视觉风格不稳定</li>
                <li>大量返工导致成本上升</li>
              </ul>
            </div>
            <div class="comparison-card comparison-ai">
              <p class="text-xs uppercase tracking-widest text-white/80">SparkInAI</p>
              <h3 class="text-2xl font-semibold mt-3 text-white">AI 流水线提效</h3>
              <ul class="comparison-list text-white/90">
                <li>统一风格模版，批量输出</li>
                <li>自动适配多平台规格</li>
                <li>关键节点可控可审</li>
              </ul>
            </div>
          </div>
          <div class="comparison-table">
            <div class="comparison-row comparison-header">
              <span>维度</span>
              <span>传统方式</span>
              <span>使用 SparkInAI</span>
            </div>
            <div v-for="row in comparisonRows" :key="row.label" class="comparison-row">
              <span class="comparison-label">{{ row.label }}</span>
              <span>{{ row.traditional }}</span>
              <span class="comparison-highlight">{{ row.ai }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="usecase-section">
        <div class="mx-auto max-w-7xl px-6 py-16">
          <div class="section-title">
            <h2 class="landing-heading text-4xl">让每个团队都能用好 AI</h2>
            <p class="text-muted-foreground">从运营到设计，用一套流程满足不同场景。</p>
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div v-for="item in useCases" :key="item.title" class="usecase-card">
              <div class="usecase-icon">
                <component :is="item.icon" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs uppercase tracking-widest text-muted-foreground">
                  {{ item.tag }}
                </p>
                <h3 class="text-xl font-semibold mt-2">{{ item.title }}</h3>
                <p class="text-sm text-muted-foreground mt-2">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="faq-section">
        <div class="mx-auto max-w-5xl px-6 py-16">
          <div class="section-title">
            <h2 class="landing-heading text-4xl">常见问题</h2>
            <p class="text-muted-foreground">快速了解上手与使用方式。</p>
          </div>
          <div class="faq-grid">
            <details v-for="item in faqs" :key="item.question" class="faq-item">
              <summary>{{ item.question }}</summary>
              <p>{{ item.answer }}</p>
            </details>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="mx-auto max-w-5xl px-6 py-16">
          <div class="cta-card">
            <div class="space-y-4">
              <h2 class="landing-heading text-4xl text-white">准备好让内容生产提速了吗？</h2>
              <p class="text-white/80">加入数万内容团队，释放 AI 的商业价值。</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" class="cta-primary" @click="handleGetStarted">
                免费开始使用
              </Button>
              <Button
                size="lg"
                variant="outline"
                class="cta-secondary text-white border-white/80 bg-white/15 hover:bg-white/25"
                @click="router.push('/pricing')"
              >
                了解更多
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="landing-footer">
      <div class="mx-auto max-w-7xl px-6 py-10">
        <div class="grid gap-8 md:grid-cols-4">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="brand-mark">
                <Sparkles class="w-4 h-4 text-white" />
              </div>
              <span class="text-lg font-semibold text-white">内容生产平台</span>
            </div>
            <p class="text-sm text-gray-400">AI 驱动的智能内容创作平台</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">产品</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>图片生成</li>
              <li>文案生成</li>
              <li>多平台分发</li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">支持</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>帮助中心</li>
              <li>服务条款</li>
              <li>客户支持</li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">关于</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>关于我们</li>
              <li>隐私政策</li>
              <li>安全合规</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-white/10 mt-10 pt-6 text-center text-xs text-gray-500">
          © 2024 内容生产平台. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap");

.landing-root {
  --accent-1: #ff6a3d;
  --accent-2: #ffb07a;
  --accent-3: #2dd4bf;
  background: radial-gradient(circle at top left, #fff5ec 0%, #ffffff 45%, #fef6e8 100%);
  color: #111827;
  font-family: "Space Grotesk", "Noto Sans SC", sans-serif;
  position: relative;
  overflow: hidden;
}

.landing-root::before {
  content: "";
  position: absolute;
  width: 560px;
  height: 560px;
  top: -180px;
  right: -140px;
  background: radial-gradient(circle, rgba(255, 154, 96, 0.3), transparent 70%);
  z-index: 0;
  filter: blur(10px);
}

.landing-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(255, 106, 61, 0.25);
}

.nav-link {
  color: #0f172a;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--accent-1);
}

.hero-section {
  position: relative;
  z-index: 1;
}

.hero-content {
  animation: fadeUp 0.8s ease both;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 154, 96, 0.4);
  color: #c2410c;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(255, 106, 61, 0.12);
}

.landing-heading {
  font-family: "Unbounded", "Noto Serif SC", serif;
  letter-spacing: -0.02em;
}

.text-gradient {
  display: inline-block;
  background: linear-gradient(90deg, var(--accent-1), var(--accent-2), #f59e0b);
  -webkit-background-clip: text;
  color: transparent;
}

.cta-primary {
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: #fff;
  border: none;
  box-shadow: 0 18px 40px rgba(255, 106, 61, 0.3);
}

.cta-secondary {
  border-color: rgba(15, 23, 42, 0.2);
}

.stat-card {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.06);
  opacity: 0;
  transform: translateY(16px);
  animation: fadeUp 0.6s ease forwards;
  animation-delay: calc(var(--i) * 0.08s);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
}

.trust-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: #fff;
  font-size: 0.75rem;
  color: #475569;
}

.hero-preview {
  position: relative;
  margin-top: -16px;
}

.preview-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.12);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
}

.dot-red {
  background: #f87171;
}

.dot-yellow {
  background: #facc15;
}

.dot-green {
  background: #4ade80;
}

.preview-body {
  display: grid;
  gap: 16px;
}

.copy-card {
  background: #0f172a;
  border-radius: 14px;
  padding: 16px;
  color: #fff;
  display: grid;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.preview-canvas {
  border-radius: 16px;
  padding: 16px;
  background: linear-gradient(160deg, #fff, #fff7ed);
  border: 1px dashed rgba(255, 154, 96, 0.4);
}

.preview-label {
  font-size: 0.75rem;
  color: #c2410c;
  margin-bottom: 10px;
}

.preview-image {
  height: 160px;
  border-radius: 12px;
  background: repeating-linear-gradient(
      45deg,
      rgba(255, 184, 128, 0.15),
      rgba(255, 184, 128, 0.15) 12px,
      rgba(255, 255, 255, 0.2) 12px,
      rgba(255, 255, 255, 0.2) 24px
    ),
    linear-gradient(135deg, #fff, #ffe8d6);
}

.preview-panel {
  background: #0f172a;
  border-radius: 14px;
  padding: 16px;
  color: #fff;
  display: grid;
  gap: 12px;
}

.panel-title {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.panel-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.panel-chip {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 0.75rem;
}

.panel-list {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  display: grid;
  gap: 6px;
}

.copy-panel {
  display: grid;
  gap: 10px;
}

.upload-box {
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: border 0.2s ease, background 0.2s ease;
}

.upload-box:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.08);
}

.upload-placeholder {
  display: grid;
  gap: 4px;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.7);
}

.upload-placeholder small {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

.upload-preview {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  height: 120px;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: none;
  background: rgba(15, 23, 42, 0.7);
  color: #fff;
  cursor: pointer;
}

.copy-input {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 0.8rem;
  color: #fff;
}

.copy-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.copy-button {
  justify-self: start;
  padding: 6px 14px;
  font-size: 0.75rem;
  background: linear-gradient(135deg, #ff8a5b, #ffd166);
  color: #1f2937;
}

.copy-output {
  font-size: 0.78rem;
  line-height: 1.5;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
}

.copy-error {
  font-size: 0.72rem;
  color: #fecaca;
}

.floating-badge {
  position: absolute;
  right: -12px;
  top: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  font-size: 0.8rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.25);
  animation: float 3.8s ease-in-out infinite;
}

.platform-section {
  border-top: 1px solid rgba(148, 163, 184, 0.15);
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  background: rgba(255, 255, 255, 0.6);
}

.platform-chip {
  padding: 8px 16px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 0.85rem;
  color: #1e293b;
}

.section-title {
  display: grid;
  gap: 8px;
  margin-bottom: 32px;
}

.capability-card {
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.capability-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.1);
}

.icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
}

.workflow-section {
  background: linear-gradient(180deg, #fff, #fff5ec);
}

.comparison-section {
  background: #fff;
}

.comparison-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  margin-bottom: 32px;
}

.comparison-card {
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: #fff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
}

.comparison-card.comparison-ai {
  background: linear-gradient(135deg, #0f172a, #1f2937);
  border: none;
}

.comparison-card.comparison-ai .comparison-list {
  color: rgba(255, 255, 255, 0.85);
}

.comparison-list {
  margin-top: 16px;
  display: grid;
  gap: 8px;
  font-size: 0.9rem;
  color: #475569;
}

.comparison-table {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.comparison-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 12px;
  padding: 14px 18px;
  background: #fff;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  font-size: 0.9rem;
}

.comparison-row:last-child {
  border-bottom: none;
}

.comparison-header {
  background: rgba(15, 23, 42, 0.03);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #64748b;
}

.comparison-label {
  font-weight: 600;
  color: #0f172a;
}

.comparison-highlight {
  color: #ea580c;
  font-weight: 600;
}

.step-card {
  position: relative;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 12px;
}

.step-line {
  display: none;
}

@media (min-width: 768px) {
  .step-line {
    display: block;
    position: absolute;
    top: 26px;
    right: -20px;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
  }
}

.usecase-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  padding: 20px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 20px 36px rgba(15, 23, 42, 0.05);
}

.faq-section {
  background: #f8fafc;
}

.faq-grid {
  display: grid;
  gap: 16px;
}

.faq-item {
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: #fff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.faq-item summary {
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item p {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #64748b;
}

.usecase-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(45, 212, 191, 0.15);
  color: #0f766e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cta-section {
  background: radial-gradient(circle at center, #1f2937, #0f172a);
}

.cta-card {
  border-radius: 24px;
  padding: 32px;
  background: linear-gradient(120deg, rgba(255, 106, 61, 0.9), rgba(255, 184, 128, 0.9));
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 25px 60px rgba(255, 106, 61, 0.3);
}

.landing-footer {
  background: #0f172a;
  color: #94a3b8;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-content,
  .stat-card,
  .floating-badge {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
