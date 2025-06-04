import { install } from '@icon-park/vue-next/es/all'
import '@icon-park/vue-next/styles/index.css'
import { App } from 'vue'
import * as IconPark from '@icon-park/vue-next'

// 定义图标类型
export type IconType = 'outline' | 'filled' | 'two-tone' | 'multi-color'

// 自定义主题配置
export const IconParkTheme = {
  outline: {
    fill: 'currentColor',
    size: 1
  },
  filled: {
    fill: 'currentColor',
    size: 1
  },
  'two-tone': {
    // 双色模式下的主色
    fill: ['currentColor', 'var(--art-text-gray-300)'],
    size: 1
  },
  'multi-color': {
    // 多色模式下的主色
    fill: [
      'currentColor',
      'var(--art-text-gray-300)',
      'var(--art-text-gray-500)',
      'var(--art-text-gray-700)'
    ],
    size: 1
  }
}

// 初始化IconPark
export function setupIconPark(app: App) {
  // 设置默认的图标类型
  install(app, IconParkTheme as any)
}

// 提取IconPark图标列表
type IconParkType = typeof IconPark & {
  [key: string]: any
}

const IconParkLib = IconPark as IconParkType

// 所有图标类型
export const iconTypes: IconType[] = ['outline', 'filled', 'two-tone', 'multi-color']

// 从IconPark中提取所有图标组件
export function getAllIconParkIcons() {
  const icons = []
  for (const key in IconPark) {
    // 只保留首字母大写且为函数或对象的项(图标组件名称都是首字母大写的)
    if (
      typeof IconParkLib[key] === 'object' &&
      !['install', 'IconProvider', 'default'].includes(key)
    ) {
      icons.push({ name: key })
    }
  }
  return icons
}
