import { ref, computed } from 'vue'

/**
 * 用户状态管理 Composable
 * 示例：展示如何使用 composables 管理可复用的逻辑
 */
export function useUser() {
  const user = ref(null)
  const isLoggedIn = computed(() => user.value !== null)

  const login = async (credentials: { email: string; password: string }) => {
    // 登录逻辑
    console.log('Login with:', credentials)
  }

  const logout = () => {
    user.value = null
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
  }
}
