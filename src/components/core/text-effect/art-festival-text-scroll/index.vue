<!-- 节日文本滚动 -->
<template>
  <div
    class="overflow-hidden transition-[height] duration-600 ease-in-out"
    :style="{
      height: showFestivalText ? '48px' : '0'
    }"
  >
    <ArtTextScroll
      v-if="showFestivalText && currentFestivalData?.scrollText !== ''"
      :text="currentFestivalData?.scrollText || ''"
      style="margin-bottom: 12px"
      showClose
      @close="handleClose"
    />
  </div>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  import { useCeremony } from '@/hooks/core/useCeremony'

  defineOptions({ name: 'ArtFestivalTextScroll' })

  const settingStore = useSettingStore()
  const { showFestivalText } = storeToRefs(settingStore)
  const { currentFestivalData } = useCeremony()

  const handleClose = () => {
    settingStore.setShowFestivalText(false)
  }
</script>
