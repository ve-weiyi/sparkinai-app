import request from "@/utils/request";
import type {
  FileInfoVO,
  GetUploadTokenReq,
  GetUploadTokenResp,
  UploadFileReq,
} from "./types";

/** 文件上传 */
export const UploadAPI = {
  /** 上传文件（服务端上传） */
  uploadFile(data?: UploadFileReq): Promise<IApiResponse<FileInfoVO>> {
    return request({
      url: `/api/v1/upload/file`,
      method: "POST",
      data: data,
    });
  },

  /** 获取上传凭证（前端直传） */
  getUploadToken(data?: GetUploadTokenReq): Promise<IApiResponse<GetUploadTokenResp>> {
    return request({
      url: `/api/v1/upload/upload-token`,
      method: "POST",
      data: data,
    });
  },

};
