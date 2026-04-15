/**
 * 系统配置加载器
 *
 * 从 public/system-config.json 动态加载系统配置
 *
 * ## 主要功能
 *
 * - 从远程 JSON 文件加载配置
 * - 配置注入到 Vue 全局属性
 * - 提供 getConfig/setConfig 工具函数
 * - 支持点号路径访问嵌套配置
 * - 错误处理和降级
 *
 * ## 使用方式
 *
 * ```typescript
 * // 在 main.ts 中加载配置
 * await getSystemConfig(app)
 *
 * // 在组件中使用
 * this.$config.systemInfo.name
 *
 * // 通过工具函数使用
 * getConfig('systemInfo.name')
 * ```
 *
 * @module utils/config/config-loader
 * @author Art Design Pro Team
 */

import axios from 'axios'
import type { App } from 'vue'

/** 配置缓存 */
let config: any = {}

/**
 * 设置配置
 * @param cfg 配置对象
 */
const setConfig = (cfg?: any) => {
  config = Object.assign(config, cfg)
}

/**
 * 获取配置
 * @param key 配置键，支持点号分隔的路径，如 'systemInfo.name'
 * @returns 配置值或整个配置对象
 *
 * @example
 * ```typescript
 * // 获取整个配置
 * const config = getConfig()
 *
 * // 获取特定配置
 * const name = getConfig('systemInfo.name')
 * const color = getConfig('systemMainColor.0')
 * ```
 */
const getConfig = (key?: string): any => {
  if (typeof key === 'string') {
    const arr = key.split('.')
    if (arr && arr.length) {
      let data: any = config
      arr.forEach((v) => {
        if (data && typeof data[v] !== 'undefined') {
          data = data[v]
        } else {
          data = null
        }
      })
      return data
    }
  }
  return config
}

/**
 * 获取系统动态全局配置
 *
 * 从 /system-config.json 加载配置并注入到 Vue 应用的全局属性中
 *
 * @param app Vue 应用实例
 * @returns Promise<配置对象>
 *
 * @example
 * ```typescript
 * const app = createApp(App)
 * await getSystemConfig(app)
 * // 配置已注入到 app.config.globalProperties.$config
 * ```
 */
export const getSystemConfig = async (app: App): Promise<any> => {
  app.config.globalProperties.$config = getConfig()

  return axios({
    method: 'get',
    url: '/system-config.json'
  })
    .then(({ data: config }) => {
      let $config = app.config.globalProperties.$config

      // 自动注入系统配置
      if (app && $config && typeof config === 'object') {
        $config = Object.assign($config, config)
        app.config.globalProperties.$config = $config

        // 设置全局配置
        setConfig($config)
      }

      return $config
    })
    .catch(() => {
      console.warn('请在 public 文件夹下添加 system-config.json 配置文件')
      // 返回空配置，使用默认值
      return {}
    })
}

export { getConfig, setConfig }
