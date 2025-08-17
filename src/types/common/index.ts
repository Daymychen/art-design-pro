/**
 * 通用类型定义
 */

// 状态类型
export type Status = 0 | 1 // 0: 禁用, 1: 启用

// 性别类型
export type Gender = 'male' | 'female' | 'unknown'

// 排序方向
export type SortOrder = 'ascending' | 'descending'

// 操作类型
export type ActionType = 'create' | 'update' | 'delete' | 'view'

// 可选的记录类型
export type Recordable<T = any> = Record<string, T>

// 键值对类型
export type KeyValue<T = any> = {
  key: string
  value: T
  label?: string
}

// 时间范围类型
export interface TimeRange {
  startTime: string
  endTime: string
}

// 文件类型
export interface FileInfo {
  name: string
  url: string
  size: number
  type: string
  lastModified?: number
}

// 坐标类型
export interface Position {
  x: number
  y: number
}

// 尺寸类型
export interface Size {
  width: number
  height: number
}

// 响应式断点类型
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// 主题类型
export type ThemeMode = 'light' | 'dark' | 'auto'

// 语言类型
export type Language = 'zh-CN' | 'en-US'

// 环境类型
export type Environment = 'development' | 'production' | 'test'
