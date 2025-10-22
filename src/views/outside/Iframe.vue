<template>
  <div class="box-border w-full h-full" v-loading="isLoading">
    <iframe
      ref="iframeRef"
      :src="iframeUrl"
      frameborder="0"
      class="w-full h-full min-h-[calc(100vh-120px)] border-none"
      @load="handleIframeLoad"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
  import { getIframeRoutes } from '@/router/utils/menuToRouter'

  defineOptions({ name: 'IframeView' })

  const route = useRoute()
  const isLoading = ref(true)
  const iframeUrl = ref('')
  const iframeRef = ref<HTMLIFrameElement | null>(null)

  /**
   * Iframe 路由类型
   */
  interface IframeRoute {
    path: string
    meta?: {
      link?: string
      [key: string]: any
    }
    [key: string]: any
  }

  /**
   * 初始化 iframe URL
   * 从路由配置中获取对应的外部链接地址
   */
  onMounted(() => {
    const iframeRoute = getIframeRoutes().find((item: IframeRoute) => item.path === route.path)

    if (iframeRoute?.meta) {
      iframeUrl.value = iframeRoute.meta.link || ''
    }
  })

  /**
   * 处理 iframe 加载完成事件
   * 隐藏加载状态
   */
  const handleIframeLoad = (): void => {
    isLoading.value = false
  }
</script>
