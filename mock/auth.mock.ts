import { MockHttpItem } from 'vite-plugin-mock-dev-server'
import { defineMock } from './base'

export const authMockData: MockHttpItem[] = [
  {
    url: '/auth/login',
    method: 'POST',
    body: (req) => {
      return {
        success: true,
        data: {
          id: '1',
          name: '与梦',
          email: req.body.email || 'weiyi7914@gmail.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (req.body.email || 'default'),
          credits: 100,
          plan: 'Free',
          token: 'mock-token-' + Date.now(),
        },
      }
    },
  },
  {
    url: '/auth/send-code',
    method: 'POST',
    body: (req) => {
      console.log('发送验证码到:', req.body.email)
      return {
        success: true,
        message: '验证码已发送到您的邮箱'
      }
    },
  },
  {
    url: '/auth/verify-register',
    method: 'POST',
    body: (req) => {
      // 模拟验证码验证（任何6位数字都通过）
      if (req.body.code && req.body.code.length === 6) {
        return {
          success: true,
          data: {
            id: 'user-' + Date.now(),
            name: req.body.name || '新用户',
            email: req.body.email,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + req.body.email,
            credits: 100,
            plan: 'Free',
            token: 'mock-token-' + Date.now(),
          },
        }
      } else {
        return {
          success: false,
          message: '验证码错误'
        }
      }
    },
  },
  {
    url: '/auth/oauth/apple',
    method: 'POST',
    body: {
      success: true,
      data: {
        id: '2',
        name: 'Apple User',
        email: 'apple.user@icloud.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=apple',
        credits: 100,
        plan: 'Pro',
        token: 'mock-apple-token-' + Date.now(),
      },
    },
  },
  {
    url: '/auth/oauth/google',
    method: 'POST',
    body: {
      success: true,
      data: {
        id: '3',
        name: 'Google User',
        email: 'google.user@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
        credits: 100,
        plan: 'Pro',
        token: 'mock-google-token-' + Date.now(),
      },
    },
  },
]

export default defineMock(authMockData)
