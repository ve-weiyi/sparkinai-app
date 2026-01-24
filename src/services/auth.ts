import { api } from '@/lib/api'
import type { User } from '@/types'

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ success: boolean; data: User & { token: string } }>('/auth/login', { email, password }),
  
  sendVerificationCode: (email: string, name?: string) =>
    api.post<{ success: boolean }>('/auth/send-code', { email, name }),
  
  verifyAndRegister: (email: string, code: string) =>
    api.post<{ success: boolean; data: User & { token: string } }>('/auth/verify-register', { email, code }),
  
  loginWithApple: () =>
    api.post<{ success: boolean; data: User & { token: string } }>('/auth/oauth/apple', {}),
  
  loginWithGoogle: () =>
    api.post<{ success: boolean; data: User & { token: string } }>('/auth/oauth/google', {}),
}
