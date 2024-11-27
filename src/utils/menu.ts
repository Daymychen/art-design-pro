import { AppRouteRecordRaw, router } from '@/router'
import { MenuListType } from '@/types/menu'
import { LanguageEnum } from '@/enums/appEnum'
import { useUserStore } from '@/store/modules/user'

// 动态匹配路由
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
  const { path, children = [], meta } = item
  const { title, title_en, authList, keepAlive, isHide, isHideTab } = meta

  const matchingRoute = roleRoutes.find((route) => route.path === path)

  if (matchingRoute) {
    matchingRoute.meta = {
      ...(matchingRoute.meta || {}),
      title,
      title_en,
      authList,
      keepAlive,
      isHide,
      isHideTab
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

// 菜单标题映射
const titlePropertyMap = {
  [LanguageEnum.ZH]: 'title',
  [LanguageEnum.EN]: 'title_en'
}

const getTitleProp = () => {
  return titlePropertyMap[useUserStore().language]
}

// 获取多语言菜单标题
export const getMenuTitle = (item: any) => {
  return item.meta[getTitleProp()]
}

// 获取 meta 多语言菜单标题
export const getMetaMenuTitle = (item: any) => {
  return item.meta[getTitleProp()]
}

// 获取标签页多语言标题
export const getWorkTabTitle = (item: any) => {
  return item[getTitleProp()]
}

// 打开链接
export const openLink = (link: string, isIframe: boolean = false) => {
  if (isIframe) {
    return router.push({ path: '/outside/iframe', query: { url: link } })
  } else {
    return window.open(link, '_blank')
  }
}
