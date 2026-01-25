import type { ImageGeneration } from '@/types'

export const imageService = {
  getImages: async () => {
    // 实际项目中调用：api.get<ImageGeneration[]>('/images')
    return new Promise<ImageGeneration[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            prompt: '一个现代简约的客厅',
            image: 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+1',
            style: '现代简约',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            prompt: '一个温馨的卧室',
            image: 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+2',
            style: '温馨风格',
            createdAt: new Date().toISOString()
          }
        ])
      }, 500)
    })
  },
}
