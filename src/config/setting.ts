/**
 * 系统设置默认值配置
 *
 * 统一管理系统设置的所有默认值
 *
 * ## 主要功能
 *
 * - 从 JSON 配置文件读取默认值
 * - 菜单相关默认配置
 * - 主题相关默认配置
 * - 界面显示默认配置
 * - 功能开关默认配置
 * - 样式相关默认配置
 * - 使用 Proxy 实现懒加载
 *
 * ## 注意事项
 *
 * 1. 修改此文件的配置项时，需要同步更新以下文件：
 *    - src/components/core/layouts/art-settings-panel/widget/SettingActions.vue（复制配置和重置配置逻辑）
 *    - src/store/modules/setting.ts（Store 状态定义）
 *    - public/system-config.json（JSON 配置文件）
 * 2. 可以通过设置面板的"复制配置"按钮快速生成配置代码
 * 3. 枚举类型的值需要与 src/enums/appEnum.ts 中的定义保持一致
 * 4. 配置使用懒加载，只在首次访问时从 JSON 读取
 *
 * @module config/setting
 * @author Art Design Pro Team
 */

import { SystemThemeEnum, MenuThemeEnum, MenuTypeEnum, ContainerWidthEnum } from '@/enums/appEnum'
import { getConfig } from '@/utils/config/config-loader'

/** 缓存的默认配置 */
let cachedDefaults: any = null

/**
 * 从 JSON 配置获取设置默认值
 *
 * 读取 system-config.json 中的 settingDefaults 配置，
 * 并将字符串枚举值转换为对应的枚举类型
 *
 * @returns 设置默认值对象
 */
function getSettingDefaults() {
  // 如果已缓存，直接返回
  if (cachedDefaults) {
    return cachedDefaults
  }

  const config = getConfig()
  const defaults = config.settingDefaults || {}

  // 枚举值映射
  const menuTypeMap: Record<string, MenuTypeEnum> = {
    left: MenuTypeEnum.LEFT,
    top: MenuTypeEnum.TOP,
    'top-left': MenuTypeEnum.TOP_LEFT,
    'dual-menu': MenuTypeEnum.DUAL_MENU
  }

  const themeTypeMap: Record<string, SystemThemeEnum> = {
    light: SystemThemeEnum.LIGHT,
    dark: SystemThemeEnum.DARK,
    auto: SystemThemeEnum.AUTO
  }

  const menuThemeMap: Record<string, MenuThemeEnum> = {
    design: MenuThemeEnum.DESIGN,
    dark: MenuThemeEnum.DARK,
    light: MenuThemeEnum.LIGHT
  }

  const containerWidthMap: Record<string, ContainerWidthEnum> = {
    full: ContainerWidthEnum.FULL,
    fixed: ContainerWidthEnum.BOXED,
    boxed: ContainerWidthEnum.BOXED
  }

  // 获取系统主色（用于默认主题色）
  const systemMainColor = config.systemMainColor?.[0] || '#5D87FF'

  cachedDefaults = {
    /** 菜单类型 */
    menuType: menuTypeMap[defaults.menuType] || MenuTypeEnum.LEFT,
    /** 菜单展开宽度 */
    menuOpenWidth: defaults.menuOpenWidth || 230,
    /** 菜单是否展开 */
    menuOpen: defaults.menuOpen !== undefined ? defaults.menuOpen : true,
    /** 双菜单是否显示文本 */
    dualMenuShowText: defaults.dualMenuShowText !== undefined ? defaults.dualMenuShowText : false,
    /** 系统主题类型 */
    systemThemeType: themeTypeMap[defaults.systemThemeType] || SystemThemeEnum.AUTO,
    /** 系统主题模式 */
    systemThemeMode: themeTypeMap[defaults.systemThemeMode] || SystemThemeEnum.AUTO,
    /** 菜单风格 */
    menuThemeType: menuThemeMap[defaults.menuThemeType] || MenuThemeEnum.DESIGN,
    /** 系统主题颜色 */
    systemThemeColor: defaults.systemThemeColor || systemMainColor,
    /** 是否显示菜单按钮 */
    showMenuButton: defaults.showMenuButton !== undefined ? defaults.showMenuButton : true,
    /** 是否显示快速入口 */
    showFastEnter: defaults.showFastEnter !== undefined ? defaults.showFastEnter : true,
    /** 是否显示刷新按钮 */
    showRefreshButton: defaults.showRefreshButton !== undefined ? defaults.showRefreshButton : true,
    /** 是否显示面包屑 */
    showCrumbs: defaults.showCrumbs !== undefined ? defaults.showCrumbs : true,
    /** 是否显示工作台标签 */
    showWorkTab: defaults.showWorkTab !== undefined ? defaults.showWorkTab : true,
    /** 是否显示语言切换 */
    showLanguage: defaults.showLanguage !== undefined ? defaults.showLanguage : true,
    /** 是否显示进度条 */
    showNprogress: defaults.showNprogress !== undefined ? defaults.showNprogress : false,
    /** 是否显示设置引导 */
    showSettingGuide: defaults.showSettingGuide !== undefined ? defaults.showSettingGuide : true,
    /** 是否显示节日文本 */
    showFestivalText: defaults.showFestivalText !== undefined ? defaults.showFestivalText : false,
    /** 是否显示水印 */
    watermarkVisible: defaults.watermarkVisible !== undefined ? defaults.watermarkVisible : false,
    /** 是否自动关闭 */
    autoClose: defaults.autoClose !== undefined ? defaults.autoClose : false,
    /** 是否唯一展开 */
    uniqueOpened: defaults.uniqueOpened !== undefined ? defaults.uniqueOpened : true,
    /** 是否色弱模式 */
    colorWeak: defaults.colorWeak !== undefined ? defaults.colorWeak : false,
    /** 是否刷新 */
    refresh: defaults.refresh !== undefined ? defaults.refresh : false,
    /** 是否加载节日烟花 */
    holidayFireworksLoaded:
      defaults.holidayFireworksLoaded !== undefined ? defaults.holidayFireworksLoaded : false,
    /** 边框模式 */
    boxBorderMode: defaults.boxBorderMode !== undefined ? defaults.boxBorderMode : true,
    /** 页面过渡效果 */
    pageTransition: defaults.pageTransition || 'slide-left',
    /** 标签页样式 */
    tabStyle: defaults.tabStyle || 'tab-default',
    /** 自定义圆角 */
    customRadius: defaults.customRadius || '0.75',
    /** 容器宽度 */
    containerWidth: containerWidthMap[defaults.containerWidth] || ContainerWidthEnum.FULL,
    /** 节日日期 */
    festivalDate: defaults.festivalDate || ''
  }

  return cachedDefaults
}

/**
 * 系统设置默认值配置
 *
 * 使用 Proxy 实现懒加载，只在首次访问时从 JSON 读取配置
 */
export const SETTING_DEFAULT_CONFIG = new Proxy({} as any, {
  get(target, prop) {
    const defaults = getSettingDefaults()
    return defaults[prop]
  },
  ownKeys() {
    const defaults = getSettingDefaults()
    return Reflect.ownKeys(defaults)
  },
  getOwnPropertyDescriptor(target, prop) {
    const defaults = getSettingDefaults()
    return Reflect.getOwnPropertyDescriptor(defaults, prop)
  }
})

/**
 * 获取设置默认值
 * @returns 设置默认值对象
 */
export function getSettingDefaultsConfig() {
  return { ...getSettingDefaults() }
}

/**
 * 重置为默认设置
 * @param currentSettings 当前设置对象
 */
export function resetToDefaults(currentSettings: Record<string, any>) {
  const defaults = getSettingDefaultsConfig()
  Object.keys(defaults).forEach((key) => {
    if (key in currentSettings) {
      currentSettings[key] = defaults[key as keyof typeof defaults]
    }
  })
}
