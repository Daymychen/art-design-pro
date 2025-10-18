/**
 * Store相关类型定义
 */

import { MenuThemeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { LocationQueryRaw } from 'vue-router'

// 系统主题样式（light | dark）
export interface SystemThemeType {
  className: string
}

// 定义包含多个主题的类型
export type SystemThemeTypes = {
  [key in Exclude<SystemThemeEnum, SystemThemeEnum.AUTO>]: SystemThemeType
}

// 菜单主题样式
export interface MenuThemeType {
  theme: MenuThemeEnum
  background: string
  systemNameColor: string
  textColor: string
  iconColor: string
  img?: string
}

// 设置中心
export interface SettingState {
  theme: string
  uniqueOpened: boolean
  menuButton: boolean
  showRefreshButton: boolean
  showCrumbs: boolean
  autoClose: boolean
  showWorkTab: boolean
  showLanguage: boolean
  showNprogress: boolean
  themeModel: string
}

// 多标签
export interface WorkTab {
  title: string
  customTitle?: string
  path: string
  name: string
  keepAlive: boolean
  fixedTab?: boolean
  params?: object
  query?: LocationQueryRaw
  icon?: string
  isActive?: boolean
}

// 用户Store状态
export interface UserState {
  userInfo: Api.Auth.UserInfo | null
  token: string | null
  roles: string[]
  permissions: string[]
}

// 设置Store状态
export interface SettingStoreState extends SettingState {
  // 额外的设置状态
  collapsed: boolean
  device: 'desktop' | 'mobile'
  language: string
}

// 工作标签页Store状态
export interface WorkTabState {
  tabs: WorkTab[]
  activeTab: string
  cachedTabs: string[]
}

// 菜单Store状态
export interface MenuState {
  menuList: any[]
  isLoaded: boolean
  collapsed: boolean
}

// 根Store状态类型
export interface RootState {
  user: UserState
  setting: SettingStoreState
  workTab: WorkTabState
  menu: MenuState
}
