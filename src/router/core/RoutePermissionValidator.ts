/**
 * 路由权限验证模块
 *
 * 提供路由权限验证和路径检查功能
 *
 * ## 主要功能
 *
 * - 验证路径是否在用户菜单权限中
 * - 构建菜单路径集合（扁平化处理）
 * - 支持动态路由参数匹配
 * - 路径前缀匹配
 *
 * ## 使用场景
 *
 * - 路由守卫中验证用户权限
 * - 动态路由注册后的权限检查
 * - 防止用户访问无权限的页面
 *
 * @module router/core/RoutePermissionValidator
 * @author Art Design Pro Team
 */

import type { AppRouteRecord } from '@/types/router'

/**
 * 路由权限验证器
 */
export class RoutePermissionValidator {
  /**
   * 验证路径是否在用户菜单权限中
   * @param targetPath 目标路径
   * @param menuList 菜单列表
   * @returns 是否有权限访问
   */
  static hasPermission(targetPath: string, menuList: AppRouteRecord[]): boolean {
    // 根路径始终允许访问
    if (targetPath === '/') {
      return true
    }

    // 构建路径集合
    const pathSet = this.buildMenuPathSet(menuList)

    // 检查路径是否在集合中（精确匹配或前缀匹配）
    return pathSet.has(targetPath) || this.checkPathPrefix(targetPath, pathSet)
  }

  /**
   * 构建菜单路径集合（扁平化处理）
   * @param menuList 菜单列表
   * @param pathSet 路径集合
   * @returns 路径集合
   */
  static buildMenuPathSet(
    menuList: AppRouteRecord[],
    pathSet: Set<string> = new Set()
  ): Set<string> {
    if (!Array.isArray(menuList) || menuList.length === 0) {
      return pathSet
    }

    for (const menuItem of menuList) {
      // 跳过隐藏的菜单项
      if (menuItem.meta?.isHide || !menuItem.path) {
        continue
      }

      // 标准化路径并添加到集合
      const menuPath = menuItem.path.startsWith('/') ? menuItem.path : `/${menuItem.path}`
      pathSet.add(menuPath)

      // 递归处理子菜单
      if (menuItem.children?.length) {
        this.buildMenuPathSet(menuItem.children, pathSet)
      }
    }

    return pathSet
  }

  /**
   * 检查目标路径是否匹配集合中的某个路径前缀
   * 用于支持动态路由参数匹配，如 /user/123 匹配 /user
   * @param targetPath 目标路径
   * @param pathSet 路径集合
   * @returns 是否匹配
   */
  static checkPathPrefix(targetPath: string, pathSet: Set<string>): boolean {
    // 遍历路径集合，检查是否有前缀匹配
    for (const menuPath of pathSet) {
      if (targetPath.startsWith(`${menuPath}/`)) {
        return true
      }
    }
    return false
  }

  /**
   * 验证并返回有效的路径
   * 如果目标路径无权限，返回首页路径
   * @param targetPath 目标路径
   * @param menuList 菜单列表
   * @param homePath 首页路径
   * @returns 验证后的路径
   */
  static validatePath(
    targetPath: string,
    menuList: AppRouteRecord[],
    homePath: string = '/'
  ): { path: string; hasPermission: boolean } {
    const hasPermission = this.hasPermission(targetPath, menuList)

    if (hasPermission) {
      return { path: targetPath, hasPermission: true }
    }

    return { path: homePath, hasPermission: false }
  }
}
