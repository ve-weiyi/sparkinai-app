import { defineStore } from 'pinia'
import type { User, CreditOption } from '@/types'
import { authService } from '@/services/auth'
import { userService } from '@/services/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    creditOptions: [] as CreditOption[],
    loading: false,
    error: null as Error | null,
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
    currentUser: (state) => state.user,
  },
  actions: {
    async login(credentials: { email: string; password: string }) {
      const response = await authService.login(credentials.email, credentials.password)
      if (response.success) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data))
        this.user = response.data
      }
      return response
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.user = null
    },
    async fetchCurrentUser() {
      this.loading = true
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          this.user = JSON.parse(storedUser)
        } else {
          this.user = await userService.getCurrentUser()
        }
      } catch (e) {
        this.error = e as Error
      } finally {
        this.loading = false
      }
    },
    async fetchCreditOptions() {
      try {
        this.creditOptions = await userService.getCreditOptions()
      } catch (e) {
        this.error = e as Error
      }
    },
    async refreshToken(payload: { user_id: string; grant_type: string; refresh_token: string }) {
      throw new Error('Not implemented')
    },
    resetAllState() {
      this.user = null
      this.creditOptions = []
      this.loading = false
      this.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export function useUserStoreHook() {
  return useUserStore()
}
