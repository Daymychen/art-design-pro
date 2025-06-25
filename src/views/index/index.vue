<template>
  <!-- 布局容器 -->
  <ArtLayouts>
    <!-- 顶栏、水平/混合菜单 -->
    <ArtHeaderBar />
    <!-- 左侧/双列菜单 -->
    <ArtSidebarMenu />
    <!-- 页面内容 -->
    <ArtPageContent />
    <!-- 设置面板 -->
    <ArtSettingsPanel />
    <!-- 全局搜索 -->
    <ArtGlobalSearch />
    <!-- 屏幕锁定 -->
    <ArtScreenLock />
    <!-- 聊天窗口 -->
    <ArtChatWindow />
    <!-- 礼花效果 -->
    <ArtFireworksEffect />
    <!-- 水印效果 -->
    <ArtWatermark />
  </ArtLayouts>
</template>

<script setup lang="ts">
  defineOptions({ name: 'IndexLayout' })
</script>

<style lang="scss" scoped>
  @use './style';
</style>
