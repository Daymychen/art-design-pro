import { MenuThemeEnum, MenuTypeEnum, SystemThemeEnum } from '@/enums/appEnum'
import { configImages } from '../assets/images'
import { SystemConfig } from '../types'

// 创建基础配置
export const createBaseConfig = (): SystemConfig => ({
  // 系统信息
  systemInfo: {
    name: 'Art Design Pro',
    login: {
      username: 'admin',
      password: '123456'
    }
  },
  // Element Plus 主题
  elementPlusTheme: {
    primary: '#5D87FF'
  },
  // 系统主题
  systemThemeStyles: {
    [SystemThemeEnum.LIGHT]: { className: '' },
    [SystemThemeEnum.DARK]: { className: SystemThemeEnum.DARK }
  },
  // 系统主题列表
  settingThemeList: [
    {
      name: 'Light',
      theme: SystemThemeEnum.LIGHT,
      color: ['#fff', '#fff'],
      leftLineColor: '#EDEEF0',
      rightLineColor: '#EDEEF0',
      img: configImages.themeStyles.light
    },
    {
      name: 'Dark',
      theme: SystemThemeEnum.DARK,
      color: ['#22252A'],
      leftLineColor: '#3F4257',
      rightLineColor: '#3F4257',
      img: configImages.themeStyles.dark
    },
    {
      name: 'System',
      theme: SystemThemeEnum.AUTO,
      color: ['#fff', '#22252A'],
      leftLineColor: '#EDEEF0',
      rightLineColor: '#3F4257',
      img: configImages.themeStyles.system
    }
  ],
  // 菜单布局列表
  menuLayoutList: [
    { name: 'Left', value: MenuTypeEnum.LEFT, img: configImages.menuLayouts.vertical },
    { name: 'Top', value: MenuTypeEnum.TOP, img: configImages.menuLayouts.horizontal },
    { name: 'Mixed', value: MenuTypeEnum.TOP_LEFT, img: configImages.menuLayouts.mixed },
    { name: 'Dual Column', value: MenuTypeEnum.DUAL_MENU, img: configImages.menuLayouts.dualColumn }
  ],
  // 菜单主题列表
  themeList: [
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
      img: configImages.menuStyles.design
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
      img: configImages.menuStyles.dark
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
      img: configImages.menuStyles.light
    }
  ],

  darkMenuStyles: [
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
  ],
  // 系统主色
  systemMainColor: [
    '#5D87FF',
    '#B48DF3',
    '#1D84FF',
    '#60C041',
    '#38C0FC',
    '#F9901F',
    '#FF80C8'
  ] as const,
  // 系统其他项默认配置
  systemSetting: {
    defaultMenuWidth: 252, // 菜单宽度
    defaultCustomRadius: '0.75', // 自定义圆角
    defaultTabStyle: 'tab-default' // 标签样式
  }
})
