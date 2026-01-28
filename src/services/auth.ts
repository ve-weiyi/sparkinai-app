import type { User } from '@/types'
// import { api } from '@/lib/api' // 暂时不使用，等待真实API接入

export const authService = {
  login: async (email: string, password: string) => {
    // TODO: 真实API调用（暂时注释）
    // return api.post<{ success: boolean; data: User & { token: string } }>(
    //   '/auth/login',
    //   { email, password }
    // )

    // Mock数据实现
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
    // TODO: 真实API调用（暂时注释）
    // return api.post<{ success: boolean }>(
    //   '/auth/send-code',
    //   { email, name }
    // )

    // Mock数据实现
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        console.log('发送验证码到:', email, '用户名:', name)
        resolve({ success: true })
      }, 500)
    })
  },

  verifyAndRegister: async (email: string, code: string, name?: string) => {
    // TODO: 真实API调用（暂时注释）
    // return api.post<{ success: boolean; data: User & { token: string } }>(
    //   '/auth/verify-register',
    //   { email, code, name }
    // )

    // Mock数据实现
    return new Promise<{ success: boolean; data: User & { token: string } }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: 'user-' + Date.now(),
            name: name || '新用户',
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
    // TODO: 真实API调用（暂时注释）
    // return api.post<{ success: boolean; data: User & { token: string } }>(
    //   '/auth/oauth/apple'
    // )

    // Mock数据实现
    return new Promise<{ success: boolean; data: User & { token: string } }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: '2',
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
    // TODO: 真实API调用（暂时注释）
    // return api.post<{ success: boolean; data: User & { token: string } }>(
    //   '/auth/oauth/google'
    // )

    // Mock数据实现
    return new Promise<{ success: boolean; data: User & { token: string } }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: '3',
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
