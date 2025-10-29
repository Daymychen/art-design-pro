<template>
  <div class="box-style-settings">
    <SectionTitle :title="$t('setting.box.title')" :style="{ marginTop: '40px' }" />
    <div class="box-style">
      <div
        v-for="option in boxStyleOptions"
        :key="option.value"
        class="button"
        :class="{ 'is-active': isActive(option.type) }"
        @click="boxStyleHandlers.setBoxMode(option.type)"
      >
        {{ option.label }}
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
  const { boxBorderMode } = storeToRefs(settingStore)
  const { boxStyleOptions } = useSettingsConfig()
  const { boxStyleHandlers } = useSettingsHandlers()

  // 判断当前选项是否激活
  const isActive = (type: 'border-mode' | 'shadow-mode') => {
    return type === 'border-mode' ? boxBorderMode.value : !boxBorderMode.value
  }
</script>

<style lang="scss" scoped>
  .box-style-settings {
    .box-style {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px;
      margin-top: 20px;
      background-color: var(--art-gray-200);
      border-radius: 7px;

      .button {
        width: calc(50% - 3px);
        height: 34px;
        font-size: 14px;
        line-height: 34px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        border-radius: 6px;
        transition: all 0.2s !important;

        &.is-active {
          color: var(--art-gray-800);
          background-color: var(--default-box-color);
        }

        &:hover:not(.is-active) {
          color: var(--art-gray-800);
          background-color: rgba($color: #000, $alpha: 4%);
        }
      }
    }
  }

  .dark {
    .box-style-settings {
      .box-style {
        .button {
          &.is-active {
            color: #fff !important;
            background-color: var(--art-gray-400);
          }

          &:hover:not(.is-active) {
            background-color: rgba($color: #000, $alpha: 20%);
          }
        }
      }
    }
  }
</style>
