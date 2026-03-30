import { defineStore } from "pinia";
import type { GetUserProfileResp } from "@/api/types";
import { AuthAPI } from "@/api/auth";
import { MeAPI } from "@/api/me";
import { AuthStorage, authStorage, userStorage } from "@/utils/preferencesStorage";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as GetUserProfileResp | null,
    creditOptions: [] as any[],
    loading: false,
    error: null as Error | null,
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
    currentUser: (state) => state.user,
  },
  actions: {
    async passwordLogin(credentials: { account: string; password: string }) {
      const res = await AuthAPI.passwordLogin({
        account: credentials.account,
        password: credentials.password,
      });
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
    async phoneCodeLogin(credentials: { phone: string; verify_code: string }) {
      const res = await AuthAPI.phoneCodeLogin({
        phone: credentials.phone,
        verify_code: credentials.verify_code,
      });
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
    async emailCodeLogin(credentials: { email: string; verify_code: string }) {
      const res = await AuthAPI.emailCodeLogin({
        email: credentials.email,
        verify_code: credentials.verify_code,
      });
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

    async refreshToken(_payload: { user_id: string; grant_type: string; refresh_token: string }) {
      throw new Error("Not implemented");
    },
    resetAllState() {
      this.user = null;
      this.creditOptions = [];
      this.loading = false;
      this.error = null;
      userStorage.clearUser();
      authStorage.clearAuth();
    },
  },
});

export function useUserStoreHook() {
  return useUserStore();
}
