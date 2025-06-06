<!-- System logo component -->
<template>
  <div class="art-logo">
    <img :style="logoStyle" src="@imgs/common/logo.webp" alt="logo" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    width: {
      type: Number,
      default: 36
    }
  })

  const logoStyle = computed(() => ({ width: `${props.width}px` }))
</script>

<style lang="scss" scoped>
  .art-logo {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
