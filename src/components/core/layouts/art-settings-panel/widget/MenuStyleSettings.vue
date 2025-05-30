<template>
  <SectionTitle :title="$t('setting.menu.title')" />
  <div class="setting-box-wrap">
    <div
      class="setting-item"
      v-for="item in menuThemeList"
      :key="item.theme"
      @click="switchMenuStyles(item.theme)"
    >
      <div
        class="box"
        :class="{ 'is-active': item.theme === menuThemeType }"
        :style="{
          cursor: disabled ? 'no-drop' : 'pointer'
        }"
      >
        <img :src="item.img" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import SectionTitle from './SectionTitle.vue'
  import { MenuTypeEnum, type MenuThemeEnum } from '@/enums/appEnum'
  import { useSettingStore } from '@/store/modules/setting'

  const menuThemeList = AppConfig.themeList
  const settingStore = useSettingStore()
  const { menuThemeType, menuType, isDark } = storeToRefs(settingStore)
  const isTopMenu = computed(() => menuType.value === MenuTypeEnum.TOP)
  const isDualMenu = computed(() => menuType.value === MenuTypeEnum.DUAL_MENU)

  const disabled = computed(() => isTopMenu.value || isDualMenu.value || isDark.value)

  // 菜单样式切换
  const switchMenuStyles = (theme: MenuThemeEnum) => {
    if (isDualMenu.value || isTopMenu.value || isDark.value) {
      return
    }
    settingStore.switchMenuStyles(theme)
  }
</script>
