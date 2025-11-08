/**
 * 路由工具模块
 *
 * 提供路由处理和菜单路径相关的工具函数
 *
 * ## 主要功能
 *
 * - iframe 路由检测，判断是否为外部嵌入页面
 * - 菜单项有效性验证，过滤隐藏和无效菜单
 * - 路径标准化处理，统一路径格式
 * - 递归查找菜单树中第一个有效路径
 * - 支持多级嵌套菜单的路径解析
 *
 * ## 使用场景
 *
 * - 系统初始化时获取默认跳转路径
 * - 菜单权限过滤后获取首个可访问页面
 * - 路由重定向逻辑处理
 * - iframe 页面特殊处理
 *
 * @module utils/navigation/route
 * @author Art Design Pro Team
 */

import { AppRouteRecord } from '@/types'

// 检查是否为 iframe 路由
export function isIframe(url: string): boolean {
  return url.startsWith('/outside/iframe/')
}

/**
 * 验证菜单项是否有效
 * @param menuItem 菜单项
 * @returns 是否为有效菜单项
 */
const isValidMenuItem = (menuItem: AppRouteRecord): boolean => {
  return !!(menuItem.path && menuItem.path.trim() && !menuItem.meta?.isHide)
}

/**
 * 标准化路径格式
 * @param path 路径
 * @returns 标准化后的路径
 */
const normalizePath = (path: string): string => {
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * 递归获取菜单的第一个有效路径
 * @param menuList 菜单列表
 * @returns 第一个有效路径，如果没有找到则返回空字符串
 */
export const getFirstMenuPath = (menuList: AppRouteRecord[]): string => {
  if (!Array.isArray(menuList) || menuList.length === 0) {
    return ''
  }

  for (const menuItem of menuList) {
    if (!isValidMenuItem(menuItem)) {
      continue
    }

    // 如果有子菜单，优先查找子菜单
    if (menuItem.children?.length) {
      const childPath = getFirstMenuPath(menuItem.children)
      if (childPath) {
        return childPath
      }
    }

    // 返回当前菜单项的标准化路径
    return normalizePath(menuItem.path!)
  }

  return ''
}
