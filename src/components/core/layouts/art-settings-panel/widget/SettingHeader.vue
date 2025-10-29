<template>
  <div class="setting-header">
    <div class="close-wrap">
      <div @click="$emit('close')" class="flex-c c-p text-g-500">
        <ArtSvgIcon icon="ri:close-fill" class="text-lg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineEmits<{
    close: []
  }>()
</script>

<style lang="scss" scoped>
  .setting-header {
    .close-wrap {
      display: flex;
      justify-content: flex-end;

      i {
        display: block;
        padding: 8px;
        font-size: 15px;
        font-weight: bold;
        color: var(--art-gray-600);
        cursor: pointer;
        border-radius: 5px;

        &:hover {
          color: var(--art-gray-700);
          background-color: var(--art-gray-300);
        }
      }
    }
  }
</style>
