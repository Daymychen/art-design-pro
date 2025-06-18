<!-- 节日文本滚动 -->
<template>
  <div
    class="festival-text-scroll"
    :style="{
      height: showFestivalText ? '48px' : '0'
    }"
  >
    <ArtTextScroll
      v-if="showFestivalText && currentFestivalData?.scrollText !== ''"
      :text="currentFestivalData?.scrollText || ''"
      style="margin-bottom: 12px"
      show-close
      @close="handleClose"
      typewriter
      :speed="100"
      :typewriter-speed="150"
    />
  </div>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  import { useCeremony } from '@/composables/useCeremony'

  defineOptions({ name: 'ArtFestivalTextScroll' })

  const settingStore = useSettingStore()
  const { showFestivalText } = storeToRefs(settingStore)
  const { currentFestivalData } = useCeremony()

  const handleClose = () => {
    settingStore.setShowFestivalText(false)
  }
</script>

<style lang="scss" scoped>
  .festival-text-scroll {
    overflow: hidden;
    transition: height 0.5s ease-in-out;
  }
</style>
