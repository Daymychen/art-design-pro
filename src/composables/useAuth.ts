import { useRoute } from 'vue-router'
import { MenuListType } from '@/types/menu'

type AuthItem = MenuListType['meta']['authList'][number]

/**
 * 按钮权限
 * 用法：
 * const { hasAuth } = useAuth()
 * hasAuth('add') // 检查是否拥有新增权限
 * @returns 权限检查结果
 */
export const useAuth = () => {
  const route = useRoute()
  const authList: AuthItem = Array.isArray(route.meta.authList)
    ? (route.meta.authList as AuthItem)
    : []

  /**
   * 检查是否拥有某权限标识
   * @param auth 权限标识
   * @returns 是否有权限
   */
  const hasAuth = (auth: string): boolean => {
    return authList.some((item: AuthItem) => item.auth_mark === auth)
  }

  return {
    hasAuth
  }
}
