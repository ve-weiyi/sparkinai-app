import type { User } from '@/types'

export const userService = {
  getCurrentUser: async () => {
    // 实际项目中调用：api.get<User>('/user/current')
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          name: '与梦',
          email: 'weiyi7914@gmail.com',
          avatar: '',
          credits: 6,
          plan: 'Free',
        })
      }, 500)
    })
  },

  getCreditOptions: async () => {
    // 实际项目中调用：api.get<Array<{ name: string; credits?: number; label?: string }>>('/user/credits')
    return new Promise<Array<{ name: string; credits?: number; label?: string }>>((resolve) => {
      setTimeout(() => {
        resolve([
          { name: '基础版', credits: 100, label: '适合个人用户' },
          { name: '专业版', credits: 500, label: '适合小型团队' },
          { name: '企业版', credits: 2000, label: '适合大型企业' }
        ])
      }, 500)
    })
  },
}
