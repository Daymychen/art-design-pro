<template>
  <div class="container-settings">
    <SectionTitle :title="$t('setting.container.title')" :style="{ marginTop: '50px' }" />
    <div class="container-width">
      <div
        v-for="option in containerWidthOptions"
        :key="option.value"
        class="item"
        :class="{ 'is-active': containerWidth === option.value }"
        @click="containerHandlers.setWidth(option.value)"
      >
        <ArtSvgIcon :icon="option.icon" class="mr-1" />
        <span>{{ option.label }}</span>
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

<style lang="scss" scoped>
  .container-settings {
    .container-width {
      display: flex;

      .item {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        height: 60px;
        margin-top: 20px;
        margin-right: 15px;
        margin-bottom: 15px;
        cursor: pointer;
        border: 2px solid var(--default-border);
        border-radius: 10px;

        &:last-of-type {
          margin-right: 0;
        }

        &.is-active {
          border-color: var(--main-color);

          i {
            color: var(--main-color) !important;
          }
        }

        i {
          margin-right: 10px;
          font-size: 22px;
        }

        span {
          font-size: 14px;
          background: transparent !important;
        }
      }
    }
  }
</style>
