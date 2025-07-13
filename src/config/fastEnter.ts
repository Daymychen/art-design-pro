/**
 * 快速入口配置
 * 包含：应用列表、快速链接等配置
 */
import { RoutesAlias } from '@/router/routesAlias'
import { WEB_LINKS } from '@/utils/constants'
import type { FastEnterConfig } from '@/types/config'

const fastEnterConfig: FastEnterConfig = {
  // 显示条件（屏幕宽度）
  minWidth: 1200,
  // 应用列表
  applications: [
    {
      name: '工作台',
      description: '系统概览与数据统计',
      icon: '&#xe721;',
      iconColor: '#377dff',
      path: RoutesAlias.Dashboard,
      enabled: true,
      order: 1
    },
    {
      name: '分析页',
      description: '数据分析与可视化',
      icon: '&#xe812;',
      iconColor: '#ff3b30',
      path: RoutesAlias.Analysis,
      enabled: true,
      order: 2
    },
    {
      name: '礼花效果',
      description: '动画特效展示',
      icon: '&#xe7ed;',
      iconColor: '#7A7FFF',
      path: RoutesAlias.Fireworks,
      enabled: true,
      order: 3
    },
    {
      name: '聊天',
      description: '即时通讯功能',
      icon: '&#xe70a;',
      iconColor: '#13DEB9',
      path: RoutesAlias.Chat,
      enabled: true,
      order: 4
    },
    {
      name: '官方文档',
      description: '使用指南与开发文档',
      icon: '&#xe788;',
      iconColor: '#ffb100',
      path: WEB_LINKS.DOCS,
      enabled: true,
      order: 5
    },
    {
      name: '技术支持',
      description: '技术支持与问题反馈',
      icon: '&#xe86e;',
      iconColor: '#ff6b6b',
      path: WEB_LINKS.COMMUNITY,
      enabled: true,
      order: 6
    },
    {
      name: '更新日志',
      description: '版本更新与变更记录',
      icon: '&#xe81c;',
      iconColor: '#38C0FC',
      path: RoutesAlias.ChangeLog,
      enabled: true,
      order: 7
    },
    {
      name: '哔哩哔哩',
      description: '技术分享与交流',
      icon: '&#xe6b4;',
      iconColor: '#FB7299',
      path: WEB_LINKS.BILIBILI,
      enabled: true,
      order: 8
    }
  ],
  // 快速链接
  quickLinks: [
    {
      name: '登录',
      path: RoutesAlias.Login,
      enabled: true,
      order: 1
    },
    {
      name: '注册',
      path: RoutesAlias.Register,
      enabled: true,
      order: 2
    },
    {
      name: '忘记密码',
      path: RoutesAlias.ForgetPassword,
      enabled: true,
      order: 3
    },
    {
      name: '定价',
      path: RoutesAlias.Pricing,
      enabled: true,
      order: 4
    },
    {
      name: '个人中心',
      path: RoutesAlias.UserCenter,
      enabled: true,
      order: 5
    },
    {
      name: '留言管理',
      path: RoutesAlias.Comment,
      enabled: true,
      order: 6
    }
  ]
}

export default Object.freeze(fastEnterConfig)
