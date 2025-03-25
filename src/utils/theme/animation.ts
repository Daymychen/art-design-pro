import { useCommon } from '@/composables/useCommon'
import { useTheme } from '@/composables/useTheme'
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
