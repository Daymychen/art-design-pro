<template>
  <chrome-tab v-if="settingStore.tabMode == 'chrome' || !settingStore.tabMode"></chrome-tab>
  <button-tab v-if="settingStore.tabMode == 'button'"></button-tab>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  import ChromeTab from './chrome-tab.vue'
  import ButtonTab from './button-tab.vue'

  const settingStore = useSettingStore()
</script>

<style lang="scss" scoped></style>
