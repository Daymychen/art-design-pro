<template>
  <ElDialog
    :model-value="dialog.visible.value"
    v-bind="dialogProps"
    @update:model-value="dialog.setVisible"
    @open="dialog.handleOpened"
    @close="dialog.handleClose"
    @closed="dialog.handleClosed"
  >
    <!-- 自定义 Header -->
    <template v-if="$slots.header" #header>
      <slot name="header" :close="dialog.close" :status="dialog.status.value" />
    </template>

    <!-- 内容区域 -->
    <div class="art-dialog-content">
      <!-- 动态组件模式 -->
      <component
        v-if="currentComponent"
        ref="contentRef"
        :is="currentComponent"
        v-bind="config.props"
        :loading="loading"
        :dialog-instance="dialog"
        @submit="handleContentSubmit"
        @cancel="dialog.cancel"
        @update:data="dialog.updateData"
      />

      <!-- 插槽模式 -->
      <slot
        v-else
        ref="contentRef"
        :close="dialog.close"
        :confirm="handleConfirmClick"
        :cancel="dialog.cancel"
        :loading="loading"
        :visible="dialog.visible.value"
        :status="dialog.status.value"
        :can-confirm="dialog.canConfirm.value"
        :dialog-instance="dialog"
        :props="config.props"
      />
    </div>

    <!-- Footer 区域 -->
    <template v-if="config.showFooter" #footer>
      <slot
        name="footer"
        :close="dialog.close"
        :confirm="handleConfirmClick"
        :cancel="dialog.cancel"
        :loading="loading"
        :can-confirm="dialog.canConfirm.value"
      >
        <div class="art-dialog-footer">
          <ElButton v-if="config.cancelText" :disabled="loading" @click="dialog.cancel">
            {{ config.cancelText }}
          </ElButton>
          <ElButton
            type="primary"
            :loading="loading"
            :disabled="!dialog.canConfirm.value"
            @click="handleConfirmClick"
          >
            {{ config.confirmText }}
          </ElButton>
        </div>
      </slot>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { useDialog } from '@/composables/useDialog'

  interface Props {
    /** useDialog 实例 */
    dialogInstance: ReturnType<typeof useDialog>
  }

  const props = defineProps<Props>()

  // 创建简短别名，保持响应式
  const dialog = props.dialogInstance

  // 简化访问 - 使用 computed
  const config = computed(() => dialog.dialogConfig.value)
  const loading = computed(() => dialog.loading.value)
  const currentComponent = computed(() => dialog.currentComponent.value)

  // 内容组件的引用（用于获取表单实例）
  const contentRef = ref()

  // 自定义属性的 key 列表（这些不应该透传给 ElDialog）
  const customKeys = new Set([
    'showFooter',
    'confirmText',
    'cancelText',
    'component',
    'props',
    'onConfirm',
    'onCancel',
    'onBeforeOpen',
    'onOpen',
    'onOpened',
    'onClose',
    'onClosed',
    'showMessage',
    'successMessage',
    'closeOnSuccess',
    'onError',
    'disableConfirm'
  ])

  // 透传 ElDialog 属性 - 自动过滤掉自定义属性，其余全部透传
  const dialogProps = computed(() => {
    const props: Record<string, any> = {}
    Object.keys(config.value).forEach((key) => {
      if (!customKeys.has(key)) {
        props[key] = config.value[key as keyof typeof config.value]
      }
    })
    return props
  })

  /**
   * 处理确认按钮点击
   * 1. 优先调用 dialog.confirm()（会执行 onConfirm 回调）
   * 2. onConfirm 回调中应该负责触发表单验证
   * 3. 如果没有 onConfirm 回调，则尝试调用内容组件的 handleSubmit（仅动态组件模式）
   */
  const handleConfirmClick = async () => {
    try {
      // 优先使用 onConfirm 回调（推荐方式，支持插槽模式和动态组件模式）
      if (config.value.onConfirm) {
        await dialog.confirm()
      }
      // 兜底：动态组件模式下，如果内容组件有 handleSubmit 方法
      else if (currentComponent.value && contentRef.value?.handleSubmit) {
        // 调用表单组件的 handleSubmit 方法
        // 该方法会先验证表单，验证通过后触发 @submit 事件
        await contentRef.value.handleSubmit()
      }
      // 没有任何回调，直接关闭
      else {
        await dialog.confirm()
      }
    } catch (error) {
      // 只在开发环境记录错误详情，生产环境静默处理
      if (import.meta.env.DEV) {
        console.error('[ArtDialog] 确认操作失败:', error)
      }
      // 错误已经在 useDialog 中显示给用户，这里只需要抛出即可，阻止弹窗关闭
      throw error
    }
  }

  /**
   * 处理内容组件的 submit 事件（仅动态组件模式）
   * 当表单验证通过后，会触发此方法
   */
  const handleContentSubmit = async (data?: any) => {
    // 如果有 onConfirm 回调，调用它
    if (config.value.onConfirm) {
      await dialog.confirm(data)
    } else {
      // 没有 onConfirm 回调，直接关闭弹窗
      dialog.close()
    }
  }
</script>

<style scoped lang="scss">
  .art-dialog-content {
    min-height: 100px;
  }

  .art-dialog-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
</style>
