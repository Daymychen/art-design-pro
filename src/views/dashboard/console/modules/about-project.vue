<template>
  <div class="art-card p-5 flex justify-between mb-5">
    <div>
      <h2 class="text-2xl font-medium">关于项目</h2>
      <p class="text-g-700 mt-1">{{ systemName }} 是一款兼具设计美学与高效开发的后台系统</p>
      <p class="text-g-700 mt-1">使用了 Vue3、TypeScript、Vite、Element Plus 等前沿技术</p>

      <div class="flex flex-wrap gap-3.5 max-w-[600px] mt-[35px]">
        <div
          class="w-[240px] flex-between h-[50px] px-3.5 border border-g-300 c-p rounded-[8px] text-sm bg-g-100 duration-300 hover:-translate-y-[3px] max-[500px]:w-full"
          v-for="link in linkList"
          :key="link.label"
          @click="goPage(link.url)"
        >
          <span class="text-g-700">{{ link.label }}</span>
          <ArtSvgIcon icon="ri:arrow-right-s-line" class="text-lg text-g-600" />
        </div>
      </div>
    </div>
    <img class="w-[300px] max-md:hidden" src="@imgs/draw/draw1.png" alt="draw1" />
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { WEB_LINKS } from '@/utils/constants'

  const systemName = AppConfig.systemInfo.name

  const linkList = [
    { label: '项目官网', url: WEB_LINKS.DOCS },
    { label: '文档', url: WEB_LINKS.INTRODUCE },
    { label: 'Github', url: WEB_LINKS.GITHUB_HOME },
    { label: '博客', url: WEB_LINKS.BLOG }
  ]

  /**
   * 在新标签页中打开指定 URL
   * @param url 要打开的网页地址
   */
  const goPage = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
</script>
