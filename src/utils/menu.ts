import { router } from '@/router'
import { LanguageEnum } from '@/enums/appEnum'
import { useUserStore } from '@/store/modules/user'
import { MenuListType } from '@/types/menu'

// 创建递归函数处理嵌套路由
/**
 * 处理路由配置,转换为菜单数据结构
 * @param route 路由配置对象
 * @param parentPath 父级路径
 * @returns 处理后的菜单项
 */
export const processRoute = (route: MenuListType, parentPath = ''): MenuListType => {
  // 构建完整路径
  const currentPath = route.path
    ? parentPath
      ? `${parentPath}/${route.path}`.replace(/\/+/g, '/') // 规范化路径,避免多余的斜杠
      : route.path
    : ''

  return {
    id: route.id ?? Math.random(), // 使用空值合并运算符
    name: route.name,
    path: currentPath,
    component: route.component,
    meta: route.meta ?? {}, // 使用空值合并运算符
    children: Array.isArray(route.children)
      ? route.children.map((child) => processRoute(child, currentPath))
      : []
  }
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
    const iframeRoute = getIframeRoutes().find((route: any) => route.meta.link === link)
    if (iframeRoute?.path) {
      router.push({ path: iframeRoute.path })
    }
  } else {
    return window.open(link, '_blank')
  }
}

// 获取 iframe 路由
export const getIframeRoutes = () => {
  return JSON.parse(sessionStorage.getItem('iframeRoutes') || '[]')
}
