<template>
  <div class="layouts" :style="layoutStyle">
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
    <ArtWatermark :visible="watermarkVisible" />
  </div>
</template>

<script setup lang="ts">
  import '@/assets/styles/transition.scss'
  import { MenuWidth, MenuTypeEnum } from '@/enums/appEnum'

  // Composables
  import { useMenuStore } from '@/store/modules/menu'
  import { useSettingStore } from '@/store/modules/setting'
  import { getTabConfig } from '@/utils/tabs'

  // Store instances
  const settingStore = useSettingStore()
  const menuStore = useMenuStore()

  // Store refs
  const { menuType, menuOpen, showWorkTab, watermarkVisible, tabStyle } = storeToRefs(settingStore)

  const paddingLeft = computed(() => {
    const isOpen = menuOpen.value
    const type = menuType.value
    const width = isOpen ? settingStore.getMenuOpenWidth : MenuWidth.CLOSE

    menuStore.setMenuWidth(width)

    if (type === MenuTypeEnum.DUAL_MENU) {
      return `calc(${width} + 80px)`
    }

    return type !== MenuTypeEnum.TOP ? width : 0
  })

  const paddingTop = computed(() => {
    const { openTop, closeTop } = getTabConfig(tabStyle.value)
    return `${showWorkTab.value ? openTop : closeTop}px`
  })

  // Layout style computed
  const layoutStyle = computed(() => ({
    paddingLeft: paddingLeft.value,
    paddingTop: paddingTop.value
  }))
</script>

<style lang="scss" scoped>
  @use './style';
</style>
