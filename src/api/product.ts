import request from "@/utils/request";


export interface AnalyzeProductSetReq {
  product_name?: string; 
}

export interface AnalyzeProductSetResp {
  product_name: string; 
  selling_points: string; 
  core_features?: string; 
  target_audience?: string; 
  expected_scenario?: string; 
  size_quantity?: number; 
}

export interface GenerateProductSetImagesReq {
  product_set_id?: number; // 关联套图ID
}

export interface GenerateProductSetImagesResp {
  images: ProductSetImageResult[]; 
}

export interface GenerateProductSetReq {
  quantity?: number; 
  platform?: string; 
  product_name?: string; 
}

export interface GenerateProductSetResp {
  id: number; 
  timestamp: string; 
  platform: string; 
  product_name: string; 
  images: ProductSetPreviewImage[]; 
  style: string; 
  resolution: string; 
  ratio: string; 
  generated_copies: ProductSetCopyItem[]; 
  image_types: ProductSetImageType[]; 
}

export interface ProductSetCopyItem {
  title: string; 
  content: string; 
  tags: string; 
}

export interface ProductSetImageResult {
  name: string; 
  url: string; 
  is_regenerating: boolean; 
}

export interface ProductSetImageType {
  name: string; 
  selected: boolean; 
  desc: string; 
}

export interface ProductSetPreviewImage {
  preview: string; 
}

export interface RegenerateProductSetImageReq {
  image_url?: string; 
}

export interface RegenerateProductSetImageResp {
  url: string; 
}


export const ProductAPI = {
  /** 图片/产品分析 */
  analyzeProductSet(data?: AnalyzeProductSetReq): Promise<IApiResponse<AnalyzeProductSetResp>> {
    return request({
      url: "/api/v1/product-set/analyze",
      method: "POST",
      data: data,
    });
  },

  /** 生成产品套图 */
  generateProductSet(data?: GenerateProductSetReq): Promise<IApiResponse<GenerateProductSetResp>> {
    return request({
      url: "/api/v1/product-set/generate",
      method: "POST",
      data: data,
    });
  },

  /** 生成套图图片 */
  generateProductSetImages(data?: GenerateProductSetImagesReq): Promise<IApiResponse<GenerateProductSetImagesResp>> {
    return request({
      url: "/api/v1/product-set/generate-images",
      method: "POST",
      data: data,
    });
  },

  /** 重新生成图片 */
  regenerateProductSetImage(data?: RegenerateProductSetImageReq): Promise<IApiResponse<RegenerateProductSetImageResp>> {
    return request({
      url: "/api/v1/product-set/regenerate-image",
      method: "POST",
      data: data,
    });
  },
};
