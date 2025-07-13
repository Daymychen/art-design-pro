<template>
  <div class="basic-settings">
    <SectionTitle :title="$t('setting.basics.title')" :style="{ marginTop: '40px' }" />
    <div class="basic-box">
      <SettingItem
        v-for="config in basicSettingsConfig"
        :key="config.key"
        :config="config"
        :model-value="getSettingValue(config.key)"
        @change="handleSettingChange(config.handler, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import SectionTitle from './SectionTitle.vue'
  import SettingItem from './SettingItem.vue'
  import { useSettingStore } from '@/store/modules/setting'
  import { useSettingsConfig } from '../composables/useSettingsConfig'
  import { useSettingsHandlers } from '../composables/useSettingsHandlers'
  import { storeToRefs } from 'pinia'

  const settingStore = useSettingStore()
  const { basicSettingsConfig } = useSettingsConfig()
  const { basicHandlers } = useSettingsHandlers()

  // 获取store的响应式状态
  const {
    uniqueOpened,
    showMenuButton,
    showFastEnter,
    showRefreshButton,
    showCrumbs,
    showWorkTab,
    showLanguage,
    showNprogress,
    colorWeak,
    watermarkVisible,
    menuOpenWidth,
    tabStyle,
    pageTransition,
    customRadius
  } = storeToRefs(settingStore)

  // 创建设置值映射
  const settingValueMap = {
    uniqueOpened,
    showMenuButton,
    showFastEnter,
    showRefreshButton,
    showCrumbs,
    showWorkTab,
    showLanguage,
    showNprogress,
    colorWeak,
    watermarkVisible,
    menuOpenWidth,
    tabStyle,
    pageTransition,
    customRadius
  }

  // 获取设置值的方法
  const getSettingValue = (key: string) => {
    const settingRef = settingValueMap[key as keyof typeof settingValueMap]
    return settingRef?.value ?? null
  }

  // 统一的设置变更处理
  const handleSettingChange = (handlerName: string, value: any) => {
    const handler = (basicHandlers as any)[handlerName]
    if (typeof handler === 'function') {
      handler(value)
    } else {
      console.warn(`Handler "${handlerName}" not found in basicHandlers`)
    }
  }
</script>

<style lang="scss" scoped>
  .basic-settings {
    padding-bottom: 30px;

    .basic-box {
      position: relative;
      z-index: 10;
      background: transparent !important;
    }
  }
</style>
