import OpenAI from "openai";

// 配置信息 - 使用后端代理，无需API Key
const CONFIG = {
  textModel: "doubao-seed-1-6-lite-251015",
  imageModel: "doubao-seedream-4-5-251128"
};

// 生成文案
export async function generateCopy(productName: string, description: string, imageUrl: string): Promise<string> {
  try {
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
            content: `你是一个小红书爆款文案专家。
请仔细观察这张产品图，结合用户卖点，写一篇极具吸引力的种草文案。
要求：标题带Emoji，正文口语化，分段清晰，结尾带标签。`
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
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error('生成文案失败:', error);
    throw error;
  }
}

// 策划生图 Prompt
export async function generateImagePrompts(copyText: string): Promise<string[]> {
  try {
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
            content: `你是一个专业的视觉导演。
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
