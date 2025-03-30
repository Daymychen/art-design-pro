import { createBaseConfig } from '../core/base-config'

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
          name: 'Art Design Pro'
        }
      : createBaseConfig().systemInfo
  // 可以在这里添加其他动态配置
}
