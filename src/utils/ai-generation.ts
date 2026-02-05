import OpenAI from "openai";

// 配置信息 - 使用后端代理，无需API Key
const CONFIG = {
  textModel: "qwen-vl-plus",
  imageModel: "doubao-seedream-4-5-251128"
};

export interface GeneratedCopy {
  title: string;
  content: string;
  tags: string;
}

// 获取提示词内容 - 简化版本，不再依赖 PromptAPI
async function getPromptContent(scene: string, platform: string = 'universal'): Promise<string> {
  // 由于 PromptAPI 已被删除，这里返回空字符串，使用默认提示词
  return '';
}

// 分析产品卖点
export async function analyzeProductSellingPoints(productName: string, imageUrl: string): Promise<string> {
  try {
    const systemPrompt = await getPromptContent('product_analysis');
    
    const response = await fetch('/api/v1/openai/chat/completions', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CONFIG.textModel,
        reasoning_effort: "medium",
        messages: [
          {
            role: "system",
            content: systemPrompt || `# Role: 电商选品分析助手

## Profile:
**Language**: 中文
**Description**: 通过产品名+图片，输出客观、结构化的文案素材分析（核心卖点/适用人群/场景/视觉特征），为文案创作提供底层支撑。

## Task:
基于产品名+图，分析以下维度：
1. 核心卖点（USP）
2. 适用人群
3. 使用场景
4. 视觉特征

## Requirements:
1. **分析原则**: 基于产品名+图的真实信息，突出差异化与痛点解决能力；
2. **输出要求**: 结构化分条，无需广告化，每个维度含细分要点；
3. **维度细化**:
   - 核心卖点：差异化优势/功能价值/痛点解决；
   - 适用人群：典型人群+核心需求；
   - 使用场景：高频/特殊/搭配场景；
   - 视觉特征：外观设计/功能细节/品牌调性。

## Output Format:
### 1. 核心卖点
- 差异化：XXX
- 功能价值：XXX
- 痛点解决：XXX

### 2. 适用人群
- 人群1：XXX（需求/痛点）
- 人群2：XXX（需求/痛点）

### 3. 使用场景
- 场景1：XXX
- 场景2：XXX

### 4. 视觉特征
- 外观：XXX
- 细节：XXX
- 调性：XXX`
          },
          {
            role: "user",
            content: [
              { type: "text", text: `产品名称：${productName}` },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API Error');
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error('分析卖点失败:', error);
    throw error;
  }
}

// 生成文案
export async function generateCopy(productName: string, description: string, imageUrl: string, quantity: number = 1, platform: string = 'xiaohongshu'): Promise<GeneratedCopy[]> {
  try {
    const systemPrompt = await getPromptContent('copy_generation', platform);
    
    const response = await fetch('/api/v1/openai/chat/completions', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CONFIG.textModel,
        reasoning_effort: "medium",
        messages: [
          {
            role: "system",
            content: systemPrompt || `# Role: 小红书爆款文案策略师

## Profile:
**Language**: 中文
**Description**: 我是一个内置了海量小红书爆款文案公式的创作专家，能结合您上传的图片内容（如产品展示、使用场景、效果对比等），将视觉信息转化为文案中的生动描述。我的核心任务是根据您提供的产品功能与卖点+指定风格，生成符合该风格、具有高吸引力的"种草"笔记。

## Constraints:
- 产出的文案必须严格遵守小红书社区规范，避免使用硬广词汇和夸大宣传的描述。
- 禁止生成与产品信息无关的、空洞无物的内容。所有文案都必须紧密围绕产品卖点、用户痛点及图片视觉元素展开。
- 创作的文案必须是原创的，不能直接复制或拼接现有网络内容。
- 输出的文案格式需完全符合小红书笔记的发布标准，包括标题、正文（含emoji表情）、以及标签（Hashtags）。
- 需严格按照用户指定的风格（如闺蜜分享风、专业测评风、场景痛点风、教程干货风等）生成对应的文案版本，确保风格匹配度100%。

## Background:
我是一位虚拟的、在小红书平台身经百战的顶级内容创作者和品牌营销顾问。我的"大脑"中预装了数百种经过验证的爆款笔记框架，且能精准适配不同风格需求。我深谙如何通过文字+视觉元素的结合，激发用户的购买欲和分享欲，将任何产品卖点转化为符合指定风格的、引人入胜的内容。

## Goals:
- **精准策略匹配**: 根据产品特性+图片视觉元素+用户指定风格，从内置的爆款公式库中自动匹配最合适的文案创作角度。
- **高效文案生成**: 根据用户选择的特定风格，快速为用户指定的产品创作出 ${quantity} 个符合该风格的、可直接发布的小红书文案版本。
- **提升内容表现**: 帮助用户通过符合风格的高质量文案内容，提升笔记的点击率、互动率，并最终促进产品转化。

## Skills List:
- **内置爆款公式库**: 掌握并能灵活运用多种爆款笔记结构，适配不同风格需求。
- **用户心理洞察**: 精通目标用户的心理，能根据指定风格调整语气（如闺蜜风的亲切、测评风的专业）。
- **创意文案写作**: 擅长使用网感词汇、emoji表情，将产品功能转化为符合指定风格的用户利益描述。
- **结构化思维**: 能将零散信息（文字+图片）按指定风格的逻辑框架组织呈现。
- **标签（Hashtag）策略**: 能精准选择符合风格和内容的标签，获取自然流量。
- **图片内容分析能力**: 能提取图片中的关键视觉元素，融入符合指定风格的文案中。

## Workflow:
1. **接收需求与图片分析**: 分析用户提供的产品文字信息（名称、核心卖点、目标用户等）、指定文案风格，及上传的相关图片（提取视觉元素）。
2. **策略分析与匹配**: 结合文字信息、图片元素、指定风格，从爆款公式库中匹配最合适的文案框架。
3. **风格化创作**: 基于匹配的框架和用户指定的风格，创作 ${quantity} 个符合该风格的完整笔记文案，融入图片关键细节。
4. **格式化输出**: 将文案以标准格式输出。

## 输出要求:
- 每篇文案风格略有不同（例如：闺蜜分享风、专业测评风、场景痛点风、教程干货风）。
- 标题带Emoji，正文口语化，分段清晰，结尾带标签。
- 返回格式必须为纯 JSON 数组，不包含 markdown 标记，格式如下：
[
  {
    "title": "标题",
    "content": "正文内容",
    "tags": "#标签1 #标签2"
  }
]`
          },
          {
            role: "user",
            content: [
              { type: "text", text: `产品：${productName}\n卖点：${description}` },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API Error');

    const content = data.choices?.[0]?.message?.content || "[]";
    // 清理 markdown 标记
    const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("文案解析失败:", e);
      // 降级处理：如果解析失败，尝试直接作为单篇文案返回
      return [{
        title: "产品文案",
        content: content,
        tags: "#推荐 #好物"
      }];
    }
  } catch (error) {
    console.error('生成文案失败:', error);
    throw error;
  }
}

// 策划生图 Prompt
export async function generateImagePrompts(copyText: string): Promise<string[]> {
  try {
    const systemPrompt = await getPromptContent('image_prompt_generation');
    
    const response = await fetch('/api/v1/openai/chat/completions', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CONFIG.textModel,
        messages: [
          {
            role: "system",
            content: systemPrompt || `你是一个专业的视觉导演。
请根据刚刚生成的小红书文案，策划 4 个不同的摄影场景，用于生成配图。
要求：
1. 每个场景必须基于文案中提到的使用场景或氛围。
2. 必须包含"产品主体"。
3. 输出为英文提示词 (Stable Diffusion 格式)。
4. 返回格式：纯 JSON 数组，例如 ["prompt1", "prompt2", "prompt3", "prompt4"]，不要任何 Markdown 标记。`
          },
          { role: "user", content: `文案内容：\n${copyText}` }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API Error');

    let prompts: string[] = [];
    try {
      let planContent = data.choices?.[0]?.message?.content || "[]";
      planContent = planContent.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(planContent);
      prompts = parsed.prompts || parsed.scenes || parsed.data || parsed || [];
      if (!Array.isArray(prompts)) prompts = [];
    } catch (e) {
      console.error("Prompt 策划解析失败，使用默认 Prompt");
    }

    // 兜底默认 Prompt
    const defaultPrompts = [
      "clean background, studio lighting, high quality, 4k",
      "lifestyle scene, cozy atmosphere, soft light",
      "minimalist composition, pastel colors",
      "outdoor nature background, sunlight"
    ];
    while (prompts.length < 4) {
      prompts.push(defaultPrompts[prompts.length]);
    }
    prompts = prompts.slice(0, 4);

    return prompts;
  } catch (error) {
    console.error('生成图片提示词失败:', error);
    // 返回默认提示词
    return [
      "clean background, studio lighting, high quality, 4k",
      "lifestyle scene, cozy atmosphere, soft light",
      "minimalist composition, pastel colors",
      "outdoor nature background, sunlight"
    ];
  }
}

// 生成单张图片
export async function generateSingleImage(
  prompt: string,
  productName: string,
  imageBase64: string,
  style: string = '极简留白',
  resolution: string = '2K ✨ 2',
  ratio: string = '1:1'
): Promise<string | null> {
  try {
    // 计算尺寸
    let width = 2048;
    let height = 2048;

    // 根据分辨率设定基准
    let baseSize = 2048;
    if (resolution === '4K') baseSize = 4096;
    if (resolution === 'HD') baseSize = 1024;

    // 根据比例调整
    switch (ratio) {
      case '1:1':
        width = baseSize;
        height = baseSize;
        break;
      case '3:4':
        width = Math.round(baseSize * 0.75);
        height = baseSize;
        break;
      case '4:3':
        width = baseSize;
        height = Math.round(baseSize * 0.75);
        break;
      case '9:16':
        width = Math.round(baseSize * 0.5625);
        height = baseSize;
        break;
      case '16:9':
        width = baseSize;
        height = Math.round(baseSize * 0.5625);
        break;
      default: // 1:1
        width = baseSize;
        height = baseSize;
    }

    // 确保是 64 的倍数（某些 API 的要求，保险起见）
    width = Math.round(width / 64) * 64;
    height = Math.round(height / 64) * 64;

    const size = `${width}x${height}`;

    const payload = {
      model: CONFIG.imageModel,
      prompt: `${prompt}, ${style} style, (product shot:1.2), high quality, ${resolution}, ${productName}`,
      image_base64: imageBase64,
      size: size,
      response_format: "url"
    };

    const res = await fetch(`/api/v1/openai/images/generations`, {
      method: "POST",
      credentials: 'omit',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "API Error");
    return data.data?.[0]?.url || null;
  } catch (err) {
    console.error("图片生成失败:", err);
    return null;
  }
}
