import type { User } from '@/types'

export const authService = {
  login: async (email: string, password: string) => {
    // 实际项目中调用：api.post('/auth/login', { email, password })
    return new Promise<{ success: boolean; data: User & { token: string } }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: '1',
            name: '与梦',
            email: email || 'weiyi7914@gmail.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
            plan: 'Free',
            credits: 100,
            token: 'mock_token_' + Date.now()
          }
        })
      }, 800)
    })
  },

  sendVerificationCode: async (email: string, name?: string) => {
    // 实际项目中调用：api.post('/auth/send-code', { email, name })
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 500)
    })
  },

  verifyAndRegister: async (email: string, code: string) => {
    // 实际项目中调用：api.post('/auth/verify-register', { email, code })
    return new Promise<{ success: boolean; data: User & { token: string } }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: '1',
            name: '与梦',
            email,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
            plan: 'Free',
            credits: 100,
            token: 'mock_token_' + Date.now()
          }
        })
      }, 800)
    })
  },

  loginWithApple: async () => {
    // 实际项目中调用：api.post('/auth/oauth/apple', {})
    return new Promise<{ success: boolean; data: User & { token: string } }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: '1',
            name: 'Apple User',
            email: 'apple@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=apple',
            plan: 'Free',
            credits: 100,
            token: 'mock_token_' + Date.now()
          }
        })
      }, 1000)
    })
  },

  loginWithGoogle: async () => {
    // 实际项目中调用：api.post('/auth/oauth/google', {})
    return new Promise<{ success: boolean; data: User & { token: string } }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: '1',
            name: 'Google User',
            email: 'google@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
            plan: 'Free',
            credits: 100,
            token: 'mock_token_' + Date.now()
          }
        })
      }, 1000)
    })
  },
}
