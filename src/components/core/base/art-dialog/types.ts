import type { Ref, ComputedRef } from 'vue'
import type { DialogProps } from 'element-plus'

/**
 * 自定义弹窗配置（非 ElDialog 原生属性）
 */
interface CustomDialogOptions<T = any> {
  /** 是否显示 Footer */
  showFooter?: boolean
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 传递给内容组件的 props */
  props?: Record<string, any>
  /** 提交回调（表单验证通过后自动调用） */
  onSubmit?: (data?: T) => void | Promise<void>
  /** 取消回调（抛出错误可阻止关闭，用于关闭前确认） */
  onCancel?: () => void | Promise<void>
  /** 打开后回调（用于 DOM 操作） */
  onOpened?: () => void
  /** 关闭后回调（用于清理资源） */
  onClosed?: () => void
  /** 是否禁用确认按钮 */
  disableConfirm?: boolean
}

/**
 * 弹窗配置选项（自定义属性 + ElDialog 原生属性）
 */
export type DialogOptions<T = any> = CustomDialogOptions<T> & Partial<DialogProps>

/**
 * useDialog 额外配置
 */
export interface UseDialogOptions<T = any> {
  /** 初始化默认配置 */
  defaults?: DialogOptions<T>
  /** 关闭后是否自动重置为默认配置，默认 true */
  resetOnClose?: boolean
}

/**
 * 弹窗实例接口
 */
export interface DialogInstance<T = any> {
  /** 弹窗可见性 */
  visible: Ref<boolean>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 弹窗配置 */
  dialogConfig: Ref<DialogOptions<T>>
  /** 是否可以确认（计算属性） */
  canConfirm: ComputedRef<boolean>
  /** 更新默认配置 */
  setDefaults: (config: DialogOptions<T> | ((prev: DialogOptions<T>) => DialogOptions<T>)) => void
  /** 重置当前配置为默认值 */
  resetConfig: () => void
  /** 打开弹窗 */
  open: (options?: DialogOptions<T>) => Promise<boolean>
  /** 关闭弹窗 */
  close: () => void
  /** 提交表单数据（执行 onSubmit 并自动关闭），失败时抛出错误 */
  submit: (data?: T) => Promise<void>
  /** 取消操作（onCancel 抛错时返回 false） */
  cancel: () => Promise<boolean>
  /** 设置弹窗可见性 */
  setVisible: (value: boolean) => Promise<boolean>
  /** 合并更新当前配置 */
  updateConfig: (config: DialogOptions<T>) => void
  /** 打开后回调 */
  handleOpened: () => void
  /** 关闭后回调 */
  handleClosed: () => void
}
