import { createDefineMock } from 'vite-plugin-mock-dev-server'

const defineMock = createDefineMock((mock) => {
  mock.url = '/api' + mock.url
})

export default defineMock([
  {
    url: '/images',
    method: 'GET',
    body: [
      {
        id: '1',
        prompt: '上传图片，AI 创作同款宠物猫树',
        image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
        style: 'TikTok Shop',
        createdAt: '2024-01-20',
      },
      {
        id: '2',
        prompt: '现代简约风格客厅设计',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        style: '室内设计',
        createdAt: '2024-01-19',
      },
      {
        id: '3',
        prompt: '温馨家居装饰',
        image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400',
        style: '家居',
        createdAt: '2024-01-18',
      },
    ],
  },
])
