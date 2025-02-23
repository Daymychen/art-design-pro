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
  // 遍历菜单列表，注册路由
  menuList.forEach((route) => {
    if (route.name && !router.hasRoute(route.name)) {
      const routeConfig = convertRouteComponent(route, iframeRoutes)
      router.addRoute(routeConfig as RouteRecordRaw)
    }
  })
  // 保存 iframe 路由
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

interface ConvertedRoute extends Omit<RouteRecordRaw, 'children'> {
  id?: number
  children?: ConvertedRoute[]
  component?: RouteRecordRaw['component'] | (() => Promise<any>)
}

function convertRouteComponent(route: MenuListType, iframeRoutes: MenuListType[]): ConvertedRoute {
  const { component, children, ...routeConfig } = route

  // 基础路由配置
  const converted: ConvertedRoute = {
    ...routeConfig,
    component: undefined
  }

  try {
    if (route.meta.isIframe) {
      handleIframeRoute(converted, route, iframeRoutes)
    } else if (route.meta.isInMainContainer) {
      handleLayoutRoute(converted, route, component)
    } else {
      // 处理普通路由组件
      handleNormalRoute(converted, component, route.name)
    }

    // 递归处理子路由
    if (children?.length) {
      converted.children = children.map((child) => convertRouteComponent(child, iframeRoutes))
    }

    return converted
  } catch (error) {
    console.error(`路由转换失败: ${route.name}`, error)
    throw error
  }
}

// 处理 iframe 类型路由
function handleIframeRoute(
  converted: ConvertedRoute,
  route: MenuListType,
  iframeRoutes: MenuListType[]
): void {
  converted.path = `/outside/iframe/${route.name}`
  converted.component = () => import('@/views/outside/Iframe.vue')
  iframeRoutes.push(route)
}

// 处理一级级菜单路由
function handleLayoutRoute(
  converted: ConvertedRoute,
  route: MenuListType,
  component: string | undefined
): void {
  converted.component = () => import('@/views/index/index.vue')
  converted.path = `/${(route.path?.split('/')[1] || '').trim()}`
  converted.name = ''

  converted.children = [
    {
      id: route.id,
      path: route.path,
      name: route.name,
      component: loadComponent(component as string, route.name),
      meta: route.meta
    }
  ]
}

// 处理普通路由
function handleNormalRoute(converted: any, component: string | undefined, routeName: string): void {
  if (component) {
    converted.component = component
      ? RoutesAlias[component as keyof typeof RoutesAlias] ||
        loadComponent(component as string, routeName)
      : undefined
  }
}

export { registerAsyncRoutes, convertRouteComponent, loadComponent }
