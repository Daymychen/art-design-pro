import { ref, computed, nextTick } from 'vue'
import type { DialogOptions } from '@/components/core/base/art-dialog/types'

// 导出类型供外部使用
export type { DialogOptions } from '@/components/core/base/art-dialog/types'

export function useDialog<T = any>() {
  /** 弹窗可见性 */
  const visible = ref(false)

  /** 加载状态 */
  const loading = ref(false)

  /** 默认配置 */
  const defaultConfig: DialogOptions<T> = {
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

  /** 弹窗配置 */
  const dialogConfig = ref<DialogOptions<T>>({ ...defaultConfig })

  /** 计算属性：是否可以确认 */
  const canConfirm = computed(() => !loading.value && !dialogConfig.value.disableConfirm)

  /**
   * 打开弹窗
   */
  const open = async (options: DialogOptions<T> = {}) => {
    // 合并配置
    dialogConfig.value = {
      ...defaultConfig,
      ...options
    }

    // 显示弹窗
    visible.value = true

    // 等待 DOM 更新
    await nextTick()

    return true
  }

  /**
   * 关闭弹窗
   */
  const close = () => {
    const { beforeClose } = dialogConfig.value

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
    const { onSubmit } = dialogConfig.value

    // 检查是否可以确认
    if (!canConfirm.value) {
      console.warn('Dialog confirm: 当前状态不允许确认操作')
      return false
    }

    loading.value = true

    try {
      // 执行提交回调
      if (onSubmit) {
        await onSubmit(data)
      }

      // 成功后自动关闭
      close()

      return true
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
    dialogConfig.value.onOpened?.()
  }

  /**
   * 弹窗关闭后的回调
   */
  const handleClosed = () => {
    // 重置状态
    loading.value = false

    // 触发关闭后回调
    dialogConfig.value.onClosed?.()
  }

  /**
   * 设置弹窗可见性
   */
  const setVisible = (value: boolean) => {
    visible.value = value
  }

  return {
    // 状态
    visible,
    loading,
    dialogConfig,
    canConfirm,

    // 核心方法
    open,
    close,
    confirm,
    cancel,

    // 辅助方法
    setVisible,

    // 生命周期钩子
    handleOpened,
    handleClosed
  }
}
