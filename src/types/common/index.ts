/**
 * 通用类型定义模块
 *
 * 提供项目中常用的通用类型定义
 *
 * ## 主要功能
 *
 * - 状态类型（启用/禁用）
 * - 性别类型
 * - 排序方向类型
 * - 操作类型（增删改查）
 * - 记录类型（键值对）
 * - 时间范围类型
 * - 文件信息类型
 * - 坐标和尺寸类型
 * - 响应式断点类型
 * - 主题和语言类型
 * - 环境和弹窗类型
 *
 * ## 使用场景
 *
 * - 通用数据结构定义
 * - 类型约束和提示
 * - 减少重复类型定义
 *
 * @module types/common/index
 * @author Art Design Pro Team
 */

// 导出响应类型
export * from './response'

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

// 弹窗类型
export type DialogType = 'add' | 'edit'
