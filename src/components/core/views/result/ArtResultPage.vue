<template>
  <div class="page-content box-border !px-20 py-3.5 text-center max-md:px-5" :class="type">
    <ArtSvgIcon
      class="icon mt-[6vh] block !text-8xl max-md:mt-[4vh] max-md:!text-6xl"
      :icon="iconCode"
    />
    <h1 class="title mt-5 text-3xl font-medium !text-g-900 max-md:mt-2.5 max-md:text-2xl">{{
      title
    }}</h1>
    <p class="msg mt-5 text-base text-g-600">{{ message }}</p>
    <div
      class="res mt-7.5 rounded bg-g-100 px-7.5 py-[22px] text-left max-md:px-7.5 max-md:py-2.5 [&_p]:flex [&_p]:items-center [&_p]:py-2 [&_p]:text-sm [&_p]:text-[#808695] [&_p_i]:mr-1.5"
    >
      <slot name="content"></slot>
    </div>
    <div class="btn-group mt-[50px]">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtResultPage' })

  interface ResultPageProps {
    /** 成功/失败 */
    type: 'success' | 'fail'
    /** 标题 */
    title: string
    /** 消息 */
    message: string
    /** 图标 */
    iconCode: string
  }

  withDefaults(defineProps<ResultPageProps>(), {
    type: 'success',
    title: '',
    message: '',
    iconCode: ''
  })
</script>

<style scoped>
  .success .icon {
    color: #19be6b !important;
  }

  .fail .icon {
    color: #ed4014 !important;
  }

  .fail .res :deep(p i) {
    color: #ed4014;
  }

  .dark .res {
    background: #28282a;
  }
</style>
