<template>
  <div class="art-table-full-screen" :style="{ height: containerMinHeight }">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { useCommon } from '@/composables/useCommon'
  const { containerMinHeight } = useCommon()
</script>

<style lang="scss" scoped>
  .art-table-full-screen {
    :deep(#table-full-screen) {
      display: flex;
      flex-direction: column;
      height: 100%;

      @media (max-width: $device-phone) {
        height: auto;
      }
    }
  }
</style>
