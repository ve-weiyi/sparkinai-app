import request from "@/utils/request";


export interface CreatePaymentReq {
  method: string; // 支付方式
}

export interface CreatePaymentResp {
  success: boolean; 
  order_id: string; 
  payment_url: string; 
  message: string; 
}

export interface GetPaymentStatusReq {
  order_id: string; 
}

export interface GetPaymentStatusResp {
  status: string; 
  order_id: string; 
}

export interface PayWithAlipayReq {
  order_id: string; 
}

export interface PayWithAlipayResp {
  success: boolean; 
  order_id: string; 
  payment_url: string; 
  message: string; 
}

export interface PayWithStripeReq {
  order_id: string; 
}

export interface PayWithStripeResp {
  success: boolean; 
  order_id: string; 
  payment_url: string; 
  message: string; 
}

export interface PayWithWechatReq {
  order_id: string; 
}

export interface PayWithWechatResp {
  success: boolean; 
  order_id: string; 
  qr_code: string; 
  message: string; 
}


export const PaymentAPI = {
  /** 支付宝支付 */
  payWithAlipay(data?: PayWithAlipayReq): Promise<IApiResponse<PayWithAlipayResp>> {
    return request({
      url: "/api/v1/payment/alipay",
      method: "POST",
      data: data,
    });
  },

  /** 创建支付订单 */
  createPayment(data?: CreatePaymentReq): Promise<IApiResponse<CreatePaymentResp>> {
    return request({
      url: "/api/v1/payment/create",
      method: "POST",
      data: data,
    });
  },

  /** 获取支付状态 */
  getPaymentStatus(data?: GetPaymentStatusReq): Promise<IApiResponse<GetPaymentStatusResp>> {
    return request({
      url: "/api/v1/payment/status/:orderId",
      method: "GET",
      data: data,
    });
  },

  /** Stripe支付 */
  payWithStripe(data?: PayWithStripeReq): Promise<IApiResponse<PayWithStripeResp>> {
    return request({
      url: "/api/v1/payment/stripe",
      method: "POST",
      data: data,
    });
  },

  /** 微信支付 */
  payWithWechat(data?: PayWithWechatReq): Promise<IApiResponse<PayWithWechatResp>> {
    return request({
      url: "/api/v1/payment/wechat",
      method: "POST",
      data: data,
    });
  },
};
