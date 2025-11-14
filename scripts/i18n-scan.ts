/**
 * 国际化扫描脚本
 * 扫描项目中的 $t() 调用，自动生成翻译 JSON 文件
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { fileURLToPath } from 'url'

const execAsync = promisify(exec)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m'
}

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`)
}

async function scanTranslations() {
  try {
    log.info('开始扫描项目中的翻译标记...')

    const configPath = path.resolve(__dirname, '../i18next-scanner.config.cjs')

    // 执行 i18next-scanner
    const { stdout, stderr } = await execAsync(`npx i18next-scanner --config ${configPath}`, {
      cwd: path.resolve(__dirname, '..')
    })

    if (stdout) {
      console.log(stdout)
    }

    if (stderr && !stderr.includes('Debugger')) {
      log.warning(stderr)
    }

    log.success('翻译文件扫描完成！')
    log.info('请检查 src/locales/langs/ 目录下的翻译文件')
    log.warning('注意：新增的翻译 key 需要手动添加对应的翻译文本')
  } catch (error) {
    log.error('扫描失败：')
    if (error instanceof Error) {
      console.error(error.message)
    }
    process.exit(1)
  }
}

// 执行扫描
scanTranslations()

// 使用参考：./docs/I18N_QUICK_START
