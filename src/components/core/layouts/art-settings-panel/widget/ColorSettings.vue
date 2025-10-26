<template>
  <div class="color-settings">
    <SectionTitle :title="$t('setting.color.title')" style="margin-top: 40px" />
    <div class="main-color-wrap">
      <div class="offset">
        <div
          v-for="color in configOptions.mainColors"
          :key="color"
          :style="{ background: `${color} !important` }"
          @click="colorHandlers.selectColor(color)"
        >
          <ArtSvgIcon
            icon="ri:check-fill"
            class="text-base text-white"
            v-show="color === systemThemeColor"
          />
        </div>
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
  const { systemThemeColor } = storeToRefs(settingStore)
  const { configOptions } = useSettingsConfig()
  const { colorHandlers } = useSettingsHandlers()
</script>

<style lang="scss" scoped>
  .color-settings {
    .main-color-wrap {
      .offset {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + 16px);

        $size: 23px;

        > div {
          display: flex;
          align-items: center;
          justify-content: center;
          width: $size;
          height: $size;
          margin: 0 16px 10px 0;
          cursor: pointer;
          border-radius: $size;

          &:last-of-type {
            margin-right: 0;
          }

          i {
            font-size: 14px;
            color: #fff !important;
          }
        }
      }
    }
  }
</style>
