import { api } from '@/lib/api'
import type { Video } from '@/types'

export const videoService = {
  getVideos: () => api.get<Video[]>('/videos'),
}
