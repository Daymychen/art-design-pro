// scripts/clean-dev.ts
import fs from 'fs/promises'
import path from 'path'

// 现代化颜色主题
const theme = {
  // 基础颜色
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  // 前景色
  primary: '\x1b[38;5;75m', // 亮蓝色
  success: '\x1b[38;5;82m', // 亮绿色
  warning: '\x1b[38;5;220m', // 亮黄色
  error: '\x1b[38;5;196m', // 亮红色
  info: '\x1b[38;5;159m', // 青色
  purple: '\x1b[38;5;141m', // 紫色
  orange: '\x1b[38;5;208m', // 橙色
  gray: '\x1b[38;5;245m', // 灰色
  white: '\x1b[38;5;255m', // 白色

  // 背景色
  bgDark: '\x1b[48;5;235m', // 深灰背景
  bgBlue: '\x1b[48;5;24m', // 蓝色背景
  bgGreen: '\x1b[48;5;22m', // 绿色背景
  bgRed: '\x1b[48;5;52m' // 红色背景
}

// 现代化图标集
const icons = {
  rocket: '🚀',
  fire: '🔥',
  star: '⭐',
  gem: '💎',
  crown: '👑',
  magic: '✨',
  warning: '⚠️',
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  folder: '📁',
  file: '📄',
  image: '🖼️',
  code: '💻',
  data: '📊',
  globe: '🌐',
  map: '🗺️',
  chat: '💬',
  bolt: '⚡',
  shield: '🛡️',
  key: '🔑',
  link: '🔗',
  clean: '🧹',
  trash: '🗑️',
  check: '✓',
  cross: '✗',
  arrow: '→',
  loading: '⏳'
}

// 格式化工具
const fmt = {
  title: (text: string) => `${theme.bold}${theme.primary}${text}${theme.reset}`,
  subtitle: (text: string) => `${theme.purple}${text}${theme.reset}`,
  success: (text: string) => `${theme.success}${text}${theme.reset}`,
  error: (text: string) => `${theme.error}${text}${theme.reset}`,
  warning: (text: string) => `${theme.warning}${text}${theme.reset}`,
  info: (text: string) => `${theme.info}${text}${theme.reset}`,
  highlight: (text: string) => `${theme.bold}${theme.white}${text}${theme.reset}`,
  dim: (text: string) => `${theme.dim}${theme.gray}${text}${theme.reset}`,
  orange: (text: string) => `${theme.orange}${text}${theme.reset}`,

  // 带背景的文本
  badge: (text: string, bg: string = theme.bgBlue) =>
    `${bg}${theme.white}${theme.bold} ${text} ${theme.reset}`,

  // 渐变效果模拟
  gradient: (text: string) => {
    const colors = ['\x1b[38;5;75m', '\x1b[38;5;81m', '\x1b[38;5;87m', '\x1b[38;5;159m']
    const chars = text.split('')
    return chars.map((char, i) => `${colors[i % colors.length]}${char}`).join('') + theme.reset
  }
}

// 创建现代化标题横幅
function createModernBanner() {
  console.log()
  console.log(
    fmt.gradient('  ╔══════════════════════════════════════════════════════════════════╗')
  )
  console.log(
    fmt.gradient('  ║                                                                  ║')
  )
  console.log(
    `  ║               ${icons.rocket} ${fmt.title('ART DESIGN PRO')} ${fmt.subtitle('· 代码精简程序')} ${icons.magic}                ║`
  )
  console.log(
    `  ║               ${fmt.dim('为项目移除演示数据，快速切换至开发模式')}             ║`
  )
  console.log(
    fmt.gradient('  ║                                                                  ║')
  )
  console.log(
    fmt.gradient('  ╚══════════════════════════════════════════════════════════════════╝')
  )
  console.log()
}

// 创建分割线
function createDivider(char = '─', color = theme.primary) {
  console.log(`${color}${'  ' + char.repeat(66)}${theme.reset}`)
}

// 创建卡片样式容器
function createCard(title: string, content: string[]) {
  console.log(`  ${fmt.badge('', theme.bgBlue)} ${fmt.title(title)}`)
  console.log()
  content.forEach((line) => {
    console.log(`     ${line}`)
  })
  console.log()
}

// 进度条动画
function createProgressBar(current: number, total: number, text: string, width = 40) {
  const percentage = Math.round((current / total) * 100)
  const filled = Math.round((current / total) * width)
  const empty = width - filled

  const filledBar = '█'.repeat(filled)
  const emptyBar = '░'.repeat(empty)

  process.stdout.write(
    `\r  ${fmt.info('进度')} [${theme.success}${filledBar}${theme.gray}${emptyBar}${theme.reset}] ${fmt.highlight(percentage + '%')})}`
  )

  if (current === total) {
    console.log()
  }
}

// 统计信息
const stats = {
  deletedFiles: 0,
  deletedPaths: 0,
  failedPaths: 0,
  startTime: Date.now(),
  totalFiles: 0
}

// 清理目标
const targets = [
  'README.md',
  'README.zh-CN.md',
  'CHANGELOG.md',
  'CHANGELOG.zh-CN.md',
  'src/views/change',
  'src/views/safeguard',
  'src/views/article',
  'src/views/examples',
  'src/views/system/nested',
  'src/views/widgets',
  'src/views/template',
  'src/views/dashboard/analysis',
  'src/views/dashboard/ecommerce',
  'src/mock/json',
  'src/mock/temp/articleList.ts',
  'src/mock/temp/commentDetail.ts',
  'src/mock/temp/commentList.ts',
  'src/assets/images/cover',
  'src/assets/images/safeguard',
  'src/assets/images/3d',
  'src/components/core/charts/art-map-chart',
  'src/components/business/comment-widget'
]

// 递归统计文件数量
async function countFiles(targetPath: string): Promise<number> {
  const fullPath = path.resolve(process.cwd(), targetPath)

  try {
    const stat = await fs.stat(fullPath)

    if (stat.isFile()) {
      return 1
    } else if (stat.isDirectory()) {
      const entries = await fs.readdir(fullPath)
      let count = 0

      for (const entry of entries) {
        const entryPath = path.join(targetPath, entry)
        count += await countFiles(entryPath)
      }

      return count
    }
  } catch {
    return 0
  }

  return 0
}

// 统计所有目标的文件数量
async function countAllFiles(): Promise<number> {
  let totalCount = 0

  for (const target of targets) {
    const count = await countFiles(target)
    totalCount += count
  }

  return totalCount
}

// 删除文件和目录
async function remove(targetPath: string, index: number) {
  const fullPath = path.resolve(process.cwd(), targetPath)

  createProgressBar(index + 1, targets.length, targetPath)

  try {
    const fileCount = await countFiles(targetPath)
    await fs.rm(fullPath, { recursive: true, force: true })
    stats.deletedFiles += fileCount
    stats.deletedPaths++
    await new Promise((resolve) => setTimeout(resolve, 50))
  } catch (err) {
    stats.failedPaths++
    console.log()
    console.log(`     ${icons.error} ${fmt.error('删除失败')}: ${fmt.highlight(targetPath)}`)
    console.log(`     ${fmt.dim('错误详情: ' + err)}`)
  }
}

// 清理路由模块
async function cleanRouteModules() {
  const modulesPath = path.resolve(process.cwd(), 'src/router/modules')

  try {
    // 删除演示相关的路由模块
    const modulesToRemove = [
      'template.ts',
      'widgets.ts',
      'examples.ts',
      'article.ts',
      'safeguard.ts',
      'help.ts'
    ]

    for (const module of modulesToRemove) {
      const modulePath = path.join(modulesPath, module)
      try {
        await fs.rm(modulePath, { force: true })
      } catch {
        // 文件不存在时忽略错误
      }
    }

    // 重写 dashboard.ts - 只保留 console
    const dashboardContent = `import { AppRouteRecord } from '@/types/router'

export const dashboardRoutes: AppRouteRecord = {
  name: 'Dashboard',
  path: '/dashboard',
  component: '/index/index',
  meta: {
    title: 'menus.dashboard.title',
    icon: 'ri:pie-chart-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'console',
      name: 'Console',
      component: '/dashboard/console',
      meta: {
        title: 'menus.dashboard.console',
        keepAlive: false,
        fixedTab: true
      }
    }
  ]
}
`
    await fs.writeFile(path.join(modulesPath, 'dashboard.ts'), dashboardContent, 'utf-8')

    // 重写 system.ts - 移除 nested 嵌套菜单
    const systemContent = `import { AppRouteRecord } from '@/types/router'

export const systemRoutes: AppRouteRecord = {
  path: '/system',
  name: 'System',
  component: '/index/index',
  meta: {
    title: 'menus.system.title',
    icon: 'ri:user-3-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'user',
      name: 'User',
      component: '/system/user',
      meta: {
        title: 'menus.system.user',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'role',
      name: 'Role',
      component: '/system/role',
      meta: {
        title: 'menus.system.role',
        keepAlive: true,
        roles: ['R_SUPER']
      }
    },
    {
      path: 'user-center',
      name: 'UserCenter',
      component: '/system/user-center',
      meta: {
        title: 'menus.system.userCenter',
        isHide: true,
        keepAlive: true,
        isHideTab: true
      }
    },
    {
      path: 'menu',
      name: 'Menus',
      component: '/system/menu',
      meta: {
        title: 'menus.system.menu',
        keepAlive: true,
        roles: ['R_SUPER'],
        authList: [
          { title: '新增', authMark: 'add' },
          { title: '编辑', authMark: 'edit' },
          { title: '删除', authMark: 'delete' }
        ]
      }
    }
  ]
}
`
    await fs.writeFile(path.join(modulesPath, 'system.ts'), systemContent, 'utf-8')

    // 重写 index.ts - 只导入保留的模块
    const indexContent = `import { AppRouteRecord } from '@/types/router'
import { dashboardRoutes } from './dashboard'
import { systemRoutes } from './system'
import { resultRoutes } from './result'
import { exceptionRoutes } from './exception'

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [
  dashboardRoutes,
  systemRoutes,
  resultRoutes,
  exceptionRoutes
]
`
    await fs.writeFile(path.join(modulesPath, 'index.ts'), indexContent, 'utf-8')

    console.log(`     ${icons.success} ${fmt.success('清理路由模块完成')}`)
  } catch (err) {
    console.log(`     ${icons.error} ${fmt.error('清理路由模块失败')}`)
    console.log(`     ${fmt.dim('错误详情: ' + err)}`)
  }
}

// 清理路由别名
async function cleanRoutesAlias() {
  const routesAliasPath = path.resolve(process.cwd(), 'src/router/routesAlias.ts')

  try {
    const cleanedAlias = `/**
 * 公共路由别名
 # 存放系统级公共路由路径，如布局容器、登录页等   
 */
export enum RoutesAlias {
  Layout = '/index/index', // 布局容器
  Login = '/auth/login' // 登录页
}
`

    await fs.writeFile(routesAliasPath, cleanedAlias, 'utf-8')
    console.log(`     ${icons.success} ${fmt.success('重写路由别名配置完成')}`)
  } catch (err) {
    console.log(`     ${icons.error} ${fmt.error('清理路由别名失败')}`)
    console.log(`     ${fmt.dim('错误详情: ' + err)}`)
  }
}

// 清理变更日志
async function cleanChangeLog() {
  const changeLogPath = path.resolve(process.cwd(), 'src/mock/upgrade/changeLog.ts')

  try {
    const cleanedChangeLog = `import { ref } from 'vue'

interface UpgradeLog {
  version: string // 版本号
  title: string // 更新标题
  date: string // 更新日期
  detail?: string[] // 更新内容
  requireReLogin?: boolean // 是否需要重新登录
  remark?: string // 备注
}

export const upgradeLogList = ref<UpgradeLog[]>([])
`

    await fs.writeFile(changeLogPath, cleanedChangeLog, 'utf-8')
    console.log(`     ${icons.success} ${fmt.success('清空变更日志数据完成')}`)
  } catch (err) {
    console.log(`     ${icons.error} ${fmt.error('清理变更日志失败')}`)
    console.log(`     ${fmt.dim('错误详情: ' + err)}`)
  }
}

// 清理语言文件
async function cleanLanguageFiles() {
  const languageFiles = [
    { path: 'src/locales/langs/zh.json', name: '中文语言文件' },
    { path: 'src/locales/langs/en.json', name: '英文语言文件' }
  ]

  for (const { path: langPath, name } of languageFiles) {
    try {
      const fullPath = path.resolve(process.cwd(), langPath)
      const content = await fs.readFile(fullPath, 'utf-8')
      const langData = JSON.parse(content)

      const menusToRemove = [
        'widgets',
        'template',
        'article',
        'examples',
        'safeguard',
        'plan',
        'help'
      ]

      if (langData.menus) {
        menusToRemove.forEach((menuKey) => {
          if (langData.menus[menuKey]) {
            delete langData.menus[menuKey]
          }
        })

        if (langData.menus.dashboard) {
          if (langData.menus.dashboard.analysis) {
            delete langData.menus.dashboard.analysis
          }
          if (langData.menus.dashboard.ecommerce) {
            delete langData.menus.dashboard.ecommerce
          }
        }

        if (langData.menus.system) {
          const systemKeysToRemove = [
            'nested',
            'menu1',
            'menu2',
            'menu21',
            'menu3',
            'menu31',
            'menu32',
            'menu321'
          ]
          systemKeysToRemove.forEach((key) => {
            if (langData.menus.system[key]) {
              delete langData.menus.system[key]
            }
          })
        }
      }

      await fs.writeFile(fullPath, JSON.stringify(langData, null, 2), 'utf-8')
      console.log(`     ${icons.success} ${fmt.success(`清理${name}完成`)}`)
    } catch (err) {
      console.log(`     ${icons.error} ${fmt.error(`清理${name}失败`)}`)
      console.log(`     ${fmt.dim('错误详情: ' + err)}`)
    }
  }
}

// 清理快速入口组件
async function cleanFastEnterComponent() {
  const fastEnterPath = path.resolve(process.cwd(), 'src/config/fastEnter.ts')

  try {
    const cleanedFastEnter = `/**
 * 快速入口配置
 * 包含：应用列表、快速链接等配置
 */
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
      icon: 'ri:pie-chart-line',
      iconColor: '#377dff',
      enabled: true,
      order: 1,
      routeName: 'Console'
    },
    {
      name: '官方文档',
      description: '使用指南与开发文档',
      icon: 'ri:bill-line',
      iconColor: '#ffb100',
      enabled: true,
      order: 2,
      link: WEB_LINKS.DOCS
    },
    {
      name: '技术支持',
      description: '技术支持与问题反馈',
      icon: 'ri:user-location-line',
      iconColor: '#ff6b6b',
      enabled: true,
      order: 3,
      link: WEB_LINKS.COMMUNITY
    },
    {
      name: '哔哩哔哩',
      description: '技术分享与交流',
      icon: 'ri:bilibili-line',
      iconColor: '#FB7299',
      enabled: true,
      order: 4,
      link: WEB_LINKS.BILIBILI
    }
  ],
  // 快速链接
  quickLinks: [
    {
      name: '登录',
      enabled: true,
      order: 1,
      routeName: 'Login'
    },
    {
      name: '注册',
      enabled: true,
      order: 2,
      routeName: 'Register'
    },
    {
      name: '忘记密码',
      enabled: true,
      order: 3,
      routeName: 'ForgetPassword'
    },
    {
      name: '个人中心',
      enabled: true,
      order: 4,
      routeName: 'UserCenter'
    }
  ]
}

export default Object.freeze(fastEnterConfig)
`

    await fs.writeFile(fastEnterPath, cleanedFastEnter, 'utf-8')
    console.log(`     ${icons.success} ${fmt.success('清理快速入口配置完成')}`)
  } catch (err) {
    console.log(`     ${icons.error} ${fmt.error('清理快速入口配置失败')}`)
    console.log(`     ${fmt.dim('错误详情: ' + err)}`)
  }
}

// 更新菜单接口
async function updateMenuApi() {
  const apiPath = path.resolve(process.cwd(), 'src/api/system-manage.ts')

  try {
    const content = await fs.readFile(apiPath, 'utf-8')
    const updatedContent = content.replace(
      "url: '/api/v3/system/menus'",
      "url: '/api/v3/system/menus/simple'"
    )

    await fs.writeFile(apiPath, updatedContent, 'utf-8')
    console.log(`     ${icons.success} ${fmt.success('更新菜单接口完成')}`)
  } catch (err) {
    console.log(`     ${icons.error} ${fmt.error('更新菜单接口失败')}`)
    console.log(`     ${fmt.dim('错误详情: ' + err)}`)
  }
}

// 用户确认函数
async function getUserConfirmation(): Promise<boolean> {
  const { createInterface } = await import('readline')

  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    })

    console.log(
      `  ${fmt.highlight('请输入')} ${fmt.success('yes')} ${fmt.highlight('确认执行清理操作，或按 Enter 取消')}`
    )
    console.log()
    process.stdout.write(`  ${icons.arrow} `)

    rl.question('', (answer: string) => {
      rl.close()
      resolve(answer.toLowerCase().trim() === 'yes')
    })
  })
}

// 显示清理警告
async function showCleanupWarning() {
  createCard('安全警告', [
    `${fmt.warning('此操作将永久删除以下演示内容，且无法恢复！')}`,
    `${fmt.dim('请仔细阅读清理列表，确认后再继续操作')}`
  ])

  const cleanupItems = [
    {
      icon: icons.image,
      name: '图片资源',
      desc: '演示用的封面图片、3D图片、运维图片等',
      color: theme.orange
    },
    {
      icon: icons.file,
      name: '演示页面',
      desc: 'widgets、template、article、examples、safeguard等页面',
      color: theme.purple
    },
    {
      icon: icons.code,
      name: '路由模块文件',
      desc: '删除演示路由模块，只保留核心模块（dashboard、system、result、exception）',
      color: theme.primary
    },
    {
      icon: icons.link,
      name: '路由别名',
      desc: '重写routesAlias.ts，移除演示路由别名',
      color: theme.info
    },
    {
      icon: icons.data,
      name: 'Mock数据',
      desc: '演示用的JSON数据、文章列表、评论数据等',
      color: theme.success
    },
    {
      icon: icons.globe,
      name: '多语言文件',
      desc: '清理中英文语言包中的演示菜单项',
      color: theme.warning
    },
    { icon: icons.map, name: '地图组件', desc: '移除art-map-chart地图组件', color: theme.error },
    { icon: icons.chat, name: '评论组件', desc: '移除comment-widget评论组件', color: theme.orange },
    {
      icon: icons.bolt,
      name: '快速入口',
      desc: '移除分析页、礼花效果、聊天、更新日志、定价、留言管理等无效项目',
      color: theme.purple
    }
  ]

  console.log(`  ${fmt.badge('', theme.bgRed)} ${fmt.title('将要清理的内容')}`)
  console.log()

  cleanupItems.forEach((item, index) => {
    console.log(`     ${item.color}${theme.reset} ${fmt.highlight(`${index + 1}. ${item.name}`)}`)
    console.log(`        ${fmt.dim(item.desc)}`)
  })

  console.log()
  console.log(`  ${fmt.badge('', theme.bgGreen)} ${fmt.title('保留的功能模块')}`)
  console.log()

  const preservedModules = [
    { name: 'Dashboard', desc: '工作台页面' },
    { name: 'System', desc: '系统管理模块' },
    { name: 'Result', desc: '结果页面' },
    { name: 'Exception', desc: '异常页面' },
    { name: 'Auth', desc: '登录注册功能' },
    { name: 'Core Components', desc: '核心组件库' }
  ]

  preservedModules.forEach((module) => {
    console.log(`     ${icons.check} ${fmt.success(module.name)} ${fmt.dim(`- ${module.desc}`)}`)
  })

  console.log()
  createDivider()
  console.log()
}

// 显示统计信息
async function showStats() {
  const duration = Date.now() - stats.startTime
  const seconds = (duration / 1000).toFixed(2)

  console.log()
  createCard('清理统计', [
    `${fmt.success('成功删除')}: ${fmt.highlight(stats.deletedFiles.toString())} 个文件`,
    `${fmt.info('涉及路径')}: ${fmt.highlight(stats.deletedPaths.toString())} 个目录/文件`,
    ...(stats.failedPaths > 0
      ? [
          `${icons.error} ${fmt.error('删除失败')}: ${fmt.highlight(stats.failedPaths.toString())} 个路径`
        ]
      : []),
    `${fmt.info('耗时')}: ${fmt.highlight(seconds)} 秒`
  ])
}

// 创建成功横幅
function createSuccessBanner() {
  console.log()
  console.log(
    fmt.gradient('  ╔══════════════════════════════════════════════════════════════════╗')
  )
  console.log(
    fmt.gradient('  ║                                                                  ║')
  )
  console.log(
    `  ║                  ${icons.star} ${fmt.success('清理完成！项目已准备就绪')} ${icons.rocket}                  ║`
  )
  console.log(
    `  ║                    ${fmt.dim('现在可以开始您的开发之旅了！')}                  ║`
  )
  console.log(
    fmt.gradient('  ║                                                                  ║')
  )
  console.log(
    fmt.gradient('  ╚══════════════════════════════════════════════════════════════════╝')
  )
  console.log()
}

// 主函数
async function main() {
  // 清屏并显示横幅
  console.clear()
  createModernBanner()

  // 显示清理警告
  await showCleanupWarning()

  // 统计文件数量
  console.log(`  ${fmt.info('正在统计文件数量...')}`)
  stats.totalFiles = await countAllFiles()

  console.log(`  ${fmt.info('即将清理')}: ${fmt.highlight(stats.totalFiles.toString())} 个文件`)
  console.log(`  ${fmt.dim(`涉及 ${targets.length} 个目录/文件路径`)}`)
  console.log()

  // 用户确认
  const confirmed = await getUserConfirmation()

  if (!confirmed) {
    console.log(`  ${fmt.warning('操作已取消，清理中止')}`)
    console.log()
    return
  }

  console.log()
  console.log(`  ${icons.check} ${fmt.success('确认成功，开始清理...')}`)
  console.log()

  // 开始清理过程
  console.log(`  ${fmt.badge('步骤 1/6', theme.bgBlue)} ${fmt.title('删除演示文件')}`)
  console.log()
  for (let i = 0; i < targets.length; i++) {
    await remove(targets[i], i)
  }
  console.log()

  console.log(`  ${fmt.badge('步骤 2/6', theme.bgBlue)} ${fmt.title('清理路由模块')}`)
  console.log()
  await cleanRouteModules()
  console.log()

  console.log(`  ${fmt.badge('步骤 3/6', theme.bgBlue)} ${fmt.title('重写路由别名')}`)
  console.log()
  await cleanRoutesAlias()
  console.log()

  console.log(`  ${fmt.badge('步骤 4/6', theme.bgBlue)} ${fmt.title('清空变更日志')}`)
  console.log()
  await cleanChangeLog()
  console.log()

  console.log(`  ${fmt.badge('步骤 5/6', theme.bgBlue)} ${fmt.title('清理语言文件')}`)
  console.log()
  await cleanLanguageFiles()
  console.log()

  console.log(`  ${fmt.badge('步骤 6/7', theme.bgBlue)} ${fmt.title('清理快速入口')}`)
  console.log()
  await cleanFastEnterComponent()
  console.log()

  console.log(`  ${fmt.badge('步骤 7/7', theme.bgBlue)} ${fmt.title('更新菜单接口')}`)
  console.log()
  await updateMenuApi()

  // 显示统计信息
  await showStats()

  // 显示成功横幅
  createSuccessBanner()
}

main().catch((err) => {
  console.log()
  console.log(`  ${icons.error} ${fmt.error('清理脚本执行出错')}`)
  console.log(`  ${fmt.dim('错误详情: ' + err)}`)
  console.log()
  process.exit(1)
})
