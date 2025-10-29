<template>
  <p class="section-title" :style="style">
    {{ title }}
  </p>
</template>

<script setup lang="ts">
  interface Props {
    title: string
    style?: Record<string, any>
  }

  defineProps<Props>()
</script>

<style lang="scss" scoped>
  .section-title {
    position: relative;
    margin: 30px 0 20px;
    font-size: 14px;
    color: var(--art-gray-800);
    text-align: center;

    &::before,
    &::after {
      position: absolute;
      top: 10px;
      width: 50px;
      margin: auto;
      content: '';
      border-bottom: 1px solid var(--art-gray-300);
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }
  }
</style>
