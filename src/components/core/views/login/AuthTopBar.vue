<!-- 授权页右上角组件 -->
<template>
  <div
    class="absolute right-5 top-5 z-10 flex items-center gap-2.5 max-[680px]:[&_.color-picker-expandable]:hidden"
  >
    <div class="color-picker-expandable relative flex items-center">
      <div
        class="color-dots-container absolute right-0 flex items-center gap-2 rounded-[20px] px-2.5 py-2 pr-9 pl-2.5 opacity-0 shadow-[0_2px_12px_var(--art-gray-300)] backdrop-blur-[10px] [pointer-events:none] [transform:translateX(10px)]"
      >
        <div
          v-for="(color, index) in mainColors"
          :key="color"
          class="color-dot relative flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full opacity-0 shadow-[0_2px_4px_rgba(0,0,0,0.15)] [transform:translateX(20px)_scale(0.8)] hover:scale-110 hover:translate-x-0 hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
          :class="{ active: color === systemThemeColor }"
          :style="{ background: color, '--index': index }"
          @click="changeThemeColor(color)"
        >
          <i
            v-if="color === systemThemeColor"
            class="iconfont-sys check-icon text-xs text-white [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.3))]"
            >&#xe616;</i
          >
        </div>
      </div>
      <div
        class="color-trigger-btn btn relative z-[2] flex h-8 w-8 cursor-pointer items-center justify-center transition-all duration-300"
      >
        <i
          class="iconfont-sys !text-[19px] text-[var(--art-gray-800)] transition-colors duration-300"
          >&#xe82c;</i
        >
      </div>
    </div>
    <ElDropdown
      v-if="shouldShowLanguage"
      @command="changeLanguage"
      popper-class="langDropDownStyle"
    >
      <div
        class="btn language-btn flex h-8 w-8 cursor-pointer items-center justify-center transition-all duration-300 hover:[&_.iconfont-sys]:text-[var(--main-color)]"
      >
        <i
          class="iconfont-sys icon-language text-lg text-[var(--art-gray-800)] transition-colors duration-300"
          >&#xe611;</i
        >
      </div>
      <template #dropdown>
        <ElDropdownMenu>
          <div v-for="lang in languageOptions" :key="lang.value" class="lang-btn-item">
            <ElDropdownItem :command="lang.value" :class="{ 'is-selected': locale === lang.value }">
              <span class="menu-txt">{{ lang.label }}</span>
              <i v-if="locale === lang.value" class="iconfont-sys icon-check">&#xe621;</i>
            </ElDropdownItem>
          </div>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
    <div
      v-if="shouldShowThemeToggle"
      class="btn theme-btn flex h-8 w-8 cursor-pointer items-center justify-center transition-all duration-300 hover:[&_.iconfont-sys]:text-[var(--main-color)]"
      @click="themeAnimation"
    >
      <ArtSvgIcon
        :icon="isDark ? 'ri:sun-fill' : 'ri:moon-line'"
        class="text-lg text-[var(--art-gray-800)] transition-colors duration-300"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '@/store/modules/user'
  import { useHeaderBar } from '@/composables/useHeaderBar'
  import { themeAnimation } from '@/utils/theme/animation'
  import { languageOptions } from '@/locales'
  import { LanguageEnum } from '@/enums/appEnum'
  import AppConfig from '@/config'

  defineOptions({ name: 'AuthTopBar' })

  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const { isDark, systemThemeColor } = storeToRefs(settingStore)
  const { shouldShowThemeToggle, shouldShowLanguage } = useHeaderBar()
  const { locale } = useI18n()

  const mainColors = AppConfig.systemMainColor

  const changeLanguage = (lang: LanguageEnum) => {
    if (locale.value === lang) return
    locale.value = lang
    userStore.setLanguage(lang)
  }

  const changeThemeColor = (color: string) => {
    if (systemThemeColor.value === color) return
    settingStore.setElementTheme(color)
    settingStore.reload()
  }
</script>

<style scoped>
  .color-dots-container {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .color-dot {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: calc(var(--index) * 0.05s);
  }

  .color-picker-expandable:hover .color-dots-container {
    pointer-events: auto;
    opacity: 1;
    transform: translateX(0);
  }

  .color-picker-expandable:hover .color-dot {
    opacity: 1;
    transform: translateX(0) scale(1);
  }

  .color-picker-expandable:hover .color-trigger-btn .iconfont-sys {
    color: var(--main-color);
  }

  .dark .color-dots-container {
    background-color: var(--art-gray-200);
    box-shadow: none;
  }
</style>
