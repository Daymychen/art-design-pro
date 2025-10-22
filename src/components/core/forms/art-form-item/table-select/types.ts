/**
 * TableSelect 组件类型定义
 */

/** 表格列配置 */
export interface TableColumn {
  /** 列标签 */
  label: string
  /** 列属性名 */
  prop: string
  /** 列宽度 */
  width?: string | number
  /** 最小宽度 */
  minWidth?: string | number
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否显示 */
  show?: boolean
  /** 自定义渲染函数 */
  formatter?: (row: any, column: TableColumn, cellValue: any, index: number) => any
  /** 其他 el-table-column 属性 */
  [key: string]: any
}

/** 表格数据项 */
export interface TableDataItem {
  [key: string]: any
}

/** 加载状态 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/** TableSelect 组件 Props */
export interface TableSelectProps {
  // ========== 基础配置 ==========
  /** 表格列配置 */
  columns: TableColumn[]
  /** 异步请求函数，返回表格数据 */
  request: (query: string) => Promise<TableDataItem[]>
  /** 是否多选 */
  multiple?: boolean
  /** 数据的唯一标识字段 */
  valueKey?: string
  /** 数据的显示标签字段 */
  labelKey?: string
  /** 占位符 */
  placeholder?: string

  // ========== 搜索配置 ==========
  /** 搜索防抖延迟（毫秒） */
  debounce?: number
  /** 最小搜索字符数 */
  minSearchLength?: number

  // ========== 表格配置 ==========
  /** 透传给 el-table 的属性 */
  tableProps?: Record<string, any>
  /** 表格高度 */
  tableHeight?: string | number
  /** 每页显示条数 */
  pageSize?: number

  // ========== 显示配置 ==========
  /** 空数据提示文本 */
  emptyText?: string
  /** 加载失败提示文本 */
  errorText?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 输入框尺寸 */
  size?: 'large' | 'default' | 'small'

  // ========== 高级配置 ==========
  /** 下拉框宽度 */
  popperWidth?: string | number
  /** popper 类名 */
  popperClass?: string
  /** 是否在输入时自动展开下拉 */
  autoExpandOnInput?: boolean
}

/** TableSelect 组件 Emits */
export interface TableSelectEmits {
  /** 选中项变化 */
  (e: 'change', value: any, selectedRows: TableDataItem | TableDataItem[]): void
  /** 搜索 */
  (e: 'search', query: string): void
  /** 加载成功 */
  (e: 'load-success', data: TableDataItem[]): void
  /** 加载失败 */
  (e: 'load-error', error: any): void
  /** 清空 */
  (e: 'clear'): void
  /** 下拉显示状态变化 */
  (e: 'visible-change', visible: boolean): void
}

/** 选中的行数据 */
export interface SelectedRow {
  /** 行数据 */
  row: TableDataItem
  /** 显示的标签 */
  label: string
  /** 值 */
  value: any
}
