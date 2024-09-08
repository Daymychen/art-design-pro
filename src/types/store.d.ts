import { MenuThemeEnum, SystemThemeEnum } from '@/enums/appEnum'

// 用户信息
export interface UserInfo {
  id: number
  name: string
  username: string
  avatar: string
  token: string
}

// 系统主题样式（light | dark）
export interface SystemThemeType {
  className: string // className
}

// 定义包含多个主题的类型
export type SystemThemeTypes = {
  [key in Exclude<SystemThemeEnum, SystemThemeEnum.AUTO>]: SystemThemeType
}

// 菜单主题样式
export interface MenuThemeType {
  theme: MenuThemeEnum // 主题名称
  background: string // 背景色
  systemNameColor: string // 系统标题颜色
  textColor: string // 文字颜色
  textActiveColor: string // 文字选中颜色
  iconColor: string // 图标颜色
  iconActiveColor: string // 图标选中颜色
  tabBarBackground: string // 顶栏背景色
  systemBackground: string // 系统背景色
  leftLineColor: string // 左侧线条颜色
  rightLineColor: string // 右侧线条颜色
}

// 设置中心
export interface Setting {
  theme: string // 主题
  uniqueOpened: boolean // 是否开启手风琴模式
  menuButton: boolean // 是否显示菜单展开按钮
  showRefreshButton: boolean // 是否显示页面刷新按钮
  showCrumbs: boolean // 是否显示全局面包屑
  autoClose: boolean // 设置后是否自动关闭窗口
  showWorkTab: boolean // 是否显示多标签
  showLanguage: boolean // 是否显示多语言选择
  showNprogress: boolean // 是否显示顶部进度条
  themeModel: string // 主题模式
}

// 多标签
export interface WorkTabType {
  title: string
  title_en?: string
  path: string
  params?: object
  query?: object
}
