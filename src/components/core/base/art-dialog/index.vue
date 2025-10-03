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
        :is="currentComponent"
        v-bind="config.props"
        :loading="loading"
        :dialog-instance="dialog"
        @submit="dialog.confirm"
        @cancel="dialog.cancel"
        @update:data="dialog.updateData"
      />

      <!-- 插槽模式 -->
      <slot
        v-else
        :close="dialog.close"
        :confirm="dialog.confirm"
        :cancel="dialog.cancel"
        :loading="loading"
        :visible="dialog.visible.value"
        :status="dialog.status.value"
        :can-confirm="dialog.canConfirm.value"
        :dialog-instance="dialog"
      />
    </div>

    <!-- Footer 区域 -->
    <template v-if="config.showFooter" #footer>
      <slot
        name="footer"
        :close="dialog.close"
        :confirm="dialog.confirm"
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
            @click="dialog.confirm"
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
