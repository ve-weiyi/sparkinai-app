import request from "@/utils/request";
import type {
  DeactivateAccountReq,
  DeactivateAccountResp,
  DeductUserQuotaReq,
  DeductUserQuotaResp,
  GetUserBalanceLogsReq,
  GetUserBalanceLogsResp,
  GetUserCreditsResp,
  GetUserProfileReq,
  GetUserProfileResp,
  ReactivateAccountReq,
  ReactivateAccountResp,
  UpdateUserProfileReq,
  UpdateUserProfileResp
} from "./types";

/** 个人中心 */
export const MeAPI = {
  /** 扣除用户额度 */
  deductUserQuota(data?: DeductUserQuotaReq): Promise<IApiResponse<DeductUserQuotaResp>> {
    return request({
      url: `/api/v1/user/deduct`,
      method: "POST",
      data: data,
    });
  },

  /** 获取当前用户信息 */
  getUserProfile(params?: GetUserProfileReq): Promise<IApiResponse<GetUserProfileResp>> {
    return request({
      url: `/api/v1/user/me`,
      method: "GET",
      params: params,
    });
  },

  /** 更新当前用户信息 */
  updateUserProfile(data?: UpdateUserProfileReq): Promise<IApiResponse<UpdateUserProfileResp>> {
    return request({
      url: `/api/v1/user/me`,
      method: "PUT",
      data: data,
    });
  },

  /** 获取当前用户余额变动记录 */
  getUserBalanceLogs(params?: GetUserBalanceLogsReq): Promise<IApiResponse<GetUserBalanceLogsResp>> {
    return request({
      url: `/api/v1/user/me/balance-logs`,
      method: "GET",
      params: params,
    });
  },

  /** 获取当前用户积分规则 */
  getUserCredits(params?: GetUserProfileReq): Promise<IApiResponse<GetUserCreditsResp>> {
    return request({
      url: `/api/v1/user/me/credits`,
      method: "GET",
      params: params,
    });
  },

  /** 停用账号（进入冷静期） */
  deactivateAccount(data?: DeactivateAccountReq): Promise<IApiResponse<DeactivateAccountResp>> {
    return request({
      url: `/api/v1/user/me/deactivate`,
      method: "POST",
      data: data,
    });
  },

  /** 恢复账号（冷静期内） */
  reactivateAccount(data?: ReactivateAccountReq): Promise<IApiResponse<ReactivateAccountResp>> {
    return request({
      url: `/api/v1/user/me/reactivate`,
      method: "POST",
      data: data,
    });
  },

};
