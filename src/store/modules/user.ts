import { defineStore } from 'pinia'
import type { GetUserProfileResp, CreditRuleItem } from '@/api/me'
import { AuthAPI } from '@/api/auth'
import { MeAPI } from '@/api/me'
import { AuthStorage } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as GetUserProfileResp | null,
    creditOptions: [] as CreditRuleItem[],
    loading: false,
    error: null as Error | null,
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
    currentUser: (state) => state.user,
  },
  actions: {
    async login(credentials: { email: string; password: string }) {
      const res = await AuthAPI.emailLogin({
        email: credentials.email,
        password: credentials.password,
      } as any)
      const token = res.data.token
      const uid = res.data.user_id
      if (token?.access_token) {
        AuthStorage.setTokens(uid, token.access_token, token.refresh_token || '')
        localStorage.setItem('token', token.access_token)
      }
      const profile = await MeAPI.getUserProfile({})
      localStorage.setItem('user', JSON.stringify(profile.data))
      this.user = profile.data
      return { success: true }
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
          const profile = await MeAPI.getUserProfile({})
          this.user = profile.data
        }
      } catch (e) {
        this.error = e as Error
      } finally {
        this.loading = false
      }
    },
    async fetchCreditOptions() {
      try {
        const res = await MeAPI.getUserCredits({})
        this.creditOptions = res.data.list || []
      } catch (e) {
        this.error = e as Error
      }
    },
    async refreshToken(_payload: { user_id: string; grant_type: string; refresh_token: string }) {
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
