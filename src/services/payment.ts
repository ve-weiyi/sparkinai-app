/**
 * 支付服务
 * 集成支付宝、微信支付和Stripe
 */

// import { api } from '@/lib/api' // 暂时不使用，等待真实API接入

export interface PaymentRequest {
  planName: string
  amount: number
  method: 'alipay' | 'wechat' | 'stripe'
  userId?: string
}

export interface PaymentResponse {
  success: boolean
  orderId: string
  paymentUrl?: string
  qrCode?: string
  message?: string
}

/**
 * 创建支付订单
 */
export async function createPayment(request: PaymentRequest): Promise<PaymentResponse> {
  // TODO: 真实API调用（暂时注释）
  // return api.post<PaymentResponse>('/payment/create', request)

  // Mock数据实现
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderId = 'ORD' + Date.now()

      resolve({
        success: true,
        orderId,
        paymentUrl: `/payment/process?orderId=${orderId}&method=${request.method}`,
        message: '订单创建成功'
      })
    }, 1000)
  })
}

/**
 * 支付宝支付
 */
export async function alipayPayment(orderId: string, amount: number): Promise<PaymentResponse> {
  // TODO: 真实API调用（暂时注释）
  // return api.post<PaymentResponse>('/payment/alipay', { orderId, amount })

  // Mock数据实现
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        orderId,
        paymentUrl: `https://openapi.alipay.com/gateway.do?mock=true`, // 实际的支付宝支付URL
        message: '请在新窗口完成支付'
      })
    }, 500)
  })
}

/**
 * 微信支付
 */
export async function wechatPayment(orderId: string, amount: number): Promise<PaymentResponse> {
  // TODO: 真实API调用（暂时注释）
  // return api.post<PaymentResponse>('/payment/wechat', { orderId, amount })

  // Mock数据实现
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        orderId,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // 实际的微信支付二维码
        message: '请使用微信扫码支付'
      })
    }, 500)
  })
}

/**
 * Stripe支付
 */
export async function stripePayment(orderId: string, amount: number): Promise<PaymentResponse> {
  // TODO: 真实API调用（暂时注释）
  // return api.post<PaymentResponse>('/payment/stripe', { orderId, amount })

  // Mock数据实现
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        orderId,
        paymentUrl: `https://checkout.stripe.com/mock`, // 实际的Stripe支付URL
        message: '正在跳转到Stripe支付页面'
      })
    }, 500)
  })
}

/**
 * 查询支付状态
 */
export async function queryPaymentStatus(orderId: string): Promise<{
  status: 'pending' | 'success' | 'failed'
  orderId: string
}> {
  // TODO: 真实API调用（暂时注释）
  // return api.get<{ status: 'pending' | 'success' | 'failed'; orderId: string }>(
  //   `/payment/status/${orderId}`
  // )

  // Mock数据实现
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟支付成功
      resolve({
        status: 'success',
        orderId
      })
    }, 1000)
  })
}