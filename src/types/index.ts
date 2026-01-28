// 全局类型定义
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar: string
  plan: 'Free' | 'Pro'
  credits: number
}

export interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  views: number
  likes: number
  creator: {
    name: string
    avatar: string
  }
  tags: string[]
  createdAt: string
}

export interface ImageGeneration {
  id: string
  prompt: string
  image: string
  style: string
  createdAt: string
}

export interface CreditOption {
  name: string
  credits?: number
  label?: string
}

export interface CreditRecord {
  id: string
  type: 'earn' | 'spend' | 'refund' | 'expire'
  amount: number
  balance: number
  description: string
  createdAt: string
  relatedOrder?: string
}

export interface FavoriteItem {
  id: string
  type: 'image' | 'video'
  title: string
  thumbnail: string
  prompt?: string
  style?: string
  duration?: string
  createdAt: string
  favoritedAt: string
  tags?: string[]
}
