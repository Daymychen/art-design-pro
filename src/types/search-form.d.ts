// 搜索组件类型
export type SearchComponentType =
  | 'input'
  | 'select'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'date'
  | 'daterange'
  | 'datetimerange'
  | 'month'
  | 'monthrange'
  | 'year'
  | 'yearrange'
  | 'week'

// select选项接口定义
export interface SearchSelectOption {
  label: string // 选项标签
  value: number | string // 选项值
  disabled?: boolean // 是否禁用
}

// 搜索框值变化参数接口
export interface SearchChangeParams {
  prop: string // 属性名
  val: unknown // 变化后的值
}

// 搜索表单项接口
export interface SearchFormItem {
  label: string // 表单项标签
  prop: string // 表单项属性名
  type: SearchComponentType // 表单项类型
  elColSpan?: number // 每列的宽度（基于 24 格布局）
  options?: SearchSelectOption[] | (() => SearchSelectOption[]) // select的选项
  onChange?: (changeParams: SearchChangeParams) => void // 搜索框更改事件
  config?: Record<string, unknown> // 额外配置项
}
