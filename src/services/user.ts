import { api } from '@/lib/api'
import type { User } from '@/types'

export const userService = {
  getCurrentUser: () => api.get<User>('/user/current'),
  getCreditOptions: () => api.get<Array<{ name: string; credits?: number; label?: string }>>('/user/credits'),
}
