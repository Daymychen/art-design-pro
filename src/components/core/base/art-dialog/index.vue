<template>
  <ElDialog
    :model-value="dialog.visible.value"
    v-bind="dialogProps"
    @update:model-value="dialog.setVisible"
    @opened="dialog.handleOpened"
    @closed="dialog.handleClosed"
  >
    <!-- 自定义 Header -->
    <template v-if="$slots.header" #header>
      <slot name="header" :close="dialog.close" />
    </template>

    <!-- 内容区域（插槽模式） -->
    <div class="art-dialog-content">
      <slot
        :close="dialog.close"
        :confirm="handleConfirmClick"
        :cancel="dialog.cancel"
        :loading="loading"
        :visible="dialog.visible.value"
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

  interface Emits {
    /** 确认按钮点击事件（插槽模式下使用） */
    (e: 'confirm-click'): void | Promise<void>
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 创建简短别名，保持响应式
  const dialog = props.dialogInstance

  // 简化访问 - 使用 computed
  const config = computed(() => dialog.dialogConfig.value)
  const loading = computed(() => dialog.loading.value)

  // 自定义属性的 key 列表（这些不应该透传给 ElDialog）
  const customKeys = new Set([
    'showFooter',
    'confirmText',
    'cancelText',
    'props',
    'onSubmit',
    'onCancel',
    'onOpened',
    'onClosed',
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
   * emit 事件给父组件，让父组件处理验证和提交
   */
  const handleConfirmClick = async () => {
    try {
      await emit('confirm-click')
    } catch (error) {
      // 只在开发环境记录错误详情，生产环境静默处理
      if (import.meta.env.DEV) {
        console.error('[ArtDialog] 确认操作失败:', error)
      }
      // 抛出错误，阻止弹窗关闭
      throw error
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
