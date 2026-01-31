import type { User } from '@/types'
import { api } from '@/lib/api'

type AuthResponse = { success: boolean; data: User & { token: string } }
type SendCodeResponse = { success: boolean; message?: string }

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  return api.post<AuthResponse>('/auth/login', { email, password })
}

export const sendVerificationCode = async (
  email: string,
  name?: string
): Promise<SendCodeResponse> => {
  return api.post<SendCodeResponse>('/auth/send-code', { email, name })
}

export const verifyAndRegister = async (
  email: string,
  code: string,
  name?: string
): Promise<AuthResponse> => {
  return api.post<AuthResponse>('/auth/verify-register', { email, code, name })
}

export const loginWithApple = async (): Promise<AuthResponse> => {
  return api.post<AuthResponse>('/auth/oauth/apple')
}

export const loginWithGoogle = async (): Promise<AuthResponse> => {
  return api.post<AuthResponse>('/auth/oauth/google')
}

export const authService = {
  login,
  sendVerificationCode,
  verifyAndRegister,
  loginWithApple,
  loginWithGoogle,
}
