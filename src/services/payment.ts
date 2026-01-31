/**
 * 支付服务
 * 集成支付宝、微信支付和Stripe
 */

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

import { api } from '@/lib/api'

export async function createPayment(request: PaymentRequest): Promise<PaymentResponse> {
  return api.post<PaymentResponse>('/payment/create', request)
}

/**
 * 支付宝支付
 */
export async function alipayPayment(orderId: string, amount: number): Promise<PaymentResponse> {
  return api.post<PaymentResponse>('/payment/alipay', { orderId, amount })
}

/**
 * 微信支付
 */
export async function wechatPayment(orderId: string, amount: number): Promise<PaymentResponse> {
  return api.post<PaymentResponse>('/payment/wechat', { orderId, amount })
}

/**
 * Stripe支付
 */
export async function stripePayment(orderId: string, amount: number): Promise<PaymentResponse> {
  return api.post<PaymentResponse>('/payment/stripe', { orderId, amount })
}

/**
 * 查询支付状态
 */
export async function queryPaymentStatus(orderId: string): Promise<{
  status: 'pending' | 'success' | 'failed'
  orderId: string
}> {
  return api.get<{ status: 'pending' | 'success' | 'failed'; orderId: string }>(
    `/payment/status/${orderId}`
  )
}
