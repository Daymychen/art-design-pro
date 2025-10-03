import type { Component } from 'vue'

/**
 * 弹窗配置选项
 */
export interface DialogOptions {
  /** 弹窗标题 */
  title?: string
  /** 弹窗宽度 */
  width?: string | number
  /** 是否显示 Footer */
  showFooter?: boolean
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 弹窗内容组件 */
  component?: Component
  /** 传递给内容组件的 props */
  props?: Record<string, any>
  /** 是否居中显示 */
  alignCenter?: boolean
  /** 是否可拖拽 */
  draggable?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnClickModal?: boolean
  /** 按 ESC 键是否关闭 */
  closeOnPressEscape?: boolean
  /** 是否全屏 */
  fullscreen?: boolean
  /** 确认回调 */
  onConfirm?: (data?: any) => void | Promise<void>
  /** 取消回调 */
  onCancel?: () => void | Promise<void>
  /** 打开前回调 */
  onOpen?: () => void
  /** 打开后回调 */
  onOpened?: () => void
  /** 关闭前回调 */
  onClose?: () => void
  /** 关闭后回调 */
  onClosed?: () => void
  /** 关闭前的钩子（可以阻止关闭） */
  beforeClose?: (done: () => void) => void
  /** 成功后是否显示消息 */
  showMessage?: boolean
  /** 成功消息文本 */
  successMessage?: string
  /** 成功后是否自动关闭 */
  closeOnSuccess?: boolean
}

/**
 * 弹窗实例接口
 */
export interface DialogInstance {
  /** 弹窗可见性 */
  visible: boolean
  /** 加载状态 */
  loading: boolean
  /** 打开弹窗 */
  open: (options: DialogOptions) => void
  /** 关闭弹窗 */
  close: () => void
  /** 确认操作 */
  confirm: (data?: any) => Promise<boolean>
  /** 取消操作 */
  cancel: () => Promise<void>
}
