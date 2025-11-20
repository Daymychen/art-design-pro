import axios from 'axios'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 图标库配置 - 使用多个备用源
const iconLibraries = [
  {
    prefix: 'ri',
    name: 'Remix Icon',
    metaUrl: 'https://icones.js.org/collections/ri-meta.json',
    fallbackUrl: 'https://api.iconify.design/collection?prefix=ri',
    color: '#000000'
  },
  {
    prefix: 'ep',
    name: 'Element Plus',
    metaUrl: 'https://icones.js.org/collections/ep-meta.json',
    fallbackUrl: 'https://api.iconify.design/collection?prefix=ep',
    color: '#409EFF'
  },
  {
    prefix: 'fa',
    name: 'Font Awesome',
    metaUrl: 'https://icones.js.org/collections/fa-meta.json',
    fallbackUrl: 'https://api.iconify.design/collection?prefix=fa',
    color: '#333333'
  }
  // {
  //   prefix: 'mdi',
  //   name: 'Material Design',
  //   metaUrl: 'https://icones.js.org/collections/mdi-meta.json',
  //   fallbackUrl: 'https://api.iconify.design/collection?prefix=mdi',
  //   color: '#2196F3'
  // }
]

interface IconItem {
  id: string
  name: string
  prefix: string
  category: string
  color: string
  tags: string[]
}

// 生成随机颜色
function generateRandomColor(): string {
  const colors = [
    '#8B5CF6', // 紫色
    '#EC4899', // 粉色
    '#EF4444', // 红色
    '#F59E0B', // 橙色
    '#10B981', // 绿色
    '#14B8A6', // 青色
    '#3B82F6', // 蓝色
    '#6366F1', // 靛蓝
    '#8B5A3C', // 棕色
    '#6B7280', // 灰色
    '#F97316', // 深橙
    '#84CC16', // 黄绿
    '#06B6D4', // 天蓝
    '#A855F7', // 紫罗兰
    '#D946EF' // 品红
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 标签映射函数
function generateTags(iconName: string, prefix: string): string[] {
  const tags: string[] = []
  const name = iconName.toLowerCase()

  // 通用标签
  if (name.includes('home') || name.includes('house')) tags.push('home', '主页')
  if (name.includes('user') || name.includes('person') || name.includes('people'))
    tags.push('user', '用户', '人物')
  if (name.includes('setting') || name.includes('config') || name.includes('gear'))
    tags.push('setting', '设置', '配置')
  if (name.includes('search') || name.includes('find')) tags.push('search', '搜索', '查找')
  if (name.includes('menu') || name.includes('hamburger')) tags.push('menu', '菜单', '导航')
  if (name.includes('close') || name.includes('times') || name.includes('x'))
    tags.push('close', '关闭', '取消')
  if (name.includes('add') || name.includes('plus') || name.includes('create'))
    tags.push('add', '添加', '新增')
  if (name.includes('edit') || name.includes('pencil') || name.includes('modify'))
    tags.push('edit', '编辑', '修改')
  if (name.includes('delete') || name.includes('trash') || name.includes('remove'))
    tags.push('delete', '删除', '移除')
  if (name.includes('save') || name.includes('download')) tags.push('save', '保存', '下载')
  if (name.includes('upload') || name.includes('export')) tags.push('upload', '上传', '导出')
  if (name.includes('copy') || name.includes('duplicate')) tags.push('copy', '复制', '克隆')
  if (name.includes('paste') || name.includes('import')) tags.push('paste', '粘贴', '导入')

  // 方向标签
  if (name.includes('left') || name.includes('previous')) tags.push('left', '左', '向左')
  if (name.includes('right') || name.includes('next')) tags.push('right', '右', '向右')
  if (name.includes('up') || name.includes('top')) tags.push('up', '上', '向上')
  if (name.includes('down') || name.includes('bottom')) tags.push('down', '下', '向下')

  // 状态标签
  if (name.includes('success') || name.includes('check') || name.includes('tick'))
    tags.push('success', '成功', '确认')
  if (name.includes('error') || name.includes('warning') || name.includes('alert'))
    tags.push('error', '错误', '警告')
  if (name.includes('info') || name.includes('help') || name.includes('question'))
    tags.push('info', '信息', '帮助')

  // 媒体标签
  if (name.includes('play') || name.includes('start')) tags.push('play', '播放', '开始')
  if (name.includes('pause') || name.includes('stop')) tags.push('pause', '暂停', '停止')
  if (name.includes('volume') || name.includes('audio') || name.includes('sound'))
    tags.push('volume', '音量', '音频')
  if (name.includes('video') || name.includes('movie') || name.includes('film'))
    tags.push('video', '视频', '电影')
  if (name.includes('image') || name.includes('picture') || name.includes('photo'))
    tags.push('image', '图片', '照片')

  // 前缀特定标签
  if (prefix === 'ri') tags.push('remix', 'remix icon')
  if (prefix === 'ep') tags.push('element', 'element plus')
  if (prefix === 'fa') tags.push('fontawesome', 'font awesome')
  if (prefix === 'mdi') tags.push('material', 'material design')

  return tags
}

// 创建 axios 实例，配置 HTTPS agent
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // 忽略证书验证（仅用于开发环境）
    keepAlive: true
  }),
  timeout: 60000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'keep-alive'
  }
})

// 带重试和备用源的下载函数
async function downloadWithRetry(url: string, fallbackUrl?: string, maxRetries = 3): Promise<any> {
  // 尝试主 URL
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axiosInstance.get(url)
      return response.data
    } catch {
      if (i < maxRetries - 1) {
        console.log(`  ⚠️  重试 ${i + 1}/${maxRetries}...`)
        await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)))
      }
    }
  }

  // 如果主 URL 失败，尝试备用 URL
  if (fallbackUrl) {
    console.log(`  🔄 尝试备用源...`)
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await axiosInstance.get(fallbackUrl)
        return response.data
      } catch {
        if (i < maxRetries - 1) {
          console.log(`  ⚠️  备用源重试 ${i + 1}/${maxRetries}...`)
          await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)))
        }
      }
    }
  }

  throw new Error('所有下载尝试均失败')
}

// 下载图标数据
async function downloadIcons() {
  console.log('🚀 开始下载图标数据...')

  const allIcons: IconItem[] = []

  for (const lib of iconLibraries) {
    try {
      console.log(`📦 下载 ${lib.name} 图标库...`)

      const data = await downloadWithRetry(lib.metaUrl, lib.fallbackUrl)

      // 处理不同的数据格式
      let icons: string[] = []
      if (data.icons && Array.isArray(data.icons)) {
        // icones.js.org 格式 - icons 数组
        icons = data.icons
      } else if (data.uncategorized) {
        // Iconify API 格式 - uncategorized 字段
        icons = data.uncategorized
      } else if (data.categories) {
        // Iconify API 格式 - categories 字段
        Object.values(data.categories).forEach((category: any) => {
          if (Array.isArray(category)) {
            icons.push(...category)
          }
        })
      } else if (data.icons && typeof data.icons === 'object') {
        // JSON 文件格式 - icons 对象
        icons = Object.keys(data.icons)
      }

      console.log(`✅ ${lib.name} 下载成功，共 ${icons.length} 个图标`)

      // 转换数据格式 - 每个图标使用随机颜色
      const formattedIcons: IconItem[] = icons.map((iconName: string) => ({
        id: `${lib.prefix}:${iconName}`,
        name: iconName,
        prefix: lib.prefix,
        category: lib.name,
        color: generateRandomColor(),
        tags: generateTags(iconName, lib.prefix)
      }))

      allIcons.push(...formattedIcons)
    } catch (error: any) {
      console.error(`❌ ${lib.name} 下载失败:`, error?.message || '未知错误')
    }
  }

  // 保存数据
  const outputPath = path.join(__dirname, '../src/components/core/forms/art-icon-picker/data.json')

  const data = {
    version: new Date().toISOString(),
    total: allIcons.length,
    libraries: iconLibraries.map((lib) => ({
      prefix: lib.prefix,
      name: lib.name,
      count: allIcons.filter((icon) => icon.prefix === lib.prefix).length
    })),
    icons: allIcons
  }

  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8')
    console.log(`✅ 图标数据已保存到: ${outputPath}`)
    console.log(`📊 总计下载 ${allIcons.length} 个图标`)

    // 统计信息
    console.log('\n📈 图标库统计:')
    iconLibraries.forEach((lib) => {
      const count = allIcons.filter((icon) => icon.prefix === lib.prefix).length
      console.log(`  • ${lib.name} (${lib.prefix}): ${count} 个图标`)
    })
  } catch (error: any) {
    console.error('❌ 保存文件失败:', error?.message || '未知错误')
  }
}

// 运行下载
downloadIcons().catch(console.error)
