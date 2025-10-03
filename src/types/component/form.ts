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
  // 异步验证函数
  asyncValidator?: (rule: any, value: any) => Promise<void>
  // 依赖的其他字段（当这些字段变化时重新验证）
  dependencies?: string[]
}

// 数据转换配置
export interface FormTransform {
  // 输入转换：外部数据 -> 表单显示值
  input?: (value: any, formData: Record<string, any>) => any
  // 输出转换：表单值 -> 提交数据
  output?: (value: any, formData: Record<string, any>) => any
}

// 动态数组字段配置
export interface FormArrayConfig {
  // 数组项的类型
  itemType?: ComponentMapKeys | string | (() => VNode)
  // 数组项的配置
  itemProps?: Record<string, any>
  // 最小项数
  min?: number
  // 最大项数
  max?: number
  // 添加按钮文本
  addText?: string
  // 删除按钮文本
  removeText?: string
  // 是否显示操作按钮
  showActions?: boolean
}

// 表单分组配置
export interface FormGroupConfig {
  // 分组标题
  title?: string
  // 是否可折叠
  collapsible?: boolean
  // 默认是否展开
  defaultExpanded?: boolean
  // 子表单项
  children: FormItem[]
}

// 表单项配置
export interface FormItem {
  /** 表单项的唯一标识 */
  key: string
  /** 表单项的标签文本 */
  label?: string
  /** 表单项标签的宽度，会覆盖 Form 的 labelWidth */
  labelWidth?: string | number
  /** 表单项类型，可以是预定义的字符串类型或自定义组件 */
  type?: ComponentMapKeys | string | (() => VNode) | 'array' | 'group'
  /** 是否隐藏该表单项，支持函数动态判断 */
  hidden?: boolean | ((formData: Record<string, any>) => boolean)
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
  /** 是否禁用该表单项 */
  disabled?: boolean
  /** 是否只读该表单项 */
  readonly?: boolean
  /** 表单项的默认值 */
  defaultValue?: any
  /** 表单项的验证规则 */
  rules?: FormRule[]
  /** 是否必填（快捷配置） */
  required?: boolean
  /** 必填提示信息 */
  requiredMessage?: string
  /** 提示信息（label旁的问号图标） */
  tooltip?: string
  /** 帮助文本（表单项下方的说明文字） */
  help?: string
  /** 数据转换配置 */
  transform?: FormTransform
  /** 依赖的字段（当这些字段变化时，重新验证当前字段） */
  dependencies?: string[]
  /** 动态数组字段配置 */
  arrayConfig?: FormArrayConfig
  /** 表单分组配置 */
  groupConfig?: FormGroupConfig
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
  /** 是否禁用整个表单 */
  disabled?: boolean
  /** 是否只读整个表单 */
  readonly?: boolean
  /** 外部传入的验证规则（向后兼容） */
  rules?: Record<string, FormRule[]>
  /** 表单项值变化回调 */
  onChange?: (key: string, value: any, formData: Record<string, any>) => void
  /** 保存表单初始值，用于重置 */
  initialValues?: Record<string, any>
}
