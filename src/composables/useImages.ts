import { ref, onMounted } from 'vue'
import { imageService } from '@/services/image'
import type { ImageGeneration } from '@/types'

export function useImages() {
  const images = ref<ImageGeneration[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchImages = async () => {
    loading.value = true
    try {
      images.value = await imageService.getImages()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchImages()
  })

  return {
    images,
    loading,
    error,
    fetchImages,
  }
}
