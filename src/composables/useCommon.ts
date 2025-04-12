import { getTabConfig } from '@/utils/tabs'
import { useSettingStore } from '@/store/modules/setting'

// 通用函数
export function useCommon() {
  const settingStore = useSettingStore()
  const { showWorkTab, tabStyle } = storeToRefs(settingStore)

  // 刷新页面
  const refresh = () => {
    settingStore.reload()
  }

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0 })
  }

  // 页面最小高度
  const containerMinHeight = computed(() => {
    const { openHeight, closeHeight } = getTabConfig(tabStyle.value)
    return `calc(100vh - ${showWorkTab.value ? openHeight : closeHeight}px)`
  })

  return {
    refresh,
    scrollToTop,
    containerMinHeight
  }
}
