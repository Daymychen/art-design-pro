import { computed } from 'vue'
import { useMenuStore } from '@/store/modules/menu'

/**
 * 首页路径管理
 * 用于获取系统首页路径
 */
export function useHomePath() {
  const menuStore = useMenuStore()

  /**
   * 首页路径
   * 从菜单 store 中获取配置的首页路径
   */
  const homePath = computed(() => menuStore.getHomePath())

  return {
    homePath
  }
}
