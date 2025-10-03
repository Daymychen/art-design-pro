<template>
  <!-- 可选按钮 -->
  <ElButton v-if="showButton" v-bind="buttonAttrs" @click="open">
    {{ text || '按钮' }}
  </ElButton>

  <!-- 弹窗 -->
  <ElDialog v-model="visible" v-bind="dialogProps" @close="close" width="30%" align-center>
    <!-- 内容插槽 -->
    <slot :close="close" :onSuccess="onSuccess" :visible="visible" />

    <!-- 可选 footer -->
    <template #footer v-if="showFooter">
      <ElButton ton @click="close">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleConfirm"> 确定 </ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { ref, computed, useAttrs } from 'vue'
  import { ElButton, type DialogProps } from 'element-plus'

  interface Props {
    // Button Props
    text?: string
    showButton?: boolean // 是否显示触发按钮
    // Dialog Props
    dialogProps?: Partial<DialogProps>
    showFooter?: boolean // 是否显示底部操作按钮
    // Callback
    onConfirm?: () => void | Promise<void> // 确认回调（可选，支持异步）
  }

  const props = withDefaults(defineProps<Props>(), {
    showButton: true,
    showFooter: true,
    dialogProps: () => ({
      title: '标题',
      width: '600px'
    })
  })

  const attrs = useAttrs()

  // 将 attrs 绑定到 button
  const buttonAttrs = computed(() => attrs)

  const emit = defineEmits<{
    (e: 'click'): void
    (e: 'open'): void
    (e: 'close'): void
    (e: 'confirm'): void
    (e: 'success', payload?: unknown): void
  }>()

  const visible = ref(false)
  const loading = ref(false)

  function open() {
    visible.value = true
    emit('open')
  }
  function close() {
    visible.value = false
    emit('close')
  }
  async function handleConfirm() {
    try {
      loading.value = true
      if (props.onConfirm) {
        await props.onConfirm()
      }
      emit('confirm')
      emit('success')
      close()
    } finally {
      loading.value = false
    }
  }

  // 插槽方法
  function onSuccess(payload?: unknown) {
    emit('success', payload)
    close()
  }

  defineExpose({ open, close })
</script>
