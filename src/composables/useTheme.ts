import { useSettingStore } from '@/store/modules/setting'
import { SystemThemeEnum } from '@/enums/appEnum'
import { SystemThemeStyles } from '@/config/setting'
import { SystemThemeTypes } from '@/types/store'
import { getDarkColor, getLightColor } from '@/utils/color'

export function useTheme() {
  const settingStore = useSettingStore()

  const setSystemTheme = (theme: SystemThemeEnum, themeMode?: SystemThemeEnum) => {
    const el = document.getElementsByTagName('html')[0]
    const isDark = theme === SystemThemeEnum.DARK

    if (!themeMode) {
      themeMode = theme
    }

    const currentTheme = SystemThemeStyles[theme as keyof SystemThemeTypes]

    if (currentTheme) {
      el.setAttribute('class', currentTheme.className)
    }

    // 设置按钮颜色加深或变浅
    const primary = settingStore.systemThemeColor

    for (let i = 1; i <= 9; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        isDark ? `${getDarkColor(primary, i / 10)}` : `${getLightColor(primary, i / 10)}`
      )
    }

    // 更新store中的主题设置
    settingStore.setGlopTheme(theme, themeMode)
  }

  // 自动设置系统主题
  const setSystemAutoTheme = () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setSystemTheme(SystemThemeEnum.DARK, SystemThemeEnum.AUTO)
    } else {
      setSystemTheme(SystemThemeEnum.LIGHT, SystemThemeEnum.AUTO)
    }
  }

  // 切换主题
  const switchTheme = (theme: SystemThemeEnum) => {
    if (theme === SystemThemeEnum.AUTO) {
      setSystemAutoTheme()
    } else {
      setSystemTheme(theme)
    }
  }

  return {
    setSystemTheme,
    setSystemAutoTheme,
    switchTheme
  }
}
