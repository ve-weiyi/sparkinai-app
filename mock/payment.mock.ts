import { MockHttpItem } from 'vite-plugin-mock-dev-server'
import { defineMock } from './base.ts'

// 存储订单状态（模拟数据库）
const orderStatus: Record<string, 'pending' | 'success' | 'failed'> = {}

export const paymentMockData: MockHttpItem[] = [
  {
    url: '/payment/create',
    method: 'POST',
    body: (req) => {
      const orderId = 'ORD' + Date.now()
      // 初始化订单状态为pending
      orderStatus[orderId] = 'pending'

      return {
        success: true,
        orderId,
        paymentUrl: `/payment/process?orderId=${orderId}&method=${req.body.method}`,
        message: '订单创建成功'
      }
    },
  },
  {
    url: '/payment/alipay',
    method: 'POST',
    body: (req) => {
      // 模拟支付宝支付，2秒后自动成功
      setTimeout(() => {
        orderStatus[req.body.orderId] = 'success'
      }, 2000)

      return {
        success: true,
        orderId: req.body.orderId,
        paymentUrl: 'https://openapi.alipay.com/gateway.do?mock=true',
        message: '请在新窗口完成支付'
      }
    },
  },
  {
    url: '/payment/wechat',
    method: 'POST',
    body: (req) => {
      // 模拟微信支付，3秒后自动成功
      setTimeout(() => {
        orderStatus[req.body.orderId] = 'success'
      }, 3000)

      return {
        success: true,
        orderId: req.body.orderId,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        message: '请使用微信扫码支付'
      }
    },
  },
  {
    url: '/payment/stripe',
    method: 'POST',
    body: (req) => {
      // 模拟Stripe支付，2秒后自动成功
      setTimeout(() => {
        orderStatus[req.body.orderId] = 'success'
      }, 2000)

      return {
        success: true,
        orderId: req.body.orderId,
        paymentUrl: 'https://checkout.stripe.com/mock',
        message: '正在跳转到Stripe支付页面'
      }
    },
  },
  {
    url: '/payment/status/:orderId',
    method: 'GET',
    body: (req) => {
      const orderId = req.params.orderId
      const status = orderStatus[orderId] || 'pending'

      return {
        status,
        orderId
      }
    },
  },
]

export default defineMock(paymentMockData)
