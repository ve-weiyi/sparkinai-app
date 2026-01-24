import { ref, onMounted } from 'vue'
import { videoService } from '@/services/video'
import type { Video } from '@/types'

export function useVideos() {
  const videos = ref<Video[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchVideos = async () => {
    loading.value = true
    try {
      videos.value = await videoService.getVideos()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchVideos()
  })

  return {
    videos,
    loading,
    error,
    fetchVideos,
  }
}
