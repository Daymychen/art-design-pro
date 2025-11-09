/**
 * 表单响应式布局工具模块
 *
 * 提供表单项在不同屏幕尺寸下的智能布局计算
 *
 * ## 主要功能
 *
 * - 响应式断点管理（xs/sm/md/lg/xl）
 * - 表单列宽自动降级（避免小屏幕压缩）
 * - 基于阈值的智能 span 计算
 * - 响应式计算器工厂函数
 * - 可配置的断点规则
 *
 * ## 使用场景
 *
 * - 表单组件响应式布局
 * - 搜索表单自适应
 * - 移动端表单优化
 * - 多列表单布局
 *
 * ## 断点说明（基于 Element Plus Grid 24 栅格系统）：
 * - xs (手机): < 768px，小于 12 时降级为 24（满宽）
 * - sm (平板): ≥ 768px，小于 12 时降级为 12（半宽）
 * - md (中等屏幕): ≥ 992px，小于 8 时降级为 8（三分之一宽）
 * - lg (大屏幕): ≥ 1200px，直接使用设置的 span
 * - xl (超大屏幕): ≥ 1920px，直接使用设置的 span
 *
 * ## 核心功能
 *
 * - calculateResponsiveSpan: 计算响应式列宽
 * - createResponsiveSpanCalculator: 创建 span 计算器（柯里化）
 *
 * @module utils/form/responsive
 * @author Art Design Pro Team
 */

/**
 * 响应式断点类型
 */
export type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * 断点配置映射
 */
interface BreakpointConfig {
  /** 最小 span 阈值 */
  threshold: number
  /** 降级后的 span 值 */
  fallback: number
}

/**
 * 响应式断点配置
 */
const BREAKPOINT_CONFIG: Record<ResponsiveBreakpoint, BreakpointConfig | null> = {
  xs: { threshold: 12, fallback: 24 }, // 手机：小于 12 时使用满宽
  sm: { threshold: 12, fallback: 12 }, // 平板：小于 12 时使用半宽
  md: { threshold: 8, fallback: 8 }, // 中等屏幕：小于 8 时使用三分之一宽
  lg: null, // 大屏幕：直接使用设置的 span
  xl: null // 超大屏幕：直接使用设置的 span
}

/**
 * 计算响应式列宽
 *
 * 根据屏幕尺寸智能降级，避免小屏幕上表单项被压缩过小
 *
 * @param itemSpan 表单项自定义的 span 值
 * @param defaultSpan 默认的 span 值
 * @param breakpoint 当前断点
 * @returns 计算后的 span 值
 *
 * @example
 * ```ts
 * // 在 xs 断点下，span 为 6 会降级为 24（满宽）
 * calculateResponsiveSpan(6, 6, 'xs') // 24
 *
 * // 在 md 断点下，span 为 6 会降级为 8（三分之一宽）
 * calculateResponsiveSpan(6, 6, 'md') // 8
 *
 * // 在 lg 断点下，直接使用原始 span
 * calculateResponsiveSpan(6, 6, 'lg') // 6
 * ```
 */
export function calculateResponsiveSpan(
  itemSpan: number | undefined,
  defaultSpan: number,
  breakpoint: ResponsiveBreakpoint
): number {
  const finalSpan = itemSpan ?? defaultSpan
  const config = BREAKPOINT_CONFIG[breakpoint]

  // 如果没有配置（lg/xl），直接返回原始 span
  if (!config) {
    return finalSpan
  }

  // 如果 span 小于阈值，使用降级值
  return finalSpan >= config.threshold ? finalSpan : config.fallback
}

/**
 * 创建响应式 span 计算器
 *
 * 返回一个函数，用于计算指定断点下的 span 值
 *
 * @param defaultSpan 默认的 span 值
 * @returns span 计算函数
 *
 * @example
 * ```ts
 * const getColSpan = createResponsiveSpanCalculator(6)
 * getColSpan(undefined, 'xs') // 24
 * getColSpan(8, 'md') // 8
 * getColSpan(12, 'lg') // 12
 * ```
 */
export function createResponsiveSpanCalculator(defaultSpan: number) {
  return (itemSpan: number | undefined, breakpoint: ResponsiveBreakpoint): number => {
    return calculateResponsiveSpan(itemSpan, defaultSpan, breakpoint)
  }
}
