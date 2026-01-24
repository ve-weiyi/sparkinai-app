import { api } from '@/lib/api'
import type { ImageGeneration } from '@/types'

export const imageService = {
  getImages: () => api.get<ImageGeneration[]>('/images'),
}
