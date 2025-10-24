<template>
  <div class="page-content !border-0 !bg-transparent min-h-screen flex-center">
    <div class="flex-center max-md:block max-md:text-center">
      <ThemeSvg :src="data.imgUrl" size="100%" class="w-[300px] max-md:w-[200px]" />
      <div class="ml-[60px] w-[300px] max-md:mx-auto max-md:mt-10 max-md:w-full max-md:text-center">
        <p class="text-xl leading-7 text-g-600 max-md:text-lg">{{ data.desc }}</p>
        <ElButton type="primary" size="large" @click="backHome" v-ripple class="mt-5">{{
          data.btnText
        }}</ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCommon } from '@/composables/useCommon'

  const router = useRouter()

  interface ExceptionData {
    /** 标题 */
    title: string
    /** 描述 */
    desc: string
    /** 按钮文本 */
    btnText: string
    /** 图片地址 */
    imgUrl: string
  }

  withDefaults(
    defineProps<{
      data: ExceptionData
    }>(),
    {}
  )

  const backHome = () => {
    router.push(useCommon().homePath.value)
  }
</script>
