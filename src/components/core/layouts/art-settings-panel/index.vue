<!-- 设置面板 -->
<template>
  <div class="layout-settings">
    <SettingDrawer v-model="showDrawer" @open="handleOpen" @close="handleClose">
      <!-- 头部关闭按钮 -->
      <SettingHeader @close="closeDrawer" />
      <!-- 主题风格 -->
      <ThemeSettings />
      <!-- 菜单布局 -->
      <MenuLayoutSettings />
      <!-- 菜单风格 -->
      <MenuStyleSettings />
      <!-- 系统主题色 -->
      <ColorSettings />
      <!-- 盒子样式 -->
      <BoxStyleSettings />
      <!-- 容器宽度 -->
      <ContainerSettings />
      <!-- 基础配置 -->
      <BasicSettings />
      <!-- 操作按钮 -->
      <SettingActions />
    </SettingDrawer>
  </div>
</template>

<script setup lang="ts">
  import { useSettingsPanel } from './composables/useSettingsPanel'

  import SettingDrawer from './widget/SettingDrawer.vue'
  import SettingHeader from './widget/SettingHeader.vue'
  import ThemeSettings from './widget/ThemeSettings.vue'
  import MenuLayoutSettings from './widget/MenuLayoutSettings.vue'
  import MenuStyleSettings from './widget/MenuStyleSettings.vue'
  import ColorSettings from './widget/ColorSettings.vue'
  import BoxStyleSettings from './widget/BoxStyleSettings.vue'
  import ContainerSettings from './widget/ContainerSettings.vue'
  import BasicSettings from './widget/BasicSettings.vue'
  import SettingActions from './widget/SettingActions.vue'

  defineOptions({ name: 'ArtSettingsPanel' })

  interface Props {
    /** 是否打开 */
    open?: boolean
  }

  const props = defineProps<Props>()

  // 使用设置面板逻辑
  const settingsPanel = useSettingsPanel()
  const { showDrawer } = settingsPanel

  // 获取各种处理器
  const { handleOpen, handleClose, closeDrawer } = settingsPanel.useDrawerControl()
  const { initializeSettings, cleanupSettings } = settingsPanel.useSettingsInitializer()

  // 监听 props 变化
  settingsPanel.usePropsWatcher(props)

  onMounted(() => {
    initializeSettings()
  })

  onUnmounted(() => {
    cleanupSettings()
  })
</script>

<style lang="scss">
  @use './style';
</style>
