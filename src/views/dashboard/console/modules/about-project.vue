<template>
  <div class="art-card p-[20px] flex justify-between mb-5">
    <div>
      <h2 class="text-2xl font-medium">关于项目</h2>
      <p class="text-g-500 mt-[5px]">{{ systemName }} 是一款兼具设计美学与高效开发的后台系统</p>
      <p>使用了 Vue3、TypeScript、Vite、Element Plus 等前沿技术</p>

      <div class="flex flex-wrap max-w-[600px] mt-[35px]">
        <div
          class="w-[240px] flex items-center justify-between h-[50px] px-[15px] border border-g-200 cursor-pointer rounded-[8px] mr-[15px] mb-[15px] text-[14px] bg-g-100/50 duration-300 hover:-translate-y-[3px]"
          v-for="link in linkList"
          :key="link.label"
          @click="goPage(link.url)"
        >
          <span>{{ link.label }}</span>
          <i class="iconfont-sys">&#xe703;</i>
        </div>
      </div>
    </div>
    <img class="w-[300px]" src="@imgs/draw/draw1.png" alt="draw1" />
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
