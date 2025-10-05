/**
 * API Select 组件类型定义
 */

/** 选项项接口 */
export interface OptionItem {
  [key: string]: any
  label?: string
  value?: any
  disabled?: boolean
}

/** 远程搜索配置 */
export interface RemoteConfig {
  /** 是否支持远程搜索 */
  enabled?: boolean
  /** 搜索查询参数名 */
  queryKey?: string
  /** 搜索防抖延迟（毫秒） */
  debounce?: number
  /** 最小搜索字符数 */
  minLength?: number
}

/** 选项显示配置 */
export interface DisplayConfig {
  /** 空数据提示文本 */
  emptyText?: string
  /** 加载中提示文本 */
  loadingText?: string
  /** 加载失败提示文本 */
  errorText?: string
}

/** 依赖配置 */
export interface DependConfig {
  /** 依赖的表单字段 */
  fields?: string | string[]
  /** 依赖字段值变化时的参数映射函数 */
  paramsMapping?: (formData: Record<string, any>) => any
}

/** 加载时机 */
export type LoadOn = 'mounted' | 'focus' | 'manual'

/** API Select 组件 Props */
export interface ApiSelectProps {
  // ========== 基础配置 ==========
  /** 异步请求函数 */
  api?: (...args: any[]) => Promise<any>
  /** 请求参数 */
  params?: Record<string, any> | any[]
  /** 响应数据中的 label 字段名 */
  labelField?: string
  /** 响应数据中的 value 字段名 */
  valueField?: string
  /** 响应数据在返回结果中的路径 (支持 'data' 或 'data.list' 格式) */
  dataPath?: string

  // ========== 加载控制 ==========
  /** 是否立即加载数据 */
  immediate?: boolean
  /** 加载时机 */
  loadOn?: LoadOn
  /** 请求防抖延迟（毫秒） */
  debounce?: number

  // ========== 数据处理 ==========
  /** 数据转换函数，用于自定义处理响应数据 */
  transform?: (data: any) => OptionItem[]

  // ========== 选项配置 ==========
  /** 前置选项（插入到 API 数据之前） */
  prependOptions?: OptionItem[]
  /** 后置选项（插入到 API 数据之后） */
  appendOptions?: OptionItem[]

  // ========== 远程搜索 ==========
  /** 是否支持远程搜索 */
  remote?: boolean
  /** 远程搜索的查询参数 key */
  remoteQueryKey?: string
  /** 远程搜索防抖延迟 */
  remoteDebounce?: number
  /** 最小搜索字符数 */
  remoteMinLength?: number

  // ========== 依赖字段 ==========
  /** 依赖的表单字段 */
  dependOn?: string | string[]
  /** 依赖字段值变化时的参数映射函数 */
  paramsMapping?: (formData: Record<string, any>) => any

  // ========== 显示配置 ==========
  /** 空数据提示文本 */
  emptyText?: string
  /** 加载中提示文本 */
  loadingText?: string
  /** 加载失败提示文本 */
  errorText?: string
}

/** API Select 组件 Emits */
export interface ApiSelectEmits {
  /** 数据加载成功 */
  (e: 'load-success', data: OptionItem[]): void
  /** 数据加载失败 */
  (e: 'load-error', error: any): void
  /** 数据加载开始 */
  (e: 'load-start'): void
  /** 数据加载完成（成功或失败） */
  (e: 'load-end'): void
  /** 远程搜索 */
  (e: 'remote-search', query: string): void
  /** 选项变化 */
  (e: 'options-change', options: OptionItem[]): void
}

/** 加载状态 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
