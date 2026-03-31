import request from "@/utils/request";
import type {
  CreatePaymentOrderReq,
  CreatePaymentOrderResp,
  GetPaymentOrderListReq,
  GetPaymentOrderListResp,
  GetPaymentOrderReq,
  GetPaymentOrderResp,
  GetRechargePackagesReq,
  GetRechargePackagesResp,
  GetUserAccountReq,
  GetUserAccountResp,
  PaymentNotifyReq,
} from "./types";

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

  /** 统一支付回调 */
  paymentNotify(data?: PaymentNotifyReq): Promise<IApiResponse<any>> {
    return request({
      url: `/api/v1/payment/notify/${data.platform}`,
      method: "POST",
      data: data,
    });
  },

};
