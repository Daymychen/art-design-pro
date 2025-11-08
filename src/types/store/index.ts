/**
 * Store 状态类型定义模块
 *
 * 提供 Pinia Store 的状态类型定义
 *
 * ## 主要功能
 *
 * - 系统主题类型
 * - 菜单主题类型
 * - 设置状态类型
 * - 工作标签页类型
 * - 用户状态类型
 * - 菜单状态类型
 * - 根状态类型
 *
 * ## 使用场景
 *
 * - Store 状态类型约束
 * - 状态数据结构定义
 * - 类型提示和自动补全
 *
 * @module types/store/index
 * @author Art Design Pro Team
 */

import { MenuThemeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { LocationQueryRaw } from 'vue-router'

// 系统主题样式（light | dark）
export interface SystemThemeType {
  /** 主题类名 */
  className: string
}

// 定义包含多个主题的类型
export type SystemThemeTypes = {
  [key in Exclude<SystemThemeEnum, SystemThemeEnum.AUTO>]: SystemThemeType
}

// 菜单主题样式
export interface MenuThemeType {
  /** 主题类型 */
  theme: MenuThemeEnum
  /** 背景颜色 */
  background: string
  /** 系统名称颜色 */
  systemNameColor: string
  /** 文本颜色 */
  textColor: string
  /** 图标颜色 */
  iconColor: string
  /** 背景图片 */
  img?: string
}

// 设置中心
export interface SettingState {
  /** 主题 */
  theme: string
  /** 是否只保持一个子菜单的展开 */
  uniqueOpened: boolean
  /** 是否显示菜单按钮 */
  menuButton: boolean
  /** 是否显示刷新按钮 */
  showRefreshButton: boolean
  /** 是否显示面包屑 */
  showCrumbs: boolean
  /** 是否自动关闭 */
  autoClose: boolean
  /** 是否显示工作标签页 */
  showWorkTab: boolean
  /** 是否显示语言切换 */
  showLanguage: boolean
  /** 是否显示进度条 */
  showNprogress: boolean
  /** 主题模式 */
  themeModel: string
}

// 多标签
export interface WorkTab {
  /** 标签标题 */
  title: string
  /** 自定义标题 */
  customTitle?: string
  /** 路由路径 */
  path: string
  /** 路由名称 */
  name: string
  /** 是否缓存 */
  keepAlive: boolean
  /** 是否固定标签 */
  fixedTab?: boolean
  /** 路由参数 */
  params?: object
  /** 路由查询参数 */
  query?: LocationQueryRaw
  /** 图标 */
  icon?: string
  /** 是否激活 */
  isActive?: boolean
}

// 用户Store状态
export interface UserState {
  /** 用户信息 */
  userInfo: Api.Auth.UserInfo | null
  /** 认证令牌 */
  token: string | null
  /** 用户角色列表 */
  roles: string[]
  /** 用户权限列表 */
  permissions: string[]
}

// 设置Store状态
export interface SettingStoreState extends SettingState {
  // 额外的设置状态
  /** 菜单是否折叠 */
  collapsed: boolean
  /** 设备类型 */
  device: 'desktop' | 'mobile'
  /** 当前语言 */
  language: string
}

// 工作标签页Store状态
export interface WorkTabState {
  /** 标签页列表 */
  tabs: WorkTab[]
  /** 当前激活的标签页 */
  activeTab: string
  /** 缓存的标签页列表 */
  cachedTabs: string[]
}

// 菜单Store状态
export interface MenuState {
  /** 菜单列表 */
  menuList: any[]
  /** 菜单是否已加载 */
  isLoaded: boolean
  /** 菜单是否折叠 */
  collapsed: boolean
}

// 根Store状态类型
export interface RootState {
  /** 用户状态 */
  user: UserState
  /** 设置状态 */
  setting: SettingStoreState
  /** 工作标签页状态 */
  workTab: WorkTabState
  /** 菜单状态 */
  menu: MenuState
}
