import { createBaseConfig } from '../core/base-config'
import { getBaseApiUrl } from './api-config'

/**
 * 根据环境变量动态配置 base-config
 * 开发环境：development
 * 生产环境：production
 */
export const envConfig = {
  systemInfo:
    process.env.NODE_ENV === 'development'
      ? {
          ...createBaseConfig().systemInfo,
          name: 'Art Design Pro (开发环境)'
        }
      : createBaseConfig().systemInfo,

  // API基础URL配置 - 使用api-config中的配置
  apiBaseUrl: getBaseApiUrl(),

  // 是否使用模拟数据
  useMock: process.env.NODE_ENV === 'development' && import.meta.env.VITE_USE_MOCK === 'true'

  // 可以在这里添加其他动态配置
}
