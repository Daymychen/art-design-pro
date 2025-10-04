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
  /** 取消回调 */
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
  /** 打开弹窗 */
  open: (options?: DialogOptions<T>) => Promise<boolean>
  /** 关闭弹窗 */
  close: () => void
  /** 提交表单数据（执行 onSubmit 并自动关闭） */
  submit: (data?: T) => Promise<boolean>
  /** 取消操作 */
  cancel: () => Promise<boolean>
  /** 设置弹窗可见性 */
  setVisible: (value: boolean) => void
  /** 打开后回调 */
  handleOpened: () => void
  /** 关闭后回调 */
  handleClosed: () => void
}
