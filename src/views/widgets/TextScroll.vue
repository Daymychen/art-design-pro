<template>
  <div class="page-content">
    <!-- 基础用法 -->
    <TextScroll
      text="Art Design Pro 是一款专注于用户体验和视觉设计的后台管理系统模版 <a target='_blank' href='https://www.lingchen.kim/art-design-pro/docs/'>点击我 </a>访问官方文档"
    />

    <!-- 使用不同的类型 -->
    <TextScroll type="success" text="这是一条成功类型的滚动公告" />

    <TextScroll type="warning" text="这是一条警告类型的滚动公告" />

    <TextScroll type="danger" text="这是一条危险类型的滚动公告" />

    <TextScroll type="info" text="这是一条信息类型的滚动公告" />

    <!-- 自定义速度和方向 -->
    <TextScroll text="这是一条速度较慢、向右滚动的公告" :speed="30" direction="right" />
  </div>
</template>

<script setup lang="ts">
  import TextScroll from '@/components/Widgets/TextScroll.vue'
</script>

<style lang="scss" scoped>
  .page-content {
    :deep(.text-scroll-container) {
      margin-bottom: 20px;
    }
  }
</style>
