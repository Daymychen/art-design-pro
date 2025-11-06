import { useSettingStore } from '@/store/modules/setting'

/**
 * 页面控制
 * 提供页面刷新、滚动控制等功能
 */
export function usePageControl() {
  const settingStore = useSettingStore()

  /**
   * 刷新当前页面
   * 通过切换 setting store 中的 refresh 状态触发页面重新渲染
   */
  const refresh = () => {
    settingStore.reload()
  }

  /**
   * 滚动到页面顶部
   * 查找主内容区域并将其滚动位置重置为顶部
   */
  const scrollToTop = () => {
    const scrollContainer = document.getElementById('app-main')
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }
  }

  /**
   * 平滑滚动到页面顶部
   * 使用 smooth 行为实现平滑滚动效果
   */
  const smoothScrollToTop = () => {
    const scrollContainer = document.getElementById('app-main')
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  /**
   * 滚动到指定位置
   * @param top 目标滚动位置（像素）
   * @param smooth 是否使用平滑滚动
   */
  const scrollTo = (top: number, smooth: boolean = false) => {
    const scrollContainer = document.getElementById('app-main')
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  }

  return {
    refresh,
    scrollToTop,
    smoothScrollToTop,
    scrollTo
  }
}
