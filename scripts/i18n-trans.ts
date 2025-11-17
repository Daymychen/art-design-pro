import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

async function fileExists(p: string) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

function parseEnv(text: string) {
  const lines = text.split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

async function loadEnvFiles(root: string) {
  const candidates = ['.env', '.env.local', '.env.development', '.env.devlopment']
  for (const name of candidates) {
    const p = path.resolve(root, name)
    if (await fileExists(p)) {
      const content = await fs.readFile(p, 'utf8')
      parseEnv(content)
    }
  }
}

function extractPlaceholders(s: string) {
  const set = new Set<string>()
  const patterns = [/\{\{[^}]+\}\}/g, /\{[a-zA-Z0-9_]+\}/g, /%[sd]/g, /\{\d+\}/g]
  for (const re of patterns) {
    const m = s.match(re)
    if (m) for (const x of m) set.add(x)
  }
  return set
}

async function translateText(text: string, target: 'zh' | 'en', source: 'zh' | 'en') {
  if (!process.env.DEEPSEEK_API_KEY) await loadEnvFiles(path.resolve(__dirname, '..'))
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) throw new Error('未检测到 DEEPSEEK_API_KEY')
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat'
  const sys =
    'You are a professional translation engine. Preserve placeholders like {{name}}, {count}, %s, %d, {0}. Output only the translated text.'
  const srcLang = source === 'zh' ? 'Chinese' : 'English'
  const tgtLang = target === 'zh' ? 'Chinese' : 'English'
  const user = `Translate from ${srcLang} to ${tgtLang}. Keep placeholders unchanged. Text:\n${text}`
  const { data } = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model,
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: user }
      ],
      temperature: 0.2
    },
    {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      timeout: 30000
    }
  )
  let content = (data?.choices?.[0]?.message?.content ?? '').toString().trim()
  const placeholders = extractPlaceholders(text)
  for (const ph of placeholders) {
    if (!content.includes(ph)) content += ` ${ph}`
  }
  return content
}

function setByPath(obj: any, keys: string[], value: any) {
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {}
    cur = cur[k]
  }
  cur[keys[keys.length - 1]] = value
}

type Task = { keys: string[]; from: string; toLang: 'zh' | 'en' }

function collectTasks(
  left: any,
  right: any,
  toLang: 'zh' | 'en',
  keys: string[] = [],
  out: Task[] = []
) {
  if (left && typeof left === 'object' && !Array.isArray(left)) {
    for (const k of Object.keys(left)) {
      const v = left[k]
      const other = right ? right[k] : undefined
      const p = [...keys, k]
      if (typeof v === 'string') {
        if (v.trim() === '' && typeof other === 'string' && other.trim() !== '')
          out.push({ keys: p, from: other, toLang })
      } else if (v && typeof v === 'object' && !Array.isArray(v)) {
        collectTasks(v, other, toLang, p, out)
      }
    }
  }
  return out
}

async function run() {
  log.info('开始自动翻译空值')
  const root = path.resolve(__dirname, '..')
  const zhPath = path.resolve(root, 'src/locales/langs/zh.json')
  const enPath = path.resolve(root, 'src/locales/langs/en.json')
  const zh = JSON.parse(await fs.readFile(zhPath, 'utf8'))
  const en = JSON.parse(await fs.readFile(enPath, 'utf8'))
  const dry = process.argv.includes('--dry')
  const tasksZh = collectTasks(zh, en, 'zh')
  const tasksEn = collectTasks(en, zh, 'en')
  const tasks = [...tasksZh, ...tasksEn]
  if (tasks.length === 0) {
    log.success('未发现需要填充的空值')
    return
  }
  log.info(`待翻译项数量：${tasks.length}`)
  const concurrency = Number(process.env.I18N_TRANS_CONCURRENCY || 4)
  let idx = 0
  let filledZh = 0
  let filledEn = 0
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++
      const t = tasks[i]
      try {
        if (dry) {
          log.info(`${t.toLang} ← ${t.from}`)
          continue
        }
        const result = await translateText(t.from, t.toLang, t.toLang === 'zh' ? 'en' : 'zh')
        if (t.toLang === 'zh') {
          setByPath(zh, t.keys, result)
          filledZh++
        } else {
          setByPath(en, t.keys, result)
          filledEn++
        }
      } catch (e: any) {
        log.warning(`跳过：${t.keys.join('.')}，原因：${e?.message || e}`)
      }
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker())
  await Promise.all(workers)
  if (!dry) {
    await fs.writeFile(zhPath, JSON.stringify(zh, null, 2) + '\n')
    await fs.writeFile(enPath, JSON.stringify(en, null, 2) + '\n')
  }
  log.success(
    `中文填充：${filledZh}，英文填充：${filledEn}，跳过：${tasks.length - filledZh - filledEn}`
  )
  if (dry) log.warning('预览模式未写入文件')
}

run().catch((err) => {
  log.error('执行失败')
  console.error(err?.message || err)
  process.exit(1)
})
