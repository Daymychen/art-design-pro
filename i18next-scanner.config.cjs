/**
 * i18next-scanner 配置文件
 * 用于自动扫描项目中的翻译标记并生成 JSON 文件
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

module.exports = {
  input: [
    'src/**/*.{vue,ts,js}', // 扫描 src 目录下的所有 vue, ts, js 文件
    '!src/locales/**', // 排除 locales 目录
    '!src/**/*.d.ts', // 排除类型定义文件
    '!**/node_modules/**' // 排除 node_modules
  ],
  output: './',
  options: {
    debug: false, // 是否开启调试模式
    removeUnusedKeys: false, // 不删除未使用的 key，保留手动添加的翻译
    sort: true, // 按字母顺序排序 key
    func: {
      // 需要扫描的函数名称
      list: ['$t', 't'],
      extensions: ['.vue', '.ts', '.js']
    },
    trans: false, // 不使用 trans 组件
    lngs: ['zh', 'en'], // 支持的语言
    ns: ['translation'], // 命名空间
    defaultLng: 'zh', // 默认语言
    defaultNs: 'translation',
    defaultValue: (lng, ns, key) => {
      // 为不同语言设置默认值
      if (lng === 'zh') {
        return '' // 中文待添加
      }
      if (lng === 'en') {
        return key // 英文使用 key
      }
      return key
    },
    resource: {
      // 输出资源配置
      loadPath: 'src/locales/langs/{{lng}}.json', // 读取路径
      savePath: 'src/locales/langs/{{lng}}.json', // 保存路径
      jsonIndent: 2, // JSON 缩进
      lineEnding: '\n' // 行结束符
    },
    nsSeparator: false, // key 中的命名空间分隔符（禁用）
    keySeparator: '.', // key 分隔符，用于创建嵌套对象
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    },
    // 自定义处理函数，用于合并现有翻译
    flush: function (done) {
      const { parser } = this
      const { options } = parser
      const { resource } = options

      // 遍历所有语言
      options.lngs.forEach((lng) => {
        const filePath = path.resolve(__dirname, resource.savePath.replace('{{lng}}', lng))

        // 读取现有的翻译文件
        let existingTranslations = {}
        if (fs.existsSync(filePath)) {
          try {
            const content = fs.readFileSync(filePath, 'utf8')
            existingTranslations = JSON.parse(content)
          } catch (error) {
            console.error(`读取 ${filePath} 失败:`, error.message)
          }
        }

        // 获取扫描到的新 key
        const newTranslations = parser.get({ lng })

        // 深度合并函数
        const deepMerge = (target, source) => {
          const output = { ...target }
          for (const key in source) {
            if (source[key] instanceof Object && key in target) {
              output[key] = deepMerge(target[key], source[key])
            } else {
              output[key] = source[key]
            }
          }
          return output
        }

        // 合并现有翻译和新扫描的翻译
        // 优先保留现有翻译的值，只添加新的 key
        const mergedTranslations = deepMerge(
          newTranslations.translation || {},
          existingTranslations
        )

        // 排序函数
        const sortObject = (obj) => {
          if (typeof obj !== 'object' || obj === null) return obj
          if (Array.isArray(obj)) return obj

          return Object.keys(obj)
            .sort()
            .reduce((result, key) => {
              result[key] = sortObject(obj[key])
              return result
            }, {})
        }

        // 对结果进行排序
        const sortedTranslations = options.sort
          ? sortObject(mergedTranslations)
          : mergedTranslations

        // 写入文件
        try {
          fs.writeFileSync(
            filePath,
            JSON.stringify(sortedTranslations, null, resource.jsonIndent) + '\n',
            'utf8'
          )
          console.log(`✓ 已生成/更新: ${filePath}`)
        } catch (error) {
          console.error(`写入 ${filePath} 失败:`, error.message)
        }
      })

      done()
    }
  }
}
