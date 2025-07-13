/**
 * 顶部栏功能配置
 * 控制顶部栏各种功能的启用/禁用状态
 */

import { HeaderBarFeatureConfig } from '@/types'

// 顶部栏功能配置
export const headerBarConfig: HeaderBarFeatureConfig = {
  menuButton: {
    enabled: true,
    description: '控制左侧菜单的展开/收起按钮'
  },
  refreshButton: {
    enabled: true,
    description: '页面刷新按钮'
  },
  fastEnter: {
    enabled: true,
    description: '快速入口功能，提供常用应用和链接的快速访问'
  },
  breadcrumb: {
    enabled: true,
    description: '面包屑导航，显示当前页面路径'
  },
  globalSearch: {
    enabled: true,
    description: '全局搜索功能，支持快捷键 Ctrl+K 或 Cmd+K'
  },
  fullscreen: {
    enabled: true,
    description: '全屏切换功能'
  },
  notification: {
    enabled: true,
    description: '通知中心，显示系统通知和消息'
  },
  chat: {
    enabled: true,
    description: '聊天功能，提供实时沟通'
  },
  language: {
    enabled: true,
    description: '多语言切换功能'
  },
  settings: {
    enabled: true,
    description: '系统设置面板'
  },
  themeToggle: {
    enabled: true,
    description: '主题切换功能（明暗主题）'
  }
}

export default headerBarConfig
