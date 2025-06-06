/**
 * 请求相关类型定义
 */

// 错误消息模式
export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined

// 请求配置选项
export interface RequestOptions {
  // 是否将参数拼接到URL
  joinParamsToUrl?: boolean
  // 是否格式化日期
  formatDate?: boolean
  // 是否转换响应数据
  isTransformResponse?: boolean
  // 是否返回原生响应
  isReturnNativeResponse?: boolean
  // 是否添加前缀
  joinPrefix?: boolean
  // API URL
  apiUrl?: string
  // 错误消息模式
  errorMessageMode?: ErrorMessageMode
  // 是否添加时间戳
  joinTime?: boolean
  // 是否忽略取消令牌
  ignoreCancelToken?: boolean
  // 是否携带token
  withToken?: boolean
}

// 请求方法类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 请求头类型
export interface RequestHeaders {
  [key: string]: string | number | boolean
}

// 基础请求配置
export interface BaseRequestConfig {
  url: string
  method?: RequestMethod
  headers?: RequestHeaders
  params?: Record<string, any>
  data?: any
  timeout?: number
}
