<!-- 系统logo -->
<template>
  <div class="art-logo">
    <img :style="logoStyle" src="@imgs/common/logo.webp" alt="logo" />
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtLogo' })

  interface Props {
    /** logo 大小 */
    size?: number | string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 36
  })

  const logoStyle = computed(() => ({ width: `${props.size}px` }))
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
