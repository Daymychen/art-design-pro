/**
 * 系统全局配置
 *
 * 这是系统的核心配置文件，集中管理所有全局配置项。
 * 包含系统信息、主题样式、菜单布局、颜色方案等所有可配置项。
 *
 * ## 主要功能
 *
 * - 系统信息 - 系统名称等基础信息
 * - 主题配置 - 亮色/暗色/自动主题的样式配置
 * - 菜单配置 - 菜单布局、主题、宽度等配置
 * - 颜色方案 - 系统主色和预设颜色列表
 * - 快速入口 - 快速入口应用和链接配置
 * - 顶部栏配置 - 顶部栏功能模块配置
 * - 使用 Proxy 实现懒加载
 *
 * ## 配置项说明
 *
 * - systemInfo: 系统基础信息（名称等）
 * - systemThemeStyles: 系统主题样式映射
 * - settingThemeList: 可选的系统主题列表
 * - menuLayoutList: 可选的菜单布局列表
 * - themeList: 菜单主题样式列表
 * - darkMenuStyles: 暗黑模式下的菜单样式
 * - systemMainColor: 预设的系统主色列表
 * - fastEnter: 快速入口配置
 * - headerBar: 顶部栏功能配置
 *
 * ## 使用方式
 *
 * ```typescript
 * import AppConfig from '@/config'
 *
 * // 访问配置
 * console.log(AppConfig.systemInfo.name)
 * console.log(AppConfig.systemMainColor)
 * ```
 *
 * ## 注意事项
 *
 * 1. 配置使用 Proxy 实现懒加载，只在首次访问时创建
 * 2. 配置从 public/system-config.json 读取
 * 3. 如果 JSON 配置不存在或加载失败，使用代码中的默认值
 * 4. 修改 JSON 配置后需要刷新页面才能生效
 *
 * @module config
 * @author Art Design Pro Team
 */

import { createAppConfig } from './init'
import type { SystemConfig } from '@/types/config'

/** 缓存的配置对象 */
let cachedConfig: SystemConfig | null = null

/**
 * 获取应用配置（懒加载）
 *
 * 只在首次访问时创建配置对象，后续访问直接返回缓存
 *
 * @returns 应用配置对象
 */
function getAppConfig(): SystemConfig {
  if (!cachedConfig) {
    cachedConfig = createAppConfig()
  }
  return cachedConfig
}

/**
 * 应用配置对象
 *
 * 使用 Proxy 实现懒加载和属性访问拦截
 * 确保配置在 JSON 加载完成后才创建
 */
const appConfig = new Proxy({} as SystemConfig, {
  get(target, prop) {
    const config = getAppConfig()
    return config[prop as keyof SystemConfig]
  },
  ownKeys() {
    const config = getAppConfig()
    return Reflect.ownKeys(config)
  },
  getOwnPropertyDescriptor(target, prop) {
    const config = getAppConfig()
    return Reflect.getOwnPropertyDescriptor(config, prop)
  }
})

export default appConfig
