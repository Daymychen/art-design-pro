/**
 * 配置初始化模块
 *
 * 从 JSON 配置创建应用配置对象
 *
 * @module config/init
 * @author Art Design Pro Team
 */

import { MenuThemeEnum, MenuTypeEnum, SystemThemeEnum } from '@/enums/appEnum'
import type { SystemConfig } from '@/types/config'
import { configImages } from './assets/images'
import fastEnterConfig from './modules/fastEnter'
import { headerBarConfig } from './modules/headerBar'
import { getConfig } from '@/utils/config/config-loader'

/**
 * 创建应用配置
 * 从 JSON 配置中读取并转换为应用配置对象
 */
export function createAppConfig(): SystemConfig {
  const config = getConfig()

  return {
    // 系统信息
    systemInfo: config.systemInfo || {
      name: 'Art Design Pro'
    },

    // 系统主题样式
    systemThemeStyles: {
      [SystemThemeEnum.LIGHT]: { className: '' },
      [SystemThemeEnum.DARK]: { className: SystemThemeEnum.DARK }
    },

    // 系统主题列表
    settingThemeList: (
      config.settingThemeList || [
        {
          name: 'Light',
          theme: 'light',
          color: ['#fff', '#fff'],
          leftLineColor: '#EDEEF0',
          rightLineColor: '#EDEEF0'
        },
        {
          name: 'Dark',
          theme: 'dark',
          color: ['#22252A'],
          leftLineColor: '#3F4257',
          rightLineColor: '#3F4257'
        },
        {
          name: 'System',
          theme: 'auto',
          color: ['#fff', '#22252A'],
          leftLineColor: '#EDEEF0',
          rightLineColor: '#3F4257'
        }
      ]
    ).map((item: any, index: number) => ({
      ...item,
      theme:
        item.theme === 'light'
          ? SystemThemeEnum.LIGHT
          : item.theme === 'dark'
            ? SystemThemeEnum.DARK
            : SystemThemeEnum.AUTO,
      img: [
        configImages.themeStyles.light,
        configImages.themeStyles.dark,
        configImages.themeStyles.system
      ][index]
    })),

    // 菜单布局列表
    menuLayoutList: (
      config.menuLayoutList || [
        { name: 'Left', value: 'left' },
        { name: 'Top', value: 'top' },
        { name: 'Mixed', value: 'top-left' },
        { name: 'Dual Column', value: 'dual-menu' }
      ]
    ).map((item: any, index: number) => ({
      ...item,
      value:
        item.value === 'left'
          ? MenuTypeEnum.LEFT
          : item.value === 'top'
            ? MenuTypeEnum.TOP
            : item.value === 'top-left'
              ? MenuTypeEnum.TOP_LEFT
              : MenuTypeEnum.DUAL_MENU,
      img: [
        configImages.menuLayouts.vertical,
        configImages.menuLayouts.horizontal,
        configImages.menuLayouts.mixed,
        configImages.menuLayouts.dualColumn
      ][index]
    })),

    // 菜单主题列表
    themeList: (
      config.themeList || [
        {
          theme: 'design',
          background: '#FFFFFF',
          systemNameColor: 'var(--art-gray-800)',
          iconColor: '#6B6B6B',
          textColor: '#29343D'
        },
        {
          theme: 'dark',
          background: '#191A23',
          systemNameColor: '#D9DADB',
          iconColor: '#BABBBD',
          textColor: '#BABBBD'
        },
        {
          theme: 'light',
          background: '#ffffff',
          systemNameColor: 'var(--art-gray-800)',
          iconColor: '#6B6B6B',
          textColor: '#29343D'
        }
      ]
    ).map((item: any, index: number) => ({
      ...item,
      theme:
        item.theme === 'design'
          ? MenuThemeEnum.DESIGN
          : item.theme === 'dark'
            ? MenuThemeEnum.DARK
            : MenuThemeEnum.LIGHT,
      img: [
        configImages.menuStyles.design,
        configImages.menuStyles.dark,
        configImages.menuStyles.light
      ][index]
    })),

    // 暗黑模式菜单样式
    darkMenuStyles: (
      config.darkMenuStyles || [
        {
          theme: 'dark',
          background: 'var(--default-box-color)',
          systemNameColor: '#DDDDDD',
          iconColor: '#BABBBD',
          textColor: 'rgba(#FFFFFF, 0.7)'
        }
      ]
    ).map((item: any) => ({
      ...item,
      theme: MenuThemeEnum.DARK
    })),

    // 系统主色
    systemMainColor: (config.systemMainColor || [
      '#5D87FF',
      '#B48DF3',
      '#1D84FF',
      '#60C041',
      '#38C0FC',
      '#F9901F',
      '#FF80C8'
    ]) as any,

    // 快速入口配置
    fastEnter: fastEnterConfig,

    // 顶部栏功能配置
    headerBar: headerBarConfig
  }
}
