import request from "@/utils/request";
import type {
  DeleteGenerationReq,
  DeleteGenerationResp,
  GetGenerationReq,
  GetGenerationResp,
  GetGenerationsReq,
  GetGenerationsResp,
} from "./types";

/** 内容生成 */
export const GenerateAPI = {
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
