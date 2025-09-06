import { AppRouteRecord } from '@/types/router'
import { RoutesAlias } from '../routesAlias'

/**
 * 将菜单数据转换为路由配置
 * @param route 菜单数据对象
 * @param parentPath 父级路径
 * @returns 处理后的路由配置
 */
export const menuDataToRouter = (route: AppRouteRecord, parentPath = ''): AppRouteRecord => {
  const fullPath = buildRoutePath(route, parentPath)

  // 检测组件配置并给出警告
  validateComponent(route, parentPath)

  return {
    ...route,
    path: fullPath,
    children: processChildren(route.children || [], fullPath)
  }
}

/**
 * 构建路由完整路径
 * @param route 菜单数据对象
 * @param parentPath 父级路径
 * @returns 构建后的完整路径
 */
const buildRoutePath = (route: AppRouteRecord, parentPath: string): string => {
  if (!route.path) return ''

  // iframe 类型路由直接使用原始路径
  if (route.meta?.isIframe) return route.path

  // 拼接并规范化路径
  return parentPath ? `${parentPath}/${route.path}`.replace(/\/+/g, '/') : route.path
}

/**
 * 处理子路由
 * @param children 子路由数组
 * @param parentPath 父级路径
 * @returns 处理后的子路由数组
 */
const processChildren = (children: AppRouteRecord[], parentPath: string): AppRouteRecord[] => {
  if (!Array.isArray(children) || children.length === 0) return []

  return children.map((child) => menuDataToRouter(child, parentPath))
}

/**
 * 保存 iframe 路由到 sessionStorage 中
 * @param list iframe 路由列表
 */
export const saveIframeRoutes = (list: AppRouteRecord[]): void => {
  if (list.length > 0) {
    sessionStorage.setItem('iframeRoutes', JSON.stringify(list))
  }
}

/**
 * 获取 iframe 路由
 * @returns iframe 路由列表
 */
export const getIframeRoutes = (): AppRouteRecord[] => {
  try {
    return JSON.parse(sessionStorage.getItem('iframeRoutes') || '[]')
  } catch (error) {
    console.error('解析 iframe 路由失败:', error)
    return []
  }
}

/**
 * 检查 component 是否有效
 * @param route 路由对象
 * @param parentPath 父级路径
 */
/**
 * 校验路由的 component 配置是否有效
 * @param route 当前路由对象
 * @param parentPath 父级路径
 */
const validateComponent = (route: AppRouteRecord, parentPath: string): void => {
  const hasExternalLink = !!route.meta?.link?.trim()
  const hasChildren = Array.isArray(route.children) && route.children.length > 0
  const routePath = route.path || '[未定义路径]'

  // 如果配置了 component，则无需校验
  if (route.component) return

  // 一级菜单：必须指定 Layout，除非是外链
  if (parentPath === '' && !hasExternalLink) {
    console.error(
      `[路由错误] 一级菜单(${routePath}) 缺少 component，必须指向 ${RoutesAlias.Layout}`
    )
    return
  }

  // 非一级菜单：如果既不是外链，也没有子路由，则必须配置 component
  if (!hasExternalLink && !hasChildren) {
    console.error(`[路由错误] 路由(${routePath}) 缺少 component 配置`)
  }
}
