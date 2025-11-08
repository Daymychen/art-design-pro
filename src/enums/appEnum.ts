/**
 * 系统级别枚举定义模块
 *
 * ## 主要功能
 *
 * - 菜单类型枚举（左侧、顶部、混合、双栏）
 * - 主题类型枚举（亮色、暗色、自动）
 * - 菜单主题枚举（设计、亮色、暗色）
 * - 语言类型枚举（中文、英文）
 * - 容器宽度枚举（全屏、固定）
 * - 菜单宽度枚举（收起宽度）
 *
 * @module enums/appEnum
 * @author Art Design Pro Team
 */

/**
 * 菜单类型
 */
export enum MenuTypeEnum {
  /** 左侧菜单 */
  LEFT = 'left',
  /** 顶部菜单 */
  TOP = 'top',
  /** 顶部+左侧菜单 */
  TOP_LEFT = 'top-left',
  /** 双栏菜单 */
  DUAL_MENU = 'dual-menu'
}

/**
 * 系统主题
 */
export enum SystemThemeEnum {
  /** 暗色主题 */
  DARK = 'dark',
  /** 亮色主题 */
  LIGHT = 'light',
  /** 自动主题（跟随系统） */
  AUTO = 'auto'
}

/**
 * 菜单主题
 */
export enum MenuThemeEnum {
  /** 暗色主题 */
  DARK = 'dark',
  /** 亮色主题 */
  LIGHT = 'light',
  /** 设计主题 */
  DESIGN = 'design'
}

/**
 * 菜单宽度
 */
export enum MenuWidth {
  /** 收起宽度 */
  CLOSE = '64px'
}

/**
 * 语言类型
 */
export enum LanguageEnum {
  /** 中文 */
  ZH = 'zh',
  /** 英文 */
  EN = 'en'
}

/**
 * 容器宽度
 */
export enum ContainerWidthEnum {
  /** 全屏宽度 */
  FULL = '100%',
  /** 固定宽度 */
  BOXED = '1200px'
}
