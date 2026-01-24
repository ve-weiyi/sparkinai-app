import { ref, onMounted } from 'vue'
import { userService } from '@/services/user'
import type { User, CreditOption } from '@/types'

export function useUserData() {
  const currentUser = ref<User | null>(null)
  const creditOptions = ref<CreditOption[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchCurrentUser = async () => {
    loading.value = true
    try {
      currentUser.value = await userService.getCurrentUser()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  const fetchCreditOptions = async () => {
    try {
      creditOptions.value = await userService.getCreditOptions()
    } catch (e) {
      error.value = e as Error
    }
  }

  onMounted(() => {
    fetchCurrentUser()
    fetchCreditOptions()
  })

  return {
    currentUser,
    creditOptions,
    loading,
    error,
    fetchCurrentUser,
  }
}
