import { ref, computed, nextTick } from 'vue'
import type { DialogOptions, UseDialogOptions } from '@/components/core/base/art-dialog/types'

const DEFAULT_DIALOG_CONFIG: DialogOptions<any> = {
  // 自定义属性默认值
  showFooter: true,
  confirmText: '确定',
  cancelText: '取消',
  disableConfirm: false,
  // ElDialog 默认值
  title: '弹窗',
  width: '600px',
  alignCenter: true,
  draggable: false,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  destroyOnClose: false
}

const mergeDialogOptions = <T>(
  ...configs: Array<DialogOptions<T> | undefined>
): DialogOptions<T> => {
  const merged: DialogOptions<T> = {} as DialogOptions<T>

  configs.forEach((config) => {
    if (!config) return

    const { props: configProps, ...rest } = config

    Object.assign(merged, rest)

    if (configProps) {
      merged.props = {
        ...(merged.props || {}),
        ...configProps
      }
    }
  })

  return merged
}

const buildBaseConfig = <T>(config?: DialogOptions<T>) =>
  mergeDialogOptions(DEFAULT_DIALOG_CONFIG as DialogOptions<T>, config)

export function useDialog<T = any>(options: UseDialogOptions<T> = {}) {
  const { defaults, resetOnClose = true } = options

  /** 弹窗可见性 */
  const visible = ref(false)

  /** 加载状态 */
  const loading = ref(false)

  /** 默认配置（可通过 setDefaults 更新） */
  const baseConfig = ref<DialogOptions<T>>(buildBaseConfig(defaults))

  /** 弹窗配置 */
  const dialogConfig = ref<DialogOptions<T>>(mergeDialogOptions(baseConfig.value))

  /** 计算属性：是否可以确认 */
  const canConfirm = computed(() => !loading.value && !dialogConfig.value.disableConfirm)

  /**
   * 重置弹窗配置为默认值
   */
  const resetConfig = () => {
    dialogConfig.value = mergeDialogOptions(baseConfig.value)
  }

  /**
   * 更新默认配置（影响后续 open 行为）
   */
  const setDefaults = (
    config: DialogOptions<T> | ((prev: DialogOptions<T>) => DialogOptions<T>)
  ) => {
    const next = typeof config === 'function' ? config(baseConfig.value) : config
    baseConfig.value = buildBaseConfig(next)

    if (!visible.value) {
      resetConfig()
    }
  }

  /**
   * 合并更新当前配置
   */
  const updateConfig = (config: DialogOptions<T>) => {
    dialogConfig.value = mergeDialogOptions(dialogConfig.value, config)
  }

  /**
   * 打开弹窗
   */
  const open = async (optionOverrides: DialogOptions<T> = {}) => {
    dialogConfig.value = mergeDialogOptions(baseConfig.value, optionOverrides)
    visible.value = true
    await nextTick()
    return true
  }

  /**
   * 关闭弹窗（无拦截）
   */
  const close = () => {
    visible.value = false
  }

  /**
   * 提交表单数据
   * 执行 onSubmit 回调并在成功后自动关闭弹窗
   * @param data - 要提交的表单数据（可选）
   * @returns Promise<void> - 成功时 resolve，失败时 reject
   * @throws {Error} 当前状态不允许提交或 onSubmit 失败时抛出
   */
  const submit = async (data?: T): Promise<void> => {
    if (!canConfirm.value) {
      const error = new Error('当前状态不允许提交操作（loading 或 disableConfirm）')
      console.warn('Dialog submit:', error.message)
      throw error
    }

    const { onSubmit } = dialogConfig.value
    const shouldToggleLoading = typeof onSubmit === 'function'

    try {
      if (shouldToggleLoading) {
        loading.value = true
        await onSubmit?.(data)
      }

      close()
    } catch (error) {
      console.error('Dialog submit error:', error)
      throw error
    } finally {
      if (shouldToggleLoading) {
        loading.value = false
      }
    }
  }

  /**
   * 取消操作
   */
  const cancel = async (): Promise<boolean> => {
    const { onCancel } = dialogConfig.value

    try {
      await onCancel?.()
      close()
      return true
    } catch (error) {
      console.warn('Dialog cancel intercepted:', error)
      visible.value = true
      return false
    }
  }

  /**
   * 弹窗打开后的回调
   */
  const handleOpened = () => {
    dialogConfig.value.onOpened?.()
  }

  /**
   * 弹窗关闭后的回调
   */
  const handleClosed = () => {
    const onClosedCallback = dialogConfig.value.onClosed

    loading.value = false

    if (resetOnClose) {
      resetConfig()
    }

    onClosedCallback?.()
  }

  /**
   * 设置弹窗可见性
   * 关闭时会调用 cancel（支持 onCancel 拦截）
   */
  const setVisible = async (value: boolean) => {
    if (value) {
      visible.value = true
      return true
    }

    return cancel()
  }

  return {
    // 状态
    visible,
    loading,
    dialogConfig,
    canConfirm,

    // 默认配置管理
    setDefaults,
    resetConfig,

    // 核心方法
    open,
    close,
    submit,
    cancel,

    // 辅助方法
    setVisible,
    updateConfig,

    // 生命周期钩子
    handleOpened,
    handleClosed
  }
}
