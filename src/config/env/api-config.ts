/**
 * API服务配置
 * 管理API网关和服务相关的配置
 */

// 定义API配置接口
export interface ApiConfig {
  // API网关地址
  gateway: string
  // 是否启用网关前缀
  enableGateway: boolean
  // 微服务配置
  services: {
    // 是否在URL中添加服务名前缀
    enableServicePrefix: boolean
    // 微服务自定义路径(如果不想使用默认的服务名称)
    customPaths?: Record<string, string>
  }
}

// 开发环境API配置
const apiConfig: ApiConfig = {
  gateway: import.meta.env.VITE_API_URL,
  enableGateway: true,
  services: {
    enableServicePrefix: true,
    customPaths: {
      // 如果需要覆盖默认的服务名，可以在这里配置
      // 例如: 'easy-cloud-auth': 'auth-service'
    }
  }
}

// 辅助函数：获取完整的API基础URL
export function getBaseApiUrl(): string {
  return apiConfig.gateway
}

// 辅助函数：获取微服务的实际路径
export function getServiceActualPath(serviceName: string): string {
  if (!apiConfig.services.enableServicePrefix) {
    return ''
  }

  // 检查是否有自定义路径配置
  if (apiConfig.services.customPaths && apiConfig.services.customPaths[serviceName]) {
    return `/${apiConfig.services.customPaths[serviceName]}`
  }

  return `/${serviceName}`
}
