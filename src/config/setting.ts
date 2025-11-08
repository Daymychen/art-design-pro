/**
 * 系统设置默认值配置
 *
 * 统一管理系统设置的所有默认值
 *
 * ## 主要功能
 *
 * - 菜单相关默认配置
 * - 主题相关默认配置
 * - 界面显示默认配置
 * - 功能开关默认配置
 * - 样式相关默认配置
 *
 * ## 注意事项
 *
 * 1. 修改此文件的配置项时，需要同步更新以下文件：
 *    - src/components/core/layouts/art-settings-panel/widget/SettingActions.vue（复制配置和重置配置逻辑）
 *    - src/store/modules/setting.ts（Store 状态定义）
 * 2. 可以通过设置面板的"复制配置"按钮快速生成配置代码
 * 3. 枚举类型的值需要与 src/enums/appEnum.ts 中的定义保持一致
 */

import AppConfig from '@/config'
import { SystemThemeEnum, MenuThemeEnum, MenuTypeEnum, ContainerWidthEnum } from '@/enums/appEnum'

/**
 * 系统设置默认值配置
 */
export const SETTING_DEFAULT_CONFIG = {
  /** 菜单类型 */
  menuType: MenuTypeEnum.LEFT,
  /** 菜单展开宽度 */
  menuOpenWidth: 230,
  /** 菜单是否展开 */
  menuOpen: true,
  /** 双菜单是否显示文本 */
  dualMenuShowText: false,
  /** 系统主题类型 */
  systemThemeType: SystemThemeEnum.AUTO,
  /** 系统主题模式 */
  systemThemeMode: SystemThemeEnum.AUTO,
  /** 菜单风格 */
  menuThemeType: MenuThemeEnum.DESIGN,
  /** 系统主题颜色 */
  systemThemeColor: AppConfig.systemMainColor[0],
  /** 是否显示菜单按钮 */
  showMenuButton: true,
  /** 是否显示快速入口 */
  showFastEnter: true,
  /** 是否显示刷新按钮 */
  showRefreshButton: true,
  /** 是否显示面包屑 */
  showCrumbs: true,
  /** 是否显示工作台标签 */
  showWorkTab: true,
  /** 是否显示语言切换 */
  showLanguage: true,
  /** 是否显示进度条 */
  showNprogress: false,
  /** 是否显示设置引导 */
  showSettingGuide: true,
  /** 是否显示节日文本 */
  showFestivalText: false,
  /** 是否显示水印 */
  watermarkVisible: false,
  /** 是否自动关闭 */
  autoClose: false,
  /** 是否唯一展开 */
  uniqueOpened: true,
  /** 是否色弱模式 */
  colorWeak: false,
  /** 是否刷新 */
  refresh: false,
  /** 是否加载节日烟花 */
  holidayFireworksLoaded: false,
  /** 边框模式 */
  boxBorderMode: true,
  /** 页面过渡效果 */
  pageTransition: 'slide-left',
  /** 标签页样式 */
  tabStyle: 'tab-default',
  /** 自定义圆角 */
  customRadius: '0.75',
  /** 容器宽度 */
  containerWidth: ContainerWidthEnum.FULL,
  /** 节日日期 */
  festivalDate: ''
}

/**
 * 获取设置默认值
 * @returns 设置默认值对象
 */
export function getSettingDefaults() {
  return { ...SETTING_DEFAULT_CONFIG }
}

/**
 * 重置为默认设置
 * @param currentSettings 当前设置对象
 */
export function resetToDefaults(currentSettings: Record<string, any>) {
  const defaults = getSettingDefaults()
  Object.keys(defaults).forEach((key) => {
    if (key in currentSettings) {
      currentSettings[key] = defaults[key as keyof typeof defaults]
    }
  })
}
