/**
 * 动态路由处理
 * 根据接口返回的菜单列表注册动态路由
 */
import type { Router, RouteRecordRaw } from 'vue-router'
import type { MenuListType } from '@/types/menu'
import { RoutesAlias } from './routesAlias'
import { saveIframeRoutes } from '@/utils/menu'

/**
 * 动态导入 views 目录下所有 .vue 组件
 */
const modules: Record<string, () => Promise<any>> = import.meta.glob('../../views/**/*.vue')

/**
 * 注册异步路由
 * 将接口返回的菜单列表转换为 Vue Router 路由配置，并添加到传入的 router 实例中
 * @param router Vue Router 实例
 * @param menuList 接口返回的菜单列表
 */
function registerAsyncRoutes(router: Router, menuList: MenuListType[]): void {
  // 用于局部收集 iframe 类型路由
  const iframeRoutes: MenuListType[] = []
  menuList.forEach((route) => {
    if (route.name && !router.hasRoute(route.name)) {
      const routeConfig = convertRouteComponent(route, iframeRoutes)
      router.addRoute(routeConfig as RouteRecordRaw)
    }
  })
  // 保存 iframe 路由（后续可能用于其他业务逻辑）
  saveIframeRoutes(iframeRoutes)
}

/**
 * 根据组件路径动态加载组件
 * @param componentPath 组件路径（不包含 ../../views 前缀和 .vue 后缀）
 * @param routeName 当前路由名称（用于错误提示）
 * @returns 组件加载函数
 */
function loadComponent(componentPath: string, routeName: string): () => Promise<any> {
  const fullPath = `../../views${componentPath}.vue`
  const module = modules[fullPath]
  if (!module && componentPath !== '') {
    console.error(`未找到组件：${routeName} ${fullPath}`)
  }
  return module as () => Promise<any>
}

/**
 * 将菜单路由配置转换为 Vue Router 路由配置
 * @param route 菜单路由配置
 * @param iframeRoutes 用于收集 iframe 类型路由的数组
 * @returns 转换后的 Vue Router 路由对象
 */
function convertRouteComponent(route: MenuListType, iframeRoutes: MenuListType[]): RouteRecordRaw {
  const { component, children, ...routeConfig } = route
  const converted: any = {
    ...routeConfig,
    component:
      RoutesAlias[component as keyof typeof RoutesAlias] ||
      loadComponent(component as string, route.name)
  }

  // 如果路由为 iframe 类型，则修改路径并收集到 iframeRoutes 数组中
  if (route.meta.isIframe) {
    route.path = `/outside/iframe/${encodeURIComponent(route.meta.title)}`
    iframeRoutes.push(route)
  }

  // 递归处理子路由
  if (children && children.length > 0) {
    converted.children = children.map((child) => convertRouteComponent(child, iframeRoutes))
  }
  return converted
}

export { registerAsyncRoutes, convertRouteComponent, loadComponent }
