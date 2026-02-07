import { defineStore } from "pinia";
import type { GetUserProfileResp, CreditRuleItem } from "@/api/types";
import { AuthAPI } from "@/api/auth";
import { MeAPI } from "@/api/me";
import { AuthStorage, userStorage } from "@/utils/preferencesStorage";

export const useUserStore = defineStore("user", {
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
      } as any);
      const token = res.data.token;
      const uid = res.data.user_id;
      if (token?.access_token) {
        AuthStorage.setTokens(uid, token.access_token, token.refresh_token || "");
      }
      const profile = await MeAPI.getUserProfile({});
      userStorage.setUser(profile.data);
      this.user = profile.data;
      return { success: true };
    },
    logout() {
      userStorage.clearUser();
      this.user = null;
    },
    async fetchCurrentUser() {
      this.loading = true;
      try {
        const storedUser = userStorage.getUser<GetUserProfileResp>();
        if (storedUser) {
          this.user = storedUser;
        } else {
          const profile = await MeAPI.getUserProfile({});
          this.user = profile.data;
        }
      } catch (e) {
        this.error = e as Error;
      } finally {
        this.loading = false;
      }
    },
    async fetchCreditOptions() {
      try {
        const res = await MeAPI.getUserCredits({});
        this.creditOptions = res.data.list || [];
      } catch (e) {
        this.error = e as Error;
      }
    },
    async refreshToken(_payload: { user_id: string; grant_type: string; refresh_token: string }) {
      throw new Error("Not implemented");
    },
    resetAllState() {
      this.user = null;
      this.creditOptions = [];
      this.loading = false;
      this.error = null;
      userStorage.clearUser();
    },
  },
});

export function useUserStoreHook() {
  return useUserStore();
}
