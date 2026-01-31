import type { User, CreditOption } from '@/types'
import { api } from '@/lib/api'

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/user/current')
  },

  getCreditOptions: async (): Promise<CreditOption[]> => {
    return api.get<CreditOption[]>('/user/credits')
  },
}
