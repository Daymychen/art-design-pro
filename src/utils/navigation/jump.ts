/**
 * 导航跳转工具模块
 *
 * 提供统一的页面跳转和导航功能
 *
 * ## 主要功能
 *
 * - 外部链接打开（新窗口）
 * - 菜单项跳转处理（支持内部路由和外部链接）
 * - iframe 页面跳转支持
 * - 递归查找并跳转到第一个可见的子菜单
 * - 智能判断跳转目标类型（外部链接/内部路由）
 *
 * @module utils/navigation/jump
 * @author Art Design Pro Team
 */
import { AppRouteRecord } from '@/types/router'
import { router } from '@/router'

// 打开外部链接
export const openExternalLink = (link: string) => {
  window.open(link, '_blank')
}

/**
 * 菜单跳转
 * @param item 菜单项
 * @param jumpToFirst 是否跳转到第一个子菜单
 * @returns
 */
export const handleMenuJump = (item: AppRouteRecord, jumpToFirst: boolean = false) => {
  // 处理外部链接
  const { link, isIframe } = item.meta
  if (link && !isIframe) {
    return openExternalLink(link)
  }

  // 如果不需要跳转到第一个子菜单，或者没有子菜单，直接跳转当前路径
  if (!jumpToFirst || !item.children?.length) {
    return router.push(item.path)
  }

  // 递归查找第一个可见的叶子节点菜单
  const findFirstLeafMenu = (items: AppRouteRecord[]): AppRouteRecord => {
    for (const child of items) {
      if (!child.meta.isHide) {
        return child.children?.length ? findFirstLeafMenu(child.children) : child
      }
    }
    return items[0]
  }

  const firstChild = findFirstLeafMenu(item.children)

  // 如果第一个子菜单是外部链接则打开新窗口
  if (firstChild.meta?.link) {
    return openExternalLink(firstChild.meta.link)
  }

  // 跳转到子菜单路径
  router.push(firstChild.path)
}
