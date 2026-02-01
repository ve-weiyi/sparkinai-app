import request from "@/utils/request";


export interface BalanceLogItem {
  id: number; // 记录ID
  change_type: string; // 变动类型
  change_amount: number; // 变动金额
  balance_before: number; // 变动前余额
  balance_after: number; // 变动后余额
  description: string; // 变动描述
  created_at: number; // 创建时间
}

export interface CreditRuleItem {
  name: string; 
  credits: number; 
  label?: string; 
}

export interface DeductUserQuotaReq {
  generation_id: string; // 生成记录ID
  cost_tokens: number; // 消耗的token数量
}

export interface DeductUserQuotaResp {
  success: boolean; // 是否扣除成功
  free_usage: number; // 剩余免费次数
  token_balance: number; // 剩余Token余额
  credits: number; // 积分
}

export interface GetUserBalanceLogsReq extends PageQuery {
}

export interface GetUserBalanceLogsResp {
  page: number; // 当前页码
  page_size: number; // 每页数量
  total: number; // 总记录数
  list: BalanceLogItem[]; // 记录列表
}

export interface GetUserCreditsResp {
  list: CreditRuleItem[]; 
}

export interface GetUserProfileReq {
}

export interface GetUserProfileResp {
  user_id: string; // 用户ID（UUID）
  username: string; // 用户名
  nickname: string; // 昵称
  avatar: string; // 头像URL
  email: string; // 邮箱
  phone: string; // 手机号
  status: number; // 账号状态
  plan: string; // 会员计划
  free_usage: number; // 免费使用次数
  token_balance: number; // Token余额
  credits: number; // 积分
  total_generations: number; // 累计生成次数
  created_at: number; // 注册时间
}

export interface PageQuery {
  page?: number; 
  page_size?: number; 
}

export interface UpdateUserProfileReq {
  nickname?: string; // 昵称
  avatar?: string; // 头像URL
}

export interface UpdateUserProfileResp {
}


export const MeAPI = {
  /** 扣除用户额度 */
  deductUserQuota(data?: DeductUserQuotaReq): Promise<IApiResponse<DeductUserQuotaResp>> {
    return request({
      url: "/api/v1/user/deduct",
      method: "POST",
      data: data,
    });
  },

  /** 获取当前用户信息 */
  getUserProfile(data?: GetUserProfileReq): Promise<IApiResponse<GetUserProfileResp>> {
    return request({
      url: "/api/v1/user/me",
      method: "GET",
      data: data,
    });
  },

  /** 更新当前用户信息 */
  updateUserProfile(data?: UpdateUserProfileReq): Promise<IApiResponse<UpdateUserProfileResp>> {
    return request({
      url: "/api/v1/user/me",
      method: "PUT",
      data: data,
    });
  },

  /** 获取当前用户余额变动记录 */
  getUserBalanceLogs(data?: GetUserBalanceLogsReq): Promise<IApiResponse<GetUserBalanceLogsResp>> {
    return request({
      url: "/api/v1/user/me/balance-logs",
      method: "GET",
      data: data,
    });
  },

  /** 获取当前用户积分规则 */
  getUserCredits(data?: GetUserProfileReq): Promise<IApiResponse<GetUserCreditsResp>> {
    return request({
      url: "/api/v1/user/me/credits",
      method: "GET",
      data: data,
    });
  },
};
