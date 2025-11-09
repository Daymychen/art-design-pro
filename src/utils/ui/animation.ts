/**
 * 主题动画工具模块
 *
 * 提供主题切换的视觉动画效果
 *
 * ## 主要功能
 *
 * - 基于鼠标点击位置的圆形扩散动画
 * - View Transition API 支持（现代浏览器）
 * - 降级处理（不支持动画的浏览器）
 * - 暗黑主题切换过渡效果
 * - 页面刷新时的主题过渡优化
 *
 * ## 使用场景
 *
 * - 明暗主题切换
 * - 提升用户体验的视觉反馈
 * - 页面刷新时的平滑过渡
 *
 * ## 技术实现
 *
 * - 使用 CSS 变量存储点击位置和半径
 * - 利用 View Transition API 实现流畅动画
 * - 通过 CSS class 控制过渡效果
 * - 自动计算最大扩散半径
 *
 * @module utils/theme/animation
 * @author Art Design Pro Team
 */
import { useCommon } from '@/hooks/core/useCommon'
import { useTheme } from '@/hooks/core/useTheme'
import { SystemThemeEnum } from '@/enums/appEnum'
import { useSettingStore } from '@/store/modules/setting'
const { LIGHT, DARK } = SystemThemeEnum

/**
 * 主题切换动画
 * @param e 鼠标点击事件
 */
export const themeAnimation = (e: any) => {
  const x = e.clientX
  const y = e.clientY
  // 计算鼠标点击位置距离视窗的最大圆半径
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  // 设置CSS变量
  document.documentElement.style.setProperty('--x', x + 'px')
  document.documentElement.style.setProperty('--y', y + 'px')
  document.documentElement.style.setProperty('--r', endRadius + 'px')

  if (document.startViewTransition) {
    document.startViewTransition(() => toggleTheme())
  } else {
    toggleTheme()
  }
}

/**
 * 切换主题
 */
const toggleTheme = () => {
  useTheme().switchThemeStyles(useSettingStore().systemThemeType === LIGHT ? DARK : LIGHT)
  useCommon().refresh()
}

/**
 * 切换主题过渡效果
 * @param enable 是否启用过渡效果
 */
export const toggleTransition = (enable: boolean) => {
  const body = document.body

  if (enable) {
    body.classList.add('theme-change')
  } else {
    setTimeout(() => {
      body.classList.remove('theme-change')
    }, 300)
  }
}
