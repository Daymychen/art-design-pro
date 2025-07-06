/**
 * 组件相关类型定义
 */

import { Option } from '../common'

// 搜索组件类型
export type SearchComponentType =
  | 'input'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'datetime'
  | 'daterange'
  | 'datetimerange'
  | 'month'
  | 'monthrange'
  | 'year'
  | 'yearrange'
  | 'week'
  | 'time'
  | 'timerange'

// 搜索框值变化参数
export interface SearchChangeParams {
  prop: string
  val: unknown
}

// 搜索表单项
export interface SearchFormItem {
  // 表单项标签
  label: string
  // 表单项属性名
  prop: string
  // 表单项类型
  type: SearchComponentType
  // 每列的宽度（基于 24 格布局）
  elColSpan?: number
  // select的选项
  options?: Option[] | (() => Option[])
  // 搜索框更改事件
  onChange?: (changeParams: SearchChangeParams) => void
  // 额外配置项
  config?: Record<string, unknown>
  // 默认值
  defaultValue?: any
  // 占位符
  placeholder?: string
  // 是否必填
  required?: boolean
  // 是否禁用
  disabled?: boolean
}

// 表格列配置接口
export interface ColumnOption<T = any> {
  // 列类型
  type?: 'selection' | 'expand' | 'index' | 'globalIndex'
  // 列属性名
  prop?: string
  // 列标题
  label?: string
  // 列宽度
  width?: string | number
  // 最小列宽度
  minWidth?: string | number
  // 固定列
  fixed?: boolean | 'left' | 'right'
  // 是否可排序
  sortable?: boolean
  // 过滤器选项
  filters?: any[]
  // 过滤方法
  filterMethod?: (value: any, row: any) => boolean
  // 过滤器位置
  filterPlacement?: string
  // 是否禁用
  disabled?: boolean
  // 是否选中显示
  checked?: boolean
  // 自定义渲染函数
  formatter?: (row: T) => any
  // 🆕 插槽相关配置
  // 是否使用插槽渲染内容
  useSlot?: boolean
  // 插槽名称（默认为 prop 值）
  slotName?: string
  // 是否使用表头插槽
  useHeaderSlot?: boolean
  // 表头插槽名称（默认为 `${prop}-header`）
  headerSlotName?: string
  // 其他属性
  [key: string]: any
}

// 表格列配置
export interface TableColumn {
  // 列标题
  label: string
  // 列属性名
  prop: string
  // 列宽度
  width?: number | string
  // 最小宽度
  minWidth?: number | string
  // 是否可排序
  sortable?: boolean
  // 是否固定列
  fixed?: boolean | 'left' | 'right'
  // 列对齐方式
  align?: 'left' | 'center' | 'right'
  // 自定义渲染
  formatter?: (row: any, column: any, cellValue: any, index: number) => string
  // 是否显示
  show?: boolean
  // 列类型
  type?: 'selection' | 'index' | 'expand'
}

// 分页配置
export interface PaginationConfig {
  // 当前页
  currentPage: number
  // 每页条数
  pageSize: number
  // 总条数
  total: number
  // 每页显示个数选择器的选项
  pageSizes?: number[]
  // 组件布局
  layout?: string
  // 是否为小型分页
  small?: boolean
}

// 表单规则
export interface FormRule {
  // 是否必填
  required?: boolean
  // 错误提示信息
  message?: string
  // 触发方式
  trigger?: string | string[]
  // 最小长度
  min?: number
  // 最大长度
  max?: number
  // 正则表达式
  pattern?: RegExp
  // 自定义验证函数
  validator?: (rule: any, value: any, callback: any) => void
}

// 对话框配置
export interface DialogConfig {
  // 标题
  title: string
  // 是否显示
  visible: boolean
  // 宽度
  width?: string | number
  // 是否可以通过点击 modal 关闭
  closeOnClickModal?: boolean
  // 是否可以通过按下 ESC 关闭
  closeOnPressEscape?: boolean
  // 是否显示关闭按钮
  showClose?: boolean
  // 是否在 Dialog 出现时将 body 滚动锁定
  lockScroll?: boolean
  // 是否显示遮罩层
  modal?: boolean
  // 自定义类名
  customClass?: string
}
