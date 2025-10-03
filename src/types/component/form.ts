import type { ComponentMapKeys } from '@/components/core/forms/art-form/componentMap'

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

// 表单项配置
export interface FormItem {
  /** 表单项的唯一标识 */
  key: string
  /** 表单项的标签文本 */
  label: string
  /** 表单项标签的宽度，会覆盖 Form 的 labelWidth */
  labelWidth?: string | number
  /** 表单项类型，可以是预定义的字符串类型或自定义组件 */
  type: ComponentMapKeys | string | (() => VNode)
  /** 是否隐藏该表单项 */
  hidden?: boolean
  /** 表单项占据的列宽，基于24格栅格系统 */
  span?: number
  /** 选项数据，用于 select、checkbox-group、radio-group 等 */
  options?: Record<string, any>
  /** 传递给表单项组件的属性 */
  props?: Record<string, any>
  /** 表单项的插槽配置 */
  slots?: Record<string, (() => any) | undefined>
  /** 表单项的占位符文本 */
  placeholder?: string
  /** 表单项的验证规则 */
  rules?: FormRule[]
  /** 是否必填（快捷配置） */
  required?: boolean
  /** 必填提示信息 */
  requiredMessage?: string
  /** 更多属性配置请参考 ElementPlus 官方文档 */
}

// 表单配置
export interface FormProps {
  /** 表单数据 */
  items: FormItem[]
  /** 每列的宽度（基于 24 格布局） */
  span?: number
  /** 表单控件间隙 */
  gutter?: number
  /** 表单域标签的位置 */
  labelPosition?: 'left' | 'right' | 'top'
  /** 文字宽度 */
  labelWidth?: string | number
  /** 外部传入的验证规则（向后兼容） */
  rules?: Record<string, FormRule[]>
}
