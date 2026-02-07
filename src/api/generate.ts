import request from "@/utils/request";
import type {
  ChatCompletionReq,
  ChatCompletionResp,
  DeleteGenerationReq,
  DeleteGenerationResp,
  GetAvailableEnginesReq,
  GetAvailableEnginesResp,
  GetGenerationReq,
  GetGenerationResp,
  GetGenerationsReq,
  GetGenerationsResp,
  ImageGenerationReq,
  ImageGenerationResp
} from "./types";

/** 引擎配置 */
export const GenerateAPI = {
  /** 获取可用引擎列表 */
  getAvailableEngines(params?: GetAvailableEnginesReq): Promise<IApiResponse<GetAvailableEnginesResp>> {
    return request({
      url: `/api/v1/engines/available`,
      method: "GET",
      params: params,
    });
  },

  /** Chat 对话接口（对应 OpenAI Chat Completions API） */
  chatCompletion(data?: ChatCompletionReq): Promise<IApiResponse<ChatCompletionResp>> {
    return request({
      url: `/api/v1/chat/completions`,
      method: "POST",
      data: data,
    });
  },

  /** 图片生成接口（对应 OpenAI Images API） */
  imageGeneration(data?: ImageGenerationReq): Promise<IApiResponse<ImageGenerationResp>> {
    return request({
      url: `/api/v1/images/generations`,
      method: "POST",
      data: data,
    });
  },

  /** 获取生成记录列表 */
  getGenerations(params?: GetGenerationsReq): Promise<IApiResponse<GetGenerationsResp>> {
    return request({
      url: `/api/v1/generations`,
      method: "GET",
      params: params,
    });
  },

  /** 获取生成记录详情 */
  getGeneration(params?: GetGenerationReq): Promise<IApiResponse<GetGenerationResp>> {
    return request({
      url: `/api/v1/generations/${params.id}`,
      method: "GET",
      params: params,
    });
  },

  /** 删除生成记录 */
  deleteGeneration(data?: DeleteGenerationReq): Promise<IApiResponse<DeleteGenerationResp>> {
    return request({
      url: `/api/v1/generations/${data.id}`,
      method: "DELETE",
      data: data,
    });
  },

};
