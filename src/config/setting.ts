import { MenuThemeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { MenuThemeType, SystemThemeTypes } from '@/types/store'

// Element plus theme
export const ElementPlusTheme = {
  primary: '#1485FF'
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
    className: '',
    backgroundColor: '#FCFCFC',
    mainBgColor: '#FFFFFF',
    borderColor: '#ECEEF6',
    borderColor2: '#D9D9D9',
    hoverBtnColor: '#F8F8F8',
    gradientBorder: '0px solid transparent',
    selectedColor: '#F4F4F5'
  },
  [SystemThemeEnum.DARK]: {
    className: SystemThemeEnum.DARK,
    backgroundColor: '#070707',
    mainBgColor: '#161618',
    borderColor: '#28282A',
    borderColor2: '#4C4D50',
    hoverBtnColor: '#070707',
    gradientBorder: '1px solid transparent',
    selectedColor: '#27272A'
  }
}

// 设置中心主题列表
export const SettingThemeList = [
  {
    name: '浅色',
    theme: SystemThemeEnum.LIGHT,
    color: ['#fff', '#fff'],
    leftLineColor: '#EDEEF0',
    rightLineColor: '#EDEEF0'
  },
  {
    name: '深色',
    theme: SystemThemeEnum.DARK,
    color: ['#22252A'],
    leftLineColor: '#3F4257',
    rightLineColor: '#3F4257'
  },
  {
    name: '系统',
    theme: SystemThemeEnum.AUTO,
    color: ['#fff', '#22252A'],
    leftLineColor: '#EDEEF0',
    rightLineColor: '#3F4257'
  }
]

// 菜单样式
export const ThemeList: MenuThemeType[] = [
  {
    theme: MenuThemeEnum.DESIGN,
    background: '#FCFCFC',
    systemNameColor: '#000000',
    iconColor: '#545F73',
    textColor: '#545F73',
    textActiveColor: '#3F8CFF',
    iconActiveColor: '#333333',
    tabBarBackground: '#FAFBFC',
    systemBackground: '#FAFBFC',
    leftLineColor: '#EDEEF0',
    rightLineColor: '#EDEEF0'
  },
  {
    theme: MenuThemeEnum.DARK,
    background: '#191A23',
    systemNameColor: '#BABBBD',
    iconColor: '#BABBBD',
    textColor: '#BABBBD',
    textActiveColor: '#D9D9D9',
    iconActiveColor: '#FFFFFF',
    tabBarBackground: '#FFFFFF',
    systemBackground: '#F8F8F8',
    leftLineColor: '#3F4257',
    rightLineColor: '#EDEEF0'
  },
  {
    theme: MenuThemeEnum.LIGHT,
    background: '#ffffff',
    systemNameColor: '#68758E',
    iconColor: '#68758E',
    textColor: '#68758E',
    textActiveColor: '#3F8CFF',
    iconActiveColor: '#333333',
    tabBarBackground: '#FFFFFF',
    systemBackground: '#F8F8F8',
    leftLineColor: '#EDEEF0',
    rightLineColor: '#EDEEF0'
  }
]

// dark 模式下 菜单样式
export const DarkMenuStyles: MenuThemeType[] = [
  {
    theme: MenuThemeEnum.DARK,
    background: '#161618',
    systemNameColor: '#BABBBD',
    iconColor: '#BABBBD',
    textColor: '#999999',
    textActiveColor: '#ddd',
    iconActiveColor: '#FFFFFF',
    tabBarBackground: '#FFFFFF',
    systemBackground: '#F8F8F8',
    leftLineColor: '#3F4257',
    rightLineColor: '#EDEEF0'
  }
]

// 系统主色
export const SystemMainColor = [
  '#1485FF',
  '#5D87FF',
  '#9071E9',
  '#F98B16',
  '#63BA46',
  '#00C3EE',
  '#FD6975'
]
