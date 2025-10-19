<!-- 授权页右上角组件 -->
<template>
  <div class="top-right-wrap">
    <div class="color-picker-expandable">
      <div class="color-dots-container">
        <div
          v-for="(color, index) in mainColors"
          :key="color"
          class="color-dot"
          :class="{ active: color === systemThemeColor }"
          :style="{ background: color, '--index': index }"
          @click="changeThemeColor(color)"
        >
          <i v-if="color === systemThemeColor" class="iconfont-sys check-icon">&#xe616;</i>
        </div>
      </div>
      <div class="color-trigger-btn btn">
        <i class="iconfont-sys">&#xe82c;</i>
      </div>
    </div>
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

    .color-picker-expandable {
      position: relative;
      display: flex;
      align-items: center;

      .color-trigger-btn {
        position: relative;
        z-index: 2;

        i {
          font-size: 19px !important;
        }
      }

      .color-dots-container {
        position: absolute;
        right: 0;
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 8px 36px 8px 10px;
        pointer-events: none;
        backdrop-filter: blur(10px);
        border-radius: 20px;
        box-shadow: 0 2px 12px var(--art-gray-300);
        opacity: 0;
        transition:
          opacity 0.3s ease,
          transform 0.3s ease;
        transform: translateX(10px);

        .color-dot {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgb(0 0 0 / 15%);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(20px) scale(0.8);

          .check-icon {
            font-size: 12px;
            color: #fff;
            filter: drop-shadow(0 1px 2px rgb(0 0 0 / 30%));
          }

          &:hover {
            box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
            transform: translateX(0) scale(1.1);
          }
        }
      }

      &:hover {
        .color-dots-container {
          pointer-events: auto;
          opacity: 1;
          transform: translateX(0);

          .color-dot {
            opacity: 1;
            transition-delay: calc(var(--index) * 0.05s);
            transform: translateX(0) scale(1);
          }
        }

        .color-trigger-btn .iconfont-sys {
          color: var(--main-color);
        }
      }
    }
  }

  .dark {
    .top-right-wrap {
      .color-picker-expandable {
        .color-dots-container {
          background-color: var(--art-gray-200);
          box-shadow: none;
        }
      }
    }
  }

  @media screen and (width <= 680px) {
    .top-right-wrap {
      .color-picker-expandable {
        display: none;
      }
    }
  }
</style>
