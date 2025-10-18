<!-- 授权页右上角组件 -->
<template>
  <div class="top-right-wrap">
    <ElDropdown
      v-if="shouldShowLanguage"
      @command="changeLanguage"
      popper-class="langDropDownStyle"
    >
      <div class="btn language-btn">
        <i class="iconfont-sys icon-language">&#xe611;</i>
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
    <div v-if="shouldShowThemeToggle" class="btn theme-btn" @click="themeAnimation">
      <i class="iconfont-sys">
        {{ isDark ? '&#xe6b5;' : '&#xe725;' }}
      </i>
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

  defineOptions({ name: 'AuthTopBar' })

  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const { isDark } = storeToRefs(settingStore)
  const { shouldShowThemeToggle, shouldShowLanguage } = useHeaderBar()
  const { locale } = useI18n()

  const changeLanguage = (lang: LanguageEnum) => {
    if (locale.value === lang) return
    locale.value = lang
    userStore.setLanguage(lang)
  }
</script>

<style lang="scss" scoped>
  .top-right-wrap {
    position: absolute;
    top: 30px;
    right: 30px;
    z-index: 10;
    display: flex;
    gap: 10px;
    align-items: center;

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      cursor: pointer;
      transition: all 0.3s;

      .iconfont-sys {
        font-size: 18px;
        color: var(--art-gray-800);
        transition: color 0.3s;
      }

      &:hover {
        .iconfont-sys {
          color: var(--main-color);
        }
      }
    }
  }
</style>
