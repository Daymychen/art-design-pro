<template>
  <div class="setting-drawer">
    <ElDrawer
      size="300px"
      v-model="visible"
      :lock-scroll="true"
      :with-header="false"
      :before-close="handleClose"
      :destroy-on-close="false"
      modal-class="setting-modal"
      @open="handleOpen"
      @close="handleDrawerClose"
    >
      <div class="drawer-con">
        <slot />
      </div>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: boolean
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'open'): void
    (e: 'close'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const visible = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value)
  })

  const handleOpen = () => {
    emit('open')
  }

  const handleDrawerClose = () => {
    emit('close')
  }

  const handleClose = () => {
    visible.value = false
  }
</script>

<style lang="scss" scoped>
  .drawer-con {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
