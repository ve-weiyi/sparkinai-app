import request from "@/utils/request";


export interface CopyItem {
  title: string; // 标题
  content: string; //内容
  tags: string; // 标签列表
}

export interface DeleteGenerationReq {
  id: string; // 生成记录ID
}

export interface DeleteGenerationResp {
  success: boolean; // 是否删除成功
  message: string; // 提示信息
}

export interface GenerateProductAnalyzeReq {
  product_name?: string; 
  images?: ImageItem[]; // 产品图片列表
}

export interface GenerateProductAnalyzeResp {
  product_name: string; 
  selling_points: string; 
  core_features?: string; 
  target_audience?: string; 
  expected_scenario?: string; 
  size_quantity?: number; 
}

export interface GenerateProductCopyReq {
  product_name: string; // 产品名称
  description?: string; // 产品描述
  quantity?: number; 
  platform?: string; 
  images?: ImageItem[]; // 产品图片列表
  main_image_index?: number; 
}

export interface GenerateProductCopyResp {
  id: number; // 生成记录ID (原 GenerationId，类型调整为 int64 或保持 string)
  timestamp: string; 
  platform: string; 
  product_name: string; 
  images: ProductSetPreviewImage[]; 
  generated_copies: CopyItem[]; // 文案列表
  image_types: ProductSetImageType[]; 
  cost_tokens: number; // 消耗的token数量
}

export interface GenerateProductImagesReq {
  generation_id: number; // 生成记录ID (原 string, 现 int64)
  style?: string; 
  resolution?: string; 
  ratio?: string; 
}

export interface GenerateProductImagesResp {
  images: ProductSetImageResult[]; 
}

export interface GenerateProductSingleImageReq {
  product_name: string; // 产品名称
  image_url: string; // 产品图片URL
  note?: string; // 备注
}

export interface GenerateProductSingleImageResp {
  image_url: string; // 生成的图片URL
  cost_tokens: number; // 消耗的token数量
}

export interface GenerationItem {
  id: string; // 生成记录ID
  product_name: string; // 产品名称
  description: string; // 产品描述
  image_url: string; // 上传的产品图片URL
  copy_result: string; // 生成的文案结果（JSON）
  image_urls: string[]; // 生成的图片URL列表
  generation_type: string; // 生成类型
  status: number; // 生成状态
  error_message: string; // 错误信息
  cost_tokens: number; // 消耗的token数量
  generation_time: number; // 生成耗时（秒）
  created_at: number; // 创建时间
}

export interface GetGenerationReq {
  id: string; // 生成记录ID
}

export interface GetGenerationResp extends GenerationItem {
}

export interface GetGenerationsReq extends PageQuery {
  status?: number; // 生成状态筛选
}

export interface GetGenerationsResp {
  page: number; // 当前页码
  page_size: number; // 每页数量
  total: number; // 总记录数
  list: GenerationItem[]; // 记录列表
}

export interface ImageItem {
  file_url?: string; 
  file_name?: string; 
  note?: string; // 备注
}

export interface PageQuery {
  page?: number; 
  page_size?: number; 
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


export const GenerateAPI = {
  /** // ==================== 生成记录 ====================获取生成记录列表 */
  getGenerations(data?: GetGenerationsReq): Promise<IApiResponse<GetGenerationsResp>> {
    return request({
      url: "/api/v1/generations",
      method: "GET",
      data: data,
    });
  },

  /** 获取生成记录详情 */
  getGeneration(data?: GetGenerationReq): Promise<IApiResponse<GetGenerationResp>> {
    return request({
      url: "/api/v1/generations/:id",
      method: "GET",
      data: data,
    });
  },

  /** 删除生成记录 */
  deleteGeneration(data?: DeleteGenerationReq): Promise<IApiResponse<DeleteGenerationResp>> {
    return request({
      url: "/api/v1/generations/:id",
      method: "DELETE",
      data: data,
    });
  },

  /** // ==================== 生成产品套图 ====================生成产品分析 */
  generateProductAnalyze(data?: GenerateProductAnalyzeReq): Promise<IApiResponse<GenerateProductAnalyzeResp>> {
    return request({
      url: "/api/v1/generations/product/analyze",
      method: "POST",
      data: data,
    });
  },

  /** 生成产品文案 */
  generateProductCopy(data?: GenerateProductCopyReq): Promise<IApiResponse<GenerateProductCopyResp>> {
    return request({
      url: "/api/v1/generations/product/copy",
      method: "POST",
      data: data,
    });
  },

  /** 生成产品套图 */
  generateProductImages(data?: GenerateProductImagesReq): Promise<IApiResponse<GenerateProductImagesResp>> {
    return request({
      url: "/api/v1/generations/product/images",
      method: "POST",
      data: data,
    });
  },

  /** 生成单张图片 */
  generateProductSingleImage(data?: GenerateProductSingleImageReq): Promise<IApiResponse<GenerateProductSingleImageResp>> {
    return request({
      url: "/api/v1/generations/product/single-image",
      method: "POST",
      data: data,
    });
  },
};
