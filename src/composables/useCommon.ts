import { useSettingStore } from '@/store/modules/setting'
import { useMenuStore } from '@/store/modules/menu'

// 通用函数
export function useCommon() {
  const settingStore = useSettingStore()

  // 是否是前端控制模式
  const isFrontendMode = computed(() => {
    return import.meta.env.VITE_ACCESS_MODE === 'frontend'
  })

  // 首页路径
  const homePath = computed(() => useMenuStore().getHomePath())

  // 刷新页面
  const refresh = () => {
    settingStore.reload()
  }

  // 回到顶部
  const scrollToTop = () => {
    const scrollContainer = document.getElementById('app-main')
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }
  }

  // 页面最小高度
  const containerMinHeight = ref('100vh')

  // 更新容器高度
  const updateContainerHeight = () => {
    const headerElement = document.getElementById('app-header')
    const contentHeaderElement = document.getElementById('app-content-header')

    const headerHeight = headerElement?.offsetHeight ?? 0
    const textHeight = contentHeaderElement?.offsetHeight ?? 0
    const totalHeight = headerHeight + textHeight + 15

    containerMinHeight.value = `calc(100vh - ${totalHeight}px)`
    document.documentElement.style.setProperty('--art-full-height', containerMinHeight.value)
  }

  // 设置容器高度CSS变量
  const setContainerHeightCssVar = () => {
    document.documentElement.style.setProperty('--art-full-height', containerMinHeight.value)
  }

  // 页面加载完成后初始化高度并监听变化
  onMounted(() => {
    // 初始化高度
    updateContainerHeight()

    // 监听窗口大小变化
    window.addEventListener('resize', updateContainerHeight)

    // 使用 ResizeObserver 监听元素高度变化
    const resizeObserver = new ResizeObserver(() => {
      updateContainerHeight()
    })

    const headerElement = document.getElementById('app-header')
    const contentHeaderElement = document.getElementById('app-content-header')

    if (headerElement) {
      resizeObserver.observe(headerElement)
    }

    if (contentHeaderElement) {
      resizeObserver.observe(contentHeaderElement)
    }

    // 组件卸载时清理
    onUnmounted(() => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateContainerHeight)
    })
  })

  return {
    isFrontendMode,
    homePath,
    refresh,
    scrollToTop,
    containerMinHeight,
    setContainerHeightCssVar
  }
}
