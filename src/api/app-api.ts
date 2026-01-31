import request from "@/utils/request";


export interface PingReq {
}

export interface PingResp {
  env: string; 
  name: string; 
  version: string; 
  runtime: string; 
  description: string; 
}


export const AppApiAPI = {
  /** 健康检查 */
  ping(data?: PingReq): Promise<IApiResponse<PingResp>> {
    return request({
      url: "/api/v1/ping",
      method: "GET",
      data: data,
    });
  },
};
