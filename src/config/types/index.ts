import { MenuTypeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { MenuThemeType, SystemThemeTypes } from '@/types/store'

// 主题设置
export interface ThemeSetting {
  name: string
  theme: SystemThemeEnum
  color: string[]
  leftLineColor: string
  rightLineColor: string
  img: string
}

// 菜单布局
export interface MenuLayout {
  name: string
  value: MenuTypeEnum
  img: string
}

// 系统配置
export interface SystemConfig {
  elementPlusTheme: { primary: string }
  systemInfo: {
    name: string
    login: { username: string; password: string }
  }
  systemThemeStyles: SystemThemeTypes
  settingThemeList: ThemeSetting[]
  menuLayoutList: MenuLayout[]
  themeList: MenuThemeType[]
  darkMenuStyles: MenuThemeType[]
  systemMainColor: readonly string[]
  systemSetting: {
    defaultMenuWidth: number
    defaultCustomRadius: string
    defaultTabStyle: string
  }
}
