import { AppRouteRecordRaw, router } from '@/router'
import { MenuListType } from '@/types/menu'
export function routerMatch(menuList: MenuListType[], roleRoutes: AppRouteRecordRaw[]) {
  const routesToAdd: AppRouteRecordRaw[] = []

  menuList.forEach((item) => processMenuItem(item, roleRoutes, routesToAdd))

  routesToAdd.forEach((route) => {
    const { name } = route
    if (name && !router.hasRoute(name)) {
      router.addRoute(route)
    }
  })
}

function processMenuItem(
  item: MenuListType,
  roleRoutes: AppRouteRecordRaw[],
  routesToAdd: AppRouteRecordRaw[]
) {
  const { path, children = [], authList = [], title, title_en } = item

  const matchingRoute = roleRoutes.find((route) => route.path === path)

  if (matchingRoute) {
    matchingRoute.meta = {
      ...(matchingRoute.meta || {}),
      title,
      title_en,
      authList // 直接将 authList 添加到 meta 中
    }

    if (children.length > 0) {
      children.forEach((child) => processMenuItem(child, matchingRoute.children || [], routesToAdd))
    }

    routesToAdd.push(matchingRoute)
  } else {
    // 匹配不上的路由
    // console.error('【动态添加路由】找不到与路径匹配的路由:', path);
  }
}
