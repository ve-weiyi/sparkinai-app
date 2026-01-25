import type { Video } from '@/types'

export const videoService = {
  getVideos: async () => {
    // 实际项目中调用：api.get<Video[]>('/videos')
    return new Promise<Video[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: '复刻成都',
            thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
            duration: '00:15',
            views: 1234,
            likes: 89,
            creator: { name: '陈宇成', avatar: '' },
            tags: ['城市', '旅行'],
            createdAt: '2024-01-20',
          },
          {
            id: '2',
            title: '许巧成',
            thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
            duration: '00:12',
            views: 2341,
            likes: 156,
            creator: { name: '许巧成', avatar: '' },
            tags: ['时尚', '复古'],
            createdAt: '2024-01-19',
          },
          {
            id: '3',
            title: '李雅慧',
            thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
            duration: '00:18',
            views: 3456,
            likes: 234,
            creator: { name: '李雅慧', avatar: '' },
            tags: ['艺术', '创意'],
            createdAt: '2024-01-18',
          },
          {
            id: '4',
            title: '张雅慧',
            thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
            duration: '00:20',
            views: 4567,
            likes: 345,
            creator: { name: '张雅慧', avatar: '' },
            tags: ['音乐', '表演'],
            createdAt: '2024-01-17',
          },
          {
            id: '5',
            title: '黄雅慧',
            thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
            duration: '00:16',
            views: 5678,
            likes: 456,
            creator: { name: '黄雅慧', avatar: '' },
            tags: ['节日', '庆祝'],
            createdAt: '2024-01-16',
          },
          {
            id: '1',
            title: '示例视频 1',
            thumbnail: 'https://placehold.co/600x400/e2e8f0/64748b?text=Video+1',
            duration: '5:30',
            views: 1200,
            likes: 89,
            creator: {
              name: '创作者A',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator1'
            },
            tags: ['教程', '前端'],
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: '示例视频 2',
            thumbnail: 'https://placehold.co/600x400/e2e8f0/64748b?text=Video+2',
            duration: '8:45',
            views: 2500,
            likes: 156,
            creator: {
              name: '创作者B',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator2'
            },
            tags: ['分享', '后端'],
            createdAt: new Date().toISOString()
          }
        ])
      }, 500)
    })
  },
}
