<template>
  <div class="page-content box-border !px-20 py-3.5 text-center max-md:!px-5" :class="type">
    <ArtSvgIcon
      class="icon size-22 p-2 mt-16 block rounded-full !text-white"
      :icon="iconCode"
      :class="type === 'success' ? 'bg-[#19BE6B]' : 'bg-[#ED4014]'"
    />
    <h1 class="title mt-8 text-3xl font-medium !text-g-900 max-md:mt-2.5 max-md:text-2xl">{{
      title
    }}</h1>
    <p class="msg mt-5 text-base text-g-600">{{ message }}</p>
    <div
      class="res mt-7.5 rounded bg-g-200/80 dark:bg-g-300/40 px-7.5 py-5.5 text-left max-md:px-7.5 max-md:py-2.5 [&_p]:flex [&_p]:items-center [&_p]:py-2 [&_p]:text-sm [&_p]:text-[#808695] [&_p_i]:mr-1.5"
    >
      <slot name="content"></slot>
    </div>
    <div class="btn-group mt-12.5">
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
