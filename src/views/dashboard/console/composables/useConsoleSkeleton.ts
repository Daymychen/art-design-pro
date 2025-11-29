import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Provide a shared skeleton loading state for the dashboard page.
 * @param delay skeleton duration in ms
 */
export const useConsoleSkeleton = (delay = 1200) => {
  const loading = ref(true)
  let timer: ReturnType<typeof setTimeout> | null = null

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  onMounted(() => {
    timer = setTimeout(() => {
      loading.value = false
      clearTimer()
    }, delay)
  })

  onBeforeUnmount(() => {
    clearTimer()
  })

  return {
    loading,
    stopSkeleton: clearTimer
  }
}

