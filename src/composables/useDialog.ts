import { ref, computed, nextTick } from 'vue'
import type { DialogOptions } from '@/components/core/base/art-dialog/types'

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
   * 关闭弹窗（简化版，无拦截）
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
    const { onSubmit } = dialogConfig.value

    // 检查是否可以提交（统一使用抛出错误的方式）
    if (!canConfirm.value) {
      const error = new Error('当前状态不允许提交操作（loading 或 disableConfirm）')
      console.warn('Dialog submit:', error.message)
      throw error
    }

    try {
      loading.value = true

      // 执行提交回调
      if (onSubmit) {
        await onSubmit(data)
      }

      // 成功后自动关闭
      close()
    } catch (error) {
      // 记录错误但重新抛出，让调用方可以处理
      console.error('Dialog submit error:', error)
      throw error // 重新抛出错误，保持错误传播链
    } finally {
      loading.value = false
    }
  }

  /**
   * 取消操作
   */
  const cancel = async (): Promise<boolean> => {
    const { onCancel } = dialogConfig.value

    try {
      // 执行取消回调（如果有）
      if (onCancel) {
        await onCancel()
      }

      // 成功后关闭弹窗
      close()
      return true
    } catch (error) {
      // onCancel 抛出错误，阻止关闭弹窗
      console.warn('Dialog cancel intercepted:', error)
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
    // 保存 onClosed 回调，因为重置后会清除
    const onClosedCallback = dialogConfig.value.onClosed

    // 重置所有状态，避免污染下次打开
    loading.value = false
    dialogConfig.value = { ...defaultConfig }

    // 触发关闭后回调
    onClosedCallback?.()
  }

  /**
   * 设置弹窗可见性
   * 关闭时会调用 cancel（支持 onCancel 拦截）
   */
  const setVisible = (value: boolean) => {
    if (!value) {
      cancel()
    } else {
      visible.value = value
    }
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
    submit,
    cancel,

    // 辅助方法
    setVisible,

    // 生命周期钩子
    handleOpened,
    handleClosed
  }
}
