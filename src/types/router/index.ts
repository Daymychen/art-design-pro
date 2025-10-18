/**
 * 路由相关类型定义
 */

import { RouteRecordRaw } from 'vue-router'

/**
 * 路由元数据接口
 * 定义路由的各种配置属性
 */
export interface RouteMeta extends Record<string | number | symbol, unknown> {
  /** 路由标题 */
  title: string
  /** 路由图标 */
  icon?: string
  /** 是否显示徽章 */
  showBadge?: boolean
  /** 文本徽章 */
  showTextBadge?: string
  /** 是否在菜单中隐藏 */
  isHide?: boolean
  /** 是否在标签页中隐藏 */
  isHideTab?: boolean
  /** 外部链接 */
  link?: string
  /** 是否为iframe */
  isIframe?: boolean
  /** 是否缓存 */
  keepAlive?: boolean
  /** 操作权限 */
  authList?: Array<{
    title: string
    authMark: string
  }>
  /** 是否为一级菜单 */
  isFirstLevel?: boolean
  /** 角色权限 */
  roles?: string[]
  /** 是否固定标签页 */
  fixedTab?: boolean
  /** 激活菜单路径 */
  activePath?: string
  /** 是否为全屏页面 */
  isFullPage?: boolean
  /** 是否为权限按钮行 */
  isAuthButton?: boolean
  /** 权限标识 */
  authMark?: string
  /** 父级路径 */
  parentPath?: string
}

/**
 * 应用路由记录接口
 * 扩展 Vue Router 的路由记录类型
 */
export interface AppRouteRecord extends Omit<RouteRecordRaw, 'meta' | 'children' | 'component'> {
  id?: number
  meta: RouteMeta
  children?: AppRouteRecord[]
  component?: string | (() => Promise<any>)
}
