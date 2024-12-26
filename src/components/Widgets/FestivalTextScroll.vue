<!-- 节日文本滚动 -->
<template>
  <div
    class="festival-text-scroll"
    :style="{
      height: showFestivalText ? '48px' : '0'
    }"
  >
    <TextScroll
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

  const settingStore = useSettingStore()
  // 是否显示节日文本
  const showFestivalText = computed(() => settingStore.showFestivalText)

  const { currentFestivalData } = useCeremony()

  // 处理关闭节日文本
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
