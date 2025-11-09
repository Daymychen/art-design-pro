<template>
  <div>
    <SectionTitle :title="$t('setting.container.title')" class="mt-12.5" />
    <div class="flex">
      <div
        v-for="option in containerWidthOptions"
        :key="option.value"
        class="flex-cc flex-1 h-16 mt-5 mr-3.5 mb-3.5 cursor-pointer !border-2 rounded-lg !text-g-800 last:mr-0"
        :class="{
          'border-theme [&_i]:!text-theme': containerWidth === option.value,
          'border-full-d': containerWidth !== option.value
        }"
        @click="containerHandlers.setWidth(option.value)"
      >
        <ArtSvgIcon :icon="option.icon" class="mr-2 text-lg" />
        <span class="text-sm">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import SectionTitle from './SectionTitle.vue'
  import { useSettingStore } from '@/store/modules/setting'
  import { useSettingsConfig } from '../composables/useSettingsConfig'
  import { useSettingsHandlers } from '../composables/useSettingsHandlers'
  import { storeToRefs } from 'pinia'

  const settingStore = useSettingStore()
  const { containerWidth } = storeToRefs(settingStore)
  const { containerWidthOptions } = useSettingsConfig()
  const { containerHandlers } = useSettingsHandlers()
</script>
