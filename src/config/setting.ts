import { MenuThemeEnum, MenuTypeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { MenuThemeType, SystemThemeTypes } from '@/types/store'

// Element plus theme
export const ElementPlusTheme = {
  primary: '#5D87FF'
}

// 系统信息
export const SystemInfo = {
  // 系统名称
  name: 'Art Design Pro',
  // 登录默认帐号、密码
  login: {
    username: 'admin',
    password: '123456'
  }
}

// 系统主题样式（light | dark）
export const SystemThemeStyles: SystemThemeTypes = {
  [SystemThemeEnum.LIGHT]: {
    className: ''
  },
  [SystemThemeEnum.DARK]: {
    className: SystemThemeEnum.DARK
  }
}

import theme_styles_light from '@imgs/settings/theme_styles/light.png'
import theme_styles_dark from '@imgs/settings/theme_styles/dark.png'
import theme_styles_system from '@imgs/settings/theme_styles/system.png'

// 设置中心主题列表
export const SettingThemeList = [
  {
    name: '浅色',
    theme: SystemThemeEnum.LIGHT,
    color: ['#fff', '#fff'],
    leftLineColor: '#EDEEF0',
    rightLineColor: '#EDEEF0',
    img: theme_styles_light
  },
  {
    name: '深色',
    theme: SystemThemeEnum.DARK,
    color: ['#22252A'],
    leftLineColor: '#3F4257',
    rightLineColor: '#3F4257',
    img: theme_styles_dark
  },
  {
    name: '系统',
    theme: SystemThemeEnum.AUTO,
    color: ['#fff', '#22252A'],
    leftLineColor: '#EDEEF0',
    rightLineColor: '#3F4257',
    img: theme_styles_system
  }
]

import menu_layout_vertical from '@imgs/settings/menu_layouts/vertical.png'
import menu_layout_horizontal from '@imgs/settings/menu_layouts/horizontal.png'
import menu_layout_mixed from '@imgs/settings/menu_layouts/mixed.png'
import menu_layout_dual_column from '@imgs/settings/menu_layouts/dual_column.png'

// 菜单布局
export const menuLayoutList = [
  {
    name: '左侧',
    value: MenuTypeEnum.LEFT,
    img: menu_layout_vertical
  },
  {
    name: '顶部',
    value: MenuTypeEnum.TOP,
    img: menu_layout_horizontal
  },
  {
    name: '混合',
    value: MenuTypeEnum.TOP_LEFT,
    img: menu_layout_mixed
  },
  {
    name: '双列',
    value: MenuTypeEnum.DUAL_MENU,
    img: menu_layout_dual_column
  }
]

import menu_style_design from '@imgs/settings/menu_styles/design.png'
import menu_style_dark from '@imgs/settings/menu_styles/dark.png'
import menu_style_light from '@imgs/settings/menu_styles/light.png'

// 菜单样式
export const ThemeList: MenuThemeType[] = [
  {
    theme: MenuThemeEnum.DESIGN,
    background: '#FFFFFF',
    systemNameColor: 'var(--art-text-gray-800)',
    iconColor: '#6B6B6B',
    textColor: '#29343D',
    textActiveColor: '#3F8CFF',
    iconActiveColor: '#333333',
    tabBarBackground: '#FAFBFC',
    systemBackground: '#FAFBFC',
    leftLineColor: '#EDEEF0',
    rightLineColor: '#EDEEF0',
    img: menu_style_design
  },
  {
    theme: MenuThemeEnum.DARK,
    background: '#191A23',
    systemNameColor: '#BABBBD',
    iconColor: '#BABBBD',
    textColor: '#BABBBD',
    textActiveColor: '#FFFFFF',
    iconActiveColor: '#FFFFFF',
    tabBarBackground: '#FFFFFF',
    systemBackground: '#F8F8F8',
    leftLineColor: '#3F4257',
    rightLineColor: '#EDEEF0',
    img: menu_style_dark
  },
  {
    theme: MenuThemeEnum.LIGHT,
    background: '#ffffff',
    systemNameColor: '#68758E',
    iconColor: '#6B6B6B',
    textColor: '#29343D',
    textActiveColor: '#3F8CFF',
    iconActiveColor: '#333333',
    tabBarBackground: '#FFFFFF',
    systemBackground: '#F8F8F8',
    leftLineColor: '#EDEEF0',
    rightLineColor: '#EDEEF0',
    img: menu_style_light
  }
]

// dark 模式下 菜单样式
export const DarkMenuStyles: MenuThemeType[] = [
  {
    theme: MenuThemeEnum.DARK,
    background: '#161618',
    systemNameColor: '#DDDDDD',
    iconColor: '#BABBBD',
    textColor: 'rgba(#FFFFFF, 0.7)',
    textActiveColor: '',
    iconActiveColor: '#FFFFFF',
    tabBarBackground: '#FFFFFF',
    systemBackground: '#F8F8F8',
    leftLineColor: '#3F4257',
    rightLineColor: '#EDEEF0'
  }
]

// 系统主色
export const SystemMainColor = [
  '#5D87FF',
  '#B48DF3',
  '#1D84FF',
  '#60C041',
  '#38C0FC',
  '#F9901F',
  '#FF80C8'
]

// 系统设置中心配置
export const SystemSetting = {
  defaultMenuWidth: 252, // 菜单展开宽度默认值
  defaultCustomRadius: '0.75' // 圆角默认值
}
