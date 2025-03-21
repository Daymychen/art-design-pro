import { useSettingStore } from '@/store/modules/setting'

// 通用函数
export function useCommon() {
  const settingStore = useSettingStore()

  // 刷新页面
  const refresh = () => {
    settingStore.reload()
  }

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0 })
  }

  return {
    refresh,
    scrollToTop
  }
}
