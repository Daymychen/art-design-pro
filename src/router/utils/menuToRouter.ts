import { MenuListType } from '@/types/menu'

/**
 * 将菜单数据转换为路由配置
 * @param route 菜单数据对象
 * @param parentPath 父级路径
 * @returns 处理后的路由配置
 */
export const menuDataToRouter = (route: MenuListType, parentPath = ''): MenuListType => {
  const { id, name, component, meta, children } = route

  const fullPath = buildRoutePath(route, parentPath)

  return {
    id,
    name,
    path: fullPath,
    component,
    meta,
    children: processChildren(children || [], fullPath)
  }
}

/**
 * 构建路由完整路径
 * @param route 菜单数据对象
 * @param parentPath 父级路径
 * @returns 构建后的完整路径
 */
const buildRoutePath = (route: MenuListType, parentPath: string): string => {
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
const processChildren = (children: MenuListType[], parentPath: string): MenuListType[] => {
  if (!Array.isArray(children) || children.length === 0) return []

  return children.map((child) => menuDataToRouter(child, parentPath))
}

/**
 * 保存 iframe 路由到 sessionStorage 中
 * @param list iframe 路由列表
 */
export const saveIframeRoutes = (list: MenuListType[]): void => {
  if (list.length > 0) {
    sessionStorage.setItem('iframeRoutes', JSON.stringify(list))
  }
}

/**
 * 获取 iframe 路由
 * @returns iframe 路由列表
 */
export const getIframeRoutes = (): MenuListType[] => {
  try {
    return JSON.parse(sessionStorage.getItem('iframeRoutes') || '[]')
  } catch (error) {
    console.error('解析 iframe 路由失败:', error)
    return []
  }
}
