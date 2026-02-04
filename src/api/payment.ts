import request from "@/utils/request";
import type { CreatePaymentOrderResp, GetPaymentOrderReq, GetRechargePackagesReq, GetAccountTransactionListReq, GetAccountTransactionListResp, CreatePaymentOrderReq, GetPaymentOrderListReq, GetPaymentOrderListResp, GetPaymentOrderResp, GetRechargePackagesResp, GetUserAccountReq, GetUserAccountResp } from "./types";

/** 支付管理 */
export const PaymentAPI = {
  /** 获取用户账户信息 */
  getUserAccount(params?: GetUserAccountReq): Promise<IApiResponse<GetUserAccountResp>> {
    return request({
      url: `/api/v1/payment/account`,
      method: "GET",
      params: params,
    });
  },

  /** 获取账户流水列表 */
  getAccountTransactionList(params?: GetAccountTransactionListReq): Promise<IApiResponse<GetAccountTransactionListResp>> {
    return request({
      url: `/api/v1/payment/account/transactions`,
      method: "GET",
      params: params,
    });
  },

  /** 创建支付订单 */
  createPaymentOrder(data?: CreatePaymentOrderReq): Promise<IApiResponse<CreatePaymentOrderResp>> {
    return request({
      url: `/api/v1/payment/orders`,
      method: "POST",
      data: data,
    });
  },

  /** 获取支付订单列表 */
  getPaymentOrderList(params?: GetPaymentOrderListReq): Promise<IApiResponse<GetPaymentOrderListResp>> {
    return request({
      url: `/api/v1/payment/orders`,
      method: "GET",
      params: params,
    });
  },

  /** 查询支付订单 */
  getPaymentOrder(params?: GetPaymentOrderReq): Promise<IApiResponse<GetPaymentOrderResp>> {
    return request({
      url: `/api/v1/payment/orders/${params.orderNo}`,
      method: "GET",
      params: params,
    });
  },

  /** 获取充值套餐列表 */
  getRechargePackages(params?: GetRechargePackagesReq): Promise<IApiResponse<GetRechargePackagesResp>> {
    return request({
      url: `/api/v1/payment/packages`,
      method: "GET",
      params: params,
    });
  },

  /** 支付宝支付回调 */
  alipayNotify(): Promise<IApiResponse<any>> {
    return request({
      url: `/api/v1/payment/notify/alipay`,
      method: "POST",
    });
  },

  /** 微信支付回调 */
  wechatNotify(): Promise<IApiResponse<any>> {
    return request({
      url: `/api/v1/payment/notify/wechat`,
      method: "POST",
    });
  },

};
