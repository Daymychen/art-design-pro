/**
 * 路由验证器
 *
 * 负责验证路由配置的合法性
 *
 * @module router/core/RouteValidator
 * @author Art Design Pro Team
 */

import type { AppRouteRecord } from '@/types/router'
import { RoutesAlias } from '../routesAlias'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export class RouteValidator {
  // 用于记录已经提示过的路由，避免重复提示
  private warnedRoutes = new Set<string>()

  /**
   * 验证路由配置
   */
  validate(routes: AppRouteRecord[]): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // 检测重复路由
    this.checkDuplicates(routes, errors, warnings)

    // 检测组件配置
    this.checkComponents(routes, errors, warnings)

    // 检测嵌套菜单的 /index/index 配置
    this.checkNestedIndexComponent(routes)

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * 检测重复路由
   */
  private checkDuplicates(
    routes: AppRouteRecord[],
    errors: string[],
    warnings: string[],
    parentPath = ''
  ): void {
    const routeNameMap = new Map<string, string>()
    const componentPathMap = new Map<string, string>()

    const checkRoutes = (routes: AppRouteRecord[], parentPath = '') => {
      routes.forEach((route) => {
        const currentPath = route.path || ''
        const fullPath = this.resolvePath(parentPath, currentPath)

        // 名称重复检测
        if (route.name) {
          const routeName = String(route.name)
          if (routeNameMap.has(routeName)) {
            warnings.push(`路由名称重复: "${routeName}" (${fullPath})`)
          } else {
            routeNameMap.set(routeName, fullPath)
          }
        }

        // 组件路径重复检测
        if (route.component && typeof route.component === 'string') {
          const componentPath = route.component
          if (componentPath !== RoutesAlias.Layout) {
            const componentKey = `${parentPath}:${componentPath}`
            if (componentPathMap.has(componentKey)) {
              warnings.push(`组件路径重复: "${componentPath}" (${fullPath})`)
            } else {
              componentPathMap.set(componentKey, fullPath)
            }
          }
        }

        // 递归处理子路由
        if (route.children?.length) {
          checkRoutes(route.children, fullPath)
        }
      })
    }

    checkRoutes(routes, parentPath)
  }

  /**
   * 检测组件配置
   */
  private checkComponents(
    routes: AppRouteRecord[],
    errors: string[],
    warnings: string[],
    parentPath = ''
  ): void {
    routes.forEach((route) => {
      const hasExternalLink = !!route.meta?.link?.trim()
      const hasChildren = Array.isArray(route.children) && route.children.length > 0
      const routePath = route.path || '[未定义路径]'
      const isIframe = route.meta?.isIframe

      // 如果配置了 component，则无需校验
      if (route.component) {
        // 递归检查子路由
        if (route.children?.length) {
          const fullPath = this.resolvePath(parentPath, route.path || '')
          this.checkComponents(route.children, errors, warnings, fullPath)
        }
        return
      }

      // 一级菜单：必须指定 Layout，除非是外链或 iframe
      if (parentPath === '' && !hasExternalLink && !isIframe) {
        errors.push(`一级菜单(${routePath}) 缺少 component，必须指向 ${RoutesAlias.Layout}`)
        return
      }

      // 非一级菜单：如果既不是外链、iframe，也没有子路由，则必须配置 component
      if (!hasExternalLink && !isIframe && !hasChildren) {
        errors.push(`路由(${routePath}) 缺少 component 配置`)
      }

      // 递归检查子路由
      if (route.children?.length) {
        const fullPath = this.resolvePath(parentPath, route.path || '')
        this.checkComponents(route.children, errors, warnings, fullPath)
      }
    })
  }

  /**
   * 检测嵌套菜单的 Layout 组件配置
   * 只有一级菜单才能使用 Layout，二级及以下菜单不能使用
   */
  private checkNestedIndexComponent(routes: AppRouteRecord[], level = 1): void {
    routes.forEach((route) => {
      // 检查二级及以下菜单是否错误使用了 Layout
      if (level > 1 && route.component === RoutesAlias.Layout) {
        this.logLayoutError(route, level)
      }

      // 递归检查子路由
      if (route.children?.length) {
        this.checkNestedIndexComponent(route.children, level + 1)
      }
    })
  }

  /**
   * 输出 Layout 组件配置错误日志
   */
  private logLayoutError(route: AppRouteRecord, level: number): void {
    const routeName = String(route.name || route.path || '未知路由')
    const routeKey = `${routeName}_${route.path}`

    // 避免重复提示
    if (this.warnedRoutes.has(routeKey)) return
    this.warnedRoutes.add(routeKey)

    const menuTitle = route.meta?.title || routeName
    const routePath = route.path || '/'

    console.error(
      `[路由配置错误] 菜单 "${menuTitle}" (name: ${routeName}, path: ${routePath}) 配置错误\n` +
        `  问题: ${level}级菜单不能使用 ${RoutesAlias.Layout} 作为 component\n` +
        `  说明: 只有一级菜单才能使用 ${RoutesAlias.Layout}，二级及以下菜单应该指向具体的组件路径\n` +
        `  当前配置: component: '${RoutesAlias.Layout}'\n` +
        `  应该改为: component: '/your/component/path' 或留空 ''（如果是目录菜单）`
    )
  }

  /**
   * 路径解析
   */
  private resolvePath(parent: string, child: string): string {
    return [parent.replace(/\/$/, ''), child.replace(/^\//, '')].filter(Boolean).join('/')
  }
}
