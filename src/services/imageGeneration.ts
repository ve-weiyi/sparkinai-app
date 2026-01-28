/**
 * 图片生成服务
 * 提供AI图片生成和产品分析功能
 */

export interface ImageGenerationRequest {
  images: File[]
  platform: string
  market: string
  language: string
  productName?: string
  coreFeatures?: string
  targetAudience?: string
  expectedScenario?: string
  sizeQuantity?: number
  resolution?: string
  ratio?: string
  styles?: string[]
}

export interface ImageGenerationResponse {
  success: boolean
  images: string[]
  message?: string
}

export interface ProductAnalysisResponse {
  productName: string
  coreFeatures: string
  targetAudience: string
  expectedScenario: string
  sizeQuantity: number
}

/**
 * 生成AI商品图片
 */
export async function generateImages(
  request: ImageGenerationRequest
): Promise<ImageGenerationResponse> {
  // 实际项目中，这里应该调用后端API或AI服务
  // 示例：const response = await fetch('/api/images/generate', { method: 'POST', body: formData })

  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据选中的风格数量生成图片
      const count = request.styles && request.styles.length > 0 ? request.styles.length : 1
      const mockImages = Array.from({ length: count }, (_, i) => {
        // 使用placeholder图片服务
        return `https://placehold.co/600x600/e2e8f0/64748b?text=Generated+${i + 1}`
      })

      resolve({
        success: true,
        images: mockImages,
        message: '图片生成成功'
      })
    }, 3000) // 模拟3秒生成时间
  })
}

/**
 * AI分析产品信息
 */
export async function analyzeProduct(images: File[]): Promise<ProductAnalysisResponse> {
  // 实际项目中，这里应该调用AI视觉识别API
  // 示例：const response = await fetch('/api/images/analyze', { method: 'POST', body: formData })

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        productName: '智能蓝牙耳机',
        coreFeatures: '降噪、长续航、高音质、舒适佩戴',
        targetAudience: '年轻人、上班族、运动爱好者',
        expectedScenario: '通勤、运动、办公、休闲',
        sizeQuantity: 5
      })
    }, 2000) // 模拟2秒分析时间
  })
}

/**
 * 产品套图生成相关接口
 */

export interface ProductSetCopy {
  title: string
  content: string
  tags: string
}

export interface ProductSetRequest {
  images: File[]
  platform: string
  productName: string
  sellingPoints: string
  quantity: number
}

export interface ProductSetResponse {
  id: number
  timestamp: string
  platform: string
  productName: string
  images: Array<{ preview: string; note?: string }>
  style: string
  resolution: string
  ratio: string
  generatedCopies: ProductSetCopy[]
  imageTypes: Array<{
    name: string
    selected: boolean
    desc: string
  }>
}

export interface ProductImagesRequest {
  taskId: number
  style: string
  resolution: string
  ratio: string
  imageTypes: Array<{ name: string; selected: boolean }>
}

export interface ProductImagesResponse {
  images: Array<{
    name: string
    url: string
    isRegenerating?: boolean
  }>
}

export interface RegenerateImageRequest {
  taskId: number
  imageIndex: number
  prompt: string
  style: string
  resolution: string
  ratio: string
}

export interface RegenerateImageResponse {
  url: string
}

/**
 * 生成产品套图任务和文案
 */
export async function generateProductSet(
  request: ProductSetRequest
): Promise<ProductSetResponse> {
  // 实际项目中，这里应该调用后端API
  // 示例：const response = await fetch('/api/product-set/generate', { method: 'POST', body: formData })

  return new Promise((resolve) => {
    setTimeout(() => {
      const mockCopies: ProductSetCopy[] = [
        {
          title: '生日派对好物推荐🎉🎂',
          content:
            '终于找到这个生日派对好物，真的绝了！❤️ 不仅提升了整个派对的氛围，还让每个人都笑得合不拢嘴。这个产品不仅性价比高，而且使用起来超级方便，绝对是每个派对的必备元素。',
          tags: '#生日派对 #好物推荐 #性价比 #实用好物 #氛围提升 #派对装饰 #细节设计 #颜色搭配 #派对必备',
        },
        {
          title: '派对神器来了！🎊✨',
          content:
            '姐妹们！这个派对神器我必须安利给你们！用过之后整个派对档次都提升了，朋友们都在问我在哪买的。质量超好，设计也很贴心，真的是派对必备好物！',
          tags: '#派对神器 #好物分享 #质量保证 #设计感 #朋友聚会 #氛围感 #高级感 #必买清单',
        },
        {
          title: '这个派对好物绝了！🎈💕',
          content:
            '作为派对达人，这个产品我真的要强烈推荐！不仅颜值在线，实用性也超强。每次用都能收获满满的赞美，性价比真的太高了，强烈建议入手！',
          tags: '#派对达人 #颜值在线 #实用好物 #高性价比 #强烈推荐 #派对装备 #品质生活 #值得入手',
        },
        {
          title: '派对氛围组必备！🌟🎉',
          content:
            '这个宝藏产品终于被我发现了！每次派对都能用上，效果超级棒。朋友们都说有了它，派对氛围直接拉满！而且价格也很美丽，真的是物超所值！',
          tags: '#氛围组 #宝藏产品 #派对必备 #效果拔群 #物超所值 #朋友推荐 #派对利器 #氛围拉满',
        },
        {
          title: '派对好物种草！🎁💖',
          content:
            '集美们看过来！这个派对好物我用了好几次了，每次效果都超级好！质量没话说，设计也很用心，真的是派对场合的加分项。强烈种草给你们！',
          tags: '#种草分享 #派对好物 #质量优秀 #用心设计 #加分项 #强烈种草 #派对场景 #好物推荐',
        },
      ]

      const response: ProductSetResponse = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        platform: request.platform,
        productName: request.productName,
        images: request.images.map((file) => ({
          preview: URL.createObjectURL(file),
          note: undefined,
        })),
        style: '极简留白',
        resolution: '2K ✨ 2',
        ratio: '1:1',
        generatedCopies: mockCopies.slice(0, request.quantity),
        imageTypes: [
          { name: '主图', selected: true, desc: '纯白背景产品主图，展现...' },
          { name: '细节特写图', selected: true, desc: '微距镜头展示产品材质与...' },
          { name: '场景展示图', selected: true, desc: '美式现代家居场景，体现...' },
          { name: '功能解析图', selected: true, desc: '通过留白构图标注核心功...' },
          { name: '尺寸对比图', selected: true, desc: '直观展示产品尺寸参数与...' },
          { name: '人群适用图', selected: true, desc: '目标用户群体使用场景，...' },
          { name: '品牌背书图', selected: true, desc: '极简构图展示品牌Logo与...' },
        ],
      }

      resolve(response)
    }, 1500) // 模拟1.5秒生成时间
  })
}

/**
 * 生成产品配图
 */
export async function generateProductImages(
  request: ProductImagesRequest
): Promise<ProductImagesResponse> {
  // 实际项目中，这里应该调用后端API
  // 示例：const response = await fetch('/api/product-set/generate-images', { method: 'POST', body: JSON.stringify(request) })

  return new Promise((resolve) => {
    setTimeout(() => {
      const mockImageUrls = [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=600&fit=crop',
      ]

      const selectedTypes = request.imageTypes.filter((type) => type.selected)
      const images = selectedTypes.map((type, index) => ({
        name: type.name,
        url: mockImageUrls[index % mockImageUrls.length],
        isRegenerating: false,
      }))

      resolve({ images })
    }, 2000) // 模拟2秒生成时间
  })
}

/**
 * 重新生成单张图片
 */
export async function regenerateProductImage(
  request: RegenerateImageRequest
): Promise<RegenerateImageResponse> {
  // 实际项目中，这里应该调用后端API
  // 示例：const response = await fetch('/api/product-set/regenerate-image', { method: 'POST', body: JSON.stringify(request) })

  return new Promise((resolve) => {
    setTimeout(() => {
      const mockImageUrls = [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=600&fit=crop',
      ]

      const randomIndex = Math.floor(Math.random() * mockImageUrls.length)
      resolve({ url: mockImageUrls[randomIndex] })
    }, 1500) // 模拟1.5秒生成时间
  })
}

/**
 * AI 分析产品图片（返回格式化的卖点文本）
 */
export async function analyzeProductImages(images: File[]): Promise<{
  productName: string
  sellingPoints: string
}> {
  // 实际项目中，这里应该调用AI视觉识别API
  // 示例：const response = await fetch('/api/product-set/analyze', { method: 'POST', body: formData })

  return new Promise((resolve) => {
    setTimeout(() => {
      const mockProducts = [
        {
          name: '猫咪温馨小窝',
          points: `产品名：猫咪温馨小窝
核心卖点：柔软舒适、保暖透气、易清洗
适用人群：养猫家庭、宠物爱好者
期望场景：家居客厅、卧室、阳台
尺寸参数：50x40x30cm，适合5kg以下猫咪`,
        },
        {
          name: '生日派对装饰套装',
          points: `产品名：生日派对装饰套装
核心卖点：色彩丰富、易安装、可重复使用
适用人群：派对策划者、家庭聚会
期望场景：生日派对、节日庆祝、家庭聚会
尺寸参数：包含气球、拉花、蛋糕装饰等`,
        },
        {
          name: '智能蓝牙音箱',
          points: `产品名：智能蓝牙音箱
核心卖点：高音质、长续航、防水设计
适用人群：音乐爱好者、户外运动者
期望场景：家居娱乐、户外旅行、运动健身
尺寸参数：直径8cm，高度12cm，重量300g`,
        },
      ]

      const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)]
      resolve({
        productName: randomProduct.name,
        sellingPoints: randomProduct.points,
      })
    }, 1500) // 模拟1.5秒分析时间
  })
}

/**
 * 上传图片到服务器
 */
export async function uploadImage(file: File): Promise<string> {
  // 实际项目中，这里应该上传到云存储或服务器
  // 示例：const formData = new FormData()
  //       formData.append('file', file)
  //       const response = await fetch('/api/upload', { method: 'POST', body: formData })

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}
