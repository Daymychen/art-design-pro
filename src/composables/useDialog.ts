import { ref, shallowRef, type Component, computed, nextTick } from 'vue'
import { ElMessage, type DialogProps } from 'element-plus'

/**
 * 弹窗状态枚举
 */
export enum DialogStatus {
  IDLE = 'idle',
  OPENING = 'opening',
  OPENED = 'opened',
  CLOSING = 'closing',
  CLOSED = 'closed'
}

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
  /** 弹窗内容组件 */
  component?: Component
  /** 传递给内容组件的 props */
  props?: Record<string, any>
  /** 确认回调 */
  onConfirm?: (data?: T) => void | Promise<void>
  /** 取消回调 */
  onCancel?: () => void | Promise<void>
  /** 打开前回调（可以阻止打开） */
  onBeforeOpen?: () => boolean | Promise<boolean>
  /** 打开时回调 */
  onOpen?: () => void
  /** 打开后回调 */
  onOpened?: () => void
  /** 关闭前回调 */
  onClose?: () => void
  /** 关闭后回调 */
  onClosed?: () => void
  /** 成功后是否显示消息 */
  showMessage?: boolean
  /** 成功消息文本 */
  successMessage?: string
  /** 成功后是否自动关闭 */
  closeOnSuccess?: boolean
  /** 错误处理回调 */
  onError?: (error: Error) => void
  /** 是否禁用确认按钮 */
  disableConfirm?: boolean
}

/**
 * 弹窗配置选项（自定义属性 + ElDialog 原生属性）
 */
export type DialogOptions<T = any> = CustomDialogOptions<T> & Partial<DialogProps>

/**
 * useDialog - 弹窗管理 Composable
 *
 * @example 基础用法
 * ```ts
 * const userDialog = useDialog()
 *
 * // 打开弹窗
 * userDialog.open({
 *   title: '新增用户',
 *   component: UserForm,
 *   props: { type: 'add' },
 *   onConfirm: async (data) => {
 *     await createUser(data)
 *   }
 * })
 * ```
 *
 * @example 快捷方法
 * ```ts
 * // 确认对话框
 * await userDialog.showConfirm({
 *   title: '删除确认',
 *   message: '确定要删除这条记录吗？'
 * })
 *
 * // 警告对话框
 * await userDialog.showAlert({
 *   title: '提示',
 *   message: '操作已完成'
 * })
 * ```
 */
export function useDialog<T = any>() {
  /** 弹窗可见性 */
  const visible = ref(false)

  /** 加载状态 */
  const loading = ref(false)

  /** 弹窗状态 */
  const status = ref<DialogStatus>(DialogStatus.IDLE)

  /** 默认配置（只包含自定义属性的默认值） */
  const defaultConfig: DialogOptions<T> = {
    // 自定义属性默认值
    showFooter: true,
    confirmText: '确定',
    cancelText: '取消',
    closeOnSuccess: true,
    showMessage: false,
    successMessage: '操作成功',
    disableConfirm: false,
    // ElDialog 默认值（常用的）
    title: '弹窗',
    width: '600px',
    alignCenter: true,
    draggable: false,
    closeOnClickModal: false,
    closeOnPressEscape: true,
    destroyOnClose: false
  }

  /** 弹窗配置 */
  const dialogConfig = ref<DialogOptions<T>>({ ...defaultConfig })

  /** 当前显示的组件 */
  const currentComponent = shallowRef<Component>()

  /** 传递给内容组件的数据 */
  const componentData = ref<T | null>(null)

  /** 计算属性：是否可以确认 */
  const canConfirm = computed(() => !loading.value && !dialogConfig.value.disableConfirm)

  /** 计算属性：是否正在打开 */
  const isOpening = computed(() => status.value === DialogStatus.OPENING)

  /** 计算属性：是否已打开 */
  const isOpened = computed(() => status.value === DialogStatus.OPENED)

  /**
   * 打开弹窗
   */
  const open = async (options: DialogOptions<T> = {}) => {
    try {
      status.value = DialogStatus.OPENING

      // 执行打开前回调（可以阻止打开）
      const canOpen = await options.onBeforeOpen?.()
      if (canOpen === false) {
        status.value = DialogStatus.IDLE
        return false
      }

      // 合并配置（基于默认配置）
      dialogConfig.value = {
        ...defaultConfig,
        ...options
      }

      // 设置当前组件
      currentComponent.value = options.component

      // 触发打开时回调
      options.onOpen?.()

      // 显示弹窗
      visible.value = true

      // 等待 DOM 更新
      await nextTick()

      return true
    } catch (error) {
      console.error('Dialog open error:', error)
      status.value = DialogStatus.IDLE
      return false
    }
  }

  /**
   * 关闭弹窗
   */
  const close = () => {
    const { beforeClose } = dialogConfig.value

    status.value = DialogStatus.CLOSING

    if (beforeClose) {
      beforeClose(() => {
        visible.value = false
      })
    } else {
      visible.value = false
    }
  }

  /**
   * 确认操作
   */
  const confirm = async (data?: T) => {
    const { onConfirm, showMessage, successMessage, closeOnSuccess, onError } = dialogConfig.value

    // 检查是否可以确认
    if (!canConfirm.value) {
      console.warn('Dialog confirm: 当前状态不允许确认操作')
      return false
    }

    try {
      loading.value = true

      // 执行确认回调
      if (onConfirm) {
        await onConfirm(data)
      }

      // 显示成功消息
      if (showMessage) {
        ElMessage.success(successMessage || '操作成功')
      }

      // 成功后自动关闭
      if (closeOnSuccess !== false) {
        close()
      }

      return true
    } catch (error) {
      // 统一错误对象处理
      let err: Error
      if (error instanceof Error) {
        err = error
      } else if (typeof error === 'string') {
        err = new Error(error)
      } else if (error && typeof error === 'object') {
        // 处理对象类型的错误（如 Element Plus 验证错误）
        err = new Error(JSON.stringify(error))
      } else {
        err = new Error('未知错误')
      }

      // 调用错误处理回调
      if (onError) {
        onError(err)
      } else {
        // 如果没有自定义错误处理，显示用户友好的错误消息
        if (err.message && err.message !== 'Error' && err.message !== '未知错误') {
          ElMessage.error(err.message)
        }
      }

      // 继续抛出原始错误，让调用方处理（如阻止弹窗关闭）
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 取消操作
   */
  const cancel = async () => {
    const { onCancel } = dialogConfig.value

    try {
      loading.value = true
      await onCancel?.()
      close()
      return true
    } catch (error) {
      console.error('Dialog cancel error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 弹窗打开后的回调
   */
  const handleOpened = () => {
    status.value = DialogStatus.OPENED
    dialogConfig.value.onOpened?.()
  }

  /**
   * 弹窗关闭前的回调
   */
  const handleClose = () => {
    dialogConfig.value.onClose?.()
  }

  /**
   * 弹窗关闭后的回调
   */
  const handleClosed = () => {
    status.value = DialogStatus.CLOSED

    // 重置状态
    loading.value = false

    // 如果启用了销毁时清空，清空组件和数据
    if (dialogConfig.value.destroyOnClose) {
      currentComponent.value = undefined
      componentData.value = null
    }

    // 触发关闭后回调
    dialogConfig.value.onClosed?.()

    // 最终重置为 IDLE 状态
    nextTick(() => {
      status.value = DialogStatus.IDLE
    })
  }

  /**
   * 更新组件数据
   */
  const updateData = (data: T) => {
    componentData.value = data
  }

  /**
   * 设置弹窗可见性
   */
  const setVisible = (value: boolean) => {
    visible.value = value
  }

  /**
   * 更新弹窗配置
   */
  const updateConfig = (options: Partial<DialogOptions<T>>) => {
    dialogConfig.value = {
      ...dialogConfig.value,
      ...options
    }
  }

  /**
   * 重置弹窗状态
   */
  const reset = () => {
    visible.value = false
    loading.value = false
    status.value = DialogStatus.IDLE
    currentComponent.value = undefined
    componentData.value = null
    dialogConfig.value = { ...defaultConfig }
  }

  /**
   * 快捷方法：显示确认对话框
   */
  const showConfirm = (options: {
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'warning' | 'error' | 'info'
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      open({
        title: options.title || '确认',
        width: '420px',
        showFooter: true,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        component: undefined,
        props: {
          message: options.message,
          type: options.type || 'warning'
        },
        onConfirm: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
  }

  /**
   * 快捷方法：显示警告对话框
   */
  const showAlert = (options: {
    title?: string
    message: string
    confirmText?: string
    type?: 'success' | 'warning' | 'error' | 'info'
  }): Promise<void> => {
    return new Promise((resolve) => {
      open({
        title: options.title || '提示',
        width: '420px',
        showFooter: true,
        confirmText: options.confirmText || '确定',
        cancelText: undefined,
        component: undefined,
        props: {
          message: options.message,
          type: options.type || 'info'
        },
        onConfirm: () => {
          resolve()
        }
      })
    })
  }

  /**
   * 设置加载状态
   */
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  return {
    // 状态
    visible,
    loading,
    status,
    dialogConfig,
    currentComponent,
    componentData,

    // 计算属性
    canConfirm,
    isOpening,
    isOpened,

    // 核心方法
    open,
    close,
    confirm,
    cancel,

    // 辅助方法
    updateData,
    updateConfig,
    setVisible,
    setLoading,
    reset,

    // 快捷方法
    showConfirm,
    showAlert,

    // 生命周期钩子
    handleOpened,
    handleClose,
    handleClosed
  }
}
