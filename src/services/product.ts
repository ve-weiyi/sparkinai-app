/**
 * 产品套图生成相关接口
 */
import { api } from '@/lib/api.ts'


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
  return api.post<ProductSetResponse>('/product-set/generate', {
    platform: request.platform,
    productName: request.productName,
    quantity: request.quantity,
  })
}

/**
 * 生成产品配图
 */
export async function generateProductImages(
  request: ProductImagesRequest
): Promise<ProductImagesResponse> {
  return api.post<ProductImagesResponse>('/product-set/generate-images', {
    style: request.style,
    resolution: request.resolution,
    ratio: request.ratio,
    imageTypes: request.imageTypes,
  })
}

/**
 * 重新生成单张图片
 */
export async function regenerateProductImage(
  request: RegenerateImageRequest
): Promise<RegenerateImageResponse> {
  return api.post<RegenerateImageResponse>('/product-set/regenerate-image', {
    taskId: request.taskId,
    imageIndex: request.imageIndex,
    prompt: request.prompt,
    style: request.style,
    resolution: request.resolution,
    ratio: request.ratio,
  })
}

/**
 * AI 分析产品图片（返回格式化的卖点文本）
 */
export async function analyzeProductImages(_images: File[]): Promise<{
  productName: string
  sellingPoints: string
}> {
  return api.post<{ productName: string; sellingPoints: string }>('/product-set/analyze', {})
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
      resolve(String(e.target?.result ?? ''))
    }
    reader.readAsDataURL(file)
  })
}
