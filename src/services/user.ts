import type { User } from '@/types'
// import { api } from '@/lib/api' // 暂时不使用，等待真实API接入

export const userService = {
  getCurrentUser: async () => {
    // TODO: 真实API调用（暂时注释）
    // return api.get<User>('/user/current')

    // Mock数据实现 - 从localStorage读取用户信息
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        // 尝试从localStorage获取用户信息
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
            resolve(user)
            return
          } catch (e) {
            console.error('解析用户信息失败:', e)
          }
        }

        // 如果没有存储的用户信息，返回默认用户
        resolve({
          id: '1',
          name: '与梦',
          email: 'weiyi7914@gmail.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
          credits: 100,
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
