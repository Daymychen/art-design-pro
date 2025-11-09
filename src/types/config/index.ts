/**
 * 配置类型定义模块
 *
 * 提供系统配置相关的类型定义
 *
 * ## 主要功能
 *
 * - 主题设置类型
 * - 菜单布局类型
 * - 节日配置类型
 * - 系统基础配置类型
 * - 快速入口配置类型
 * - 顶部栏功能配置类型
 * - 环境配置类型
 * - 应用配置类型
 *
 * ## 使用场景
 *
 * - 系统配置文件类型约束
 * - 配置项类型定义
 * - 配置数据验证
 *
 * @module types/config/index
 * @author Art Design Pro Team
 */

import { MenuTypeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { MenuThemeType, SystemThemeTypes } from '@/types/store'

// 主题设置
export interface ThemeSetting {
  /** 主题名称 */
  name: string
  /** 系统主题类型 */
  theme: SystemThemeEnum
  /** 主题颜色数组 */
  color: string[]
  /** 左侧线条颜色 */
  leftLineColor: string
  /** 右侧线条颜色 */
  rightLineColor: string
  /** 主题图片 */
  img: string
}

// 菜单布局
export interface MenuLayout {
  /** 布局名称 */
  name: string
  /** 菜单类型值 */
  value: MenuTypeEnum
  /** 布局预览图 */
  img: string
  /** 布局描述 */
  description?: string
}

// 节日配置
export interface FestivalConfig {
  /** 节日日期（单日）或开始日期（日期范围） */
  date: string
  /** 节日结束日期（可选，用于跨日期节日） */
  endDate?: string
  /** 节日名称 */
  name: string
  /** 烟花图片 */
  image: string
  /** 滚动文本 */
  scrollText: string
  /** 是否激活 */
  isActive?: boolean
  /** 烟花播放次数（可选，默认为 3 次） */
  count?: number
}

// 系统基础配置
export interface SystemBasicConfig {
  // 系统名称
  name: string
  // 系统描述
  description?: string
  // 系统logo
  logo?: string
  // 系统favicon
  favicon?: string
  // 版权信息
  copyright?: string
}

// 快速入口基础项
export interface FastEnterBaseItem {
  /** 名称 */
  name: string
  /** 是否启用 */
  enabled?: boolean
  /** 排序权重 */
  order?: number
  /** 路由名称 */
  routeName?: string
  /** 外部链接 */
  link?: string
}

// 快速入口应用项
export interface FastEnterApplication extends FastEnterBaseItem {
  /** 应用描述 */
  description: string
  /** 图标代码 */
  icon: string
  /** 图标颜色 */
  iconColor: string
}

// 快速链接项
export type FastEnterQuickLink = FastEnterBaseItem

// 快速入口配置
export interface FastEnterConfig {
  /** 应用列表 */
  applications: FastEnterApplication[]
  /** 快速链接 */
  quickLinks: FastEnterQuickLink[]
  /** 显示条件（屏幕宽度） */
  minWidth?: number
}

// 系统配置
export interface SystemConfig {
  // 系统基础信息
  systemInfo: SystemBasicConfig
  // 系统主题样式
  systemThemeStyles: SystemThemeTypes
  // 设置主题列表
  settingThemeList: ThemeSetting[]
  // 菜单布局列表
  menuLayoutList: MenuLayout[]
  // 主题列表
  themeList: MenuThemeType[]
  // 暗色菜单样式
  darkMenuStyles: MenuThemeType[]
  // 系统主色调
  systemMainColor: readonly string[]
  // 快速入口配置
  fastEnter?: FastEnterConfig
  // 顶部栏功能配置
  headerBar?: HeaderBarFeatureConfig
}

// 环境配置
export interface EnvConfig {
  // 环境名称
  NODE_ENV: string
  // 应用版本
  VITE_VERSION: string
  // 应用端口
  VITE_PORT: string
  // 应用基础路径
  VITE_BASE_URL: string
  // API 地址
  VITE_API_URL: string
  // 是否开启 Mock
  VITE_USE_MOCK?: string
  // 是否开启压缩
  VITE_USE_GZIP?: string
  // 是否开启 CDN
  VITE_USE_CDN?: string
}

// 应用配置
export interface AppConfig extends SystemConfig {
  // 环境配置
  env: EnvConfig
  // 开发模式
  isDev: boolean
  // 生产模式
  isProd: boolean
  // 测试模式
  isTest: boolean
}

// 功能配置项基础接口
export interface FeatureConfigItem {
  enabled: boolean
  description: string
}

// 顶部栏功能配置接口
export interface HeaderBarFeatureConfig {
  /** 菜单按钮 */
  menuButton: FeatureConfigItem
  /** 刷新按钮 */
  refreshButton: FeatureConfigItem
  /** 快速入口 */
  fastEnter: FeatureConfigItem
  /** 面包屑导航 */
  breadcrumb: FeatureConfigItem
  /** 全局搜索 */
  globalSearch: FeatureConfigItem
  /** 全屏功能 */
  fullscreen: FeatureConfigItem
  /** 通知功能 */
  notification: FeatureConfigItem
  /** 聊天功能 */
  chat: FeatureConfigItem
  /** 多语言切换 */
  language: FeatureConfigItem
  /** 设置面板 */
  settings: FeatureConfigItem
  /** 主题切换 */
  themeToggle: FeatureConfigItem
}
