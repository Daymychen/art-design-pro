import { computed } from 'vue'

/**
 * 应用模式管理
 * 用于判断当前应用的权限控制模式（前端模式 / 后端模式）
 */
export function useAppMode() {
  // 获取访问模式配置
  const accessMode = import.meta.env.VITE_ACCESS_MODE

  /**
   * 是否为前端控制模式
   * 前端模式：权限由前端路由配置控制
   */
  const isFrontendMode = computed(() => accessMode === 'frontend')
  /**
   * 是否为后端控制模式
   * 后端模式：权限由后端接口返回的菜单数据控制
   */
  const isBackendMode = computed(() => accessMode === 'backend')

  /**
   * 当前应用模式
   */
  const currentMode = computed(() => accessMode)

  return {
    isFrontendMode,
    isBackendMode,
    currentMode
  }
}
