<template>
  <div
    class="page-content box-border !px-[100px] !py-[15px] text-center max-md:!px-[25px]"
    :class="type"
  >
    <i
      class="iconfont-sys icon mt-[6vh] block !text-[80px] max-md:mt-[4vh] max-md:!text-[60px]"
      v-html="iconCode"
    ></i>
    <h1
      class="title mt-5 text-[30px] font-medium !text-[var(--art-text-gray-900)] max-md:mt-2.5 max-md:text-[25px]"
      >{{ title }}</h1
    >
    <p class="msg mt-5 text-base text-[#808695]">{{ message }}</p>
    <div
      class="res mt-[30px] rounded-[5px] bg-[#f8f8f9] px-[30px] py-[22px] text-left max-md:px-[30px] max-md:py-2.5 [&_p]:flex [&_p]:items-center [&_p]:py-2 [&_p]:text-[15px] [&_p]:text-[#808695] [&_p_i]:mr-1.5"
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
