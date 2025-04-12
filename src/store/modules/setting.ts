import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MenuThemeType } from '@/types/store'
import AppConfig from '@/config'
import { SystemThemeEnum, MenuThemeEnum, MenuTypeEnum, ContainerWidthEnum } from '@/enums/appEnum'
import { colourBlend, handleElementThemeColor } from '@/utils/colors'
import { getSysStorage } from '@/utils/storage'
import { useCeremony } from '@/composables/useCeremony'

const { defaultMenuWidth, defaultCustomRadius, defaultTabStyle } = AppConfig.systemSetting

// 系统设置
export const useSettingStore = defineStore('settingStore', () => {
  const menuType = ref(MenuTypeEnum.LEFT)
  const menuOpenWidth = ref(defaultMenuWidth)
  const systemThemeType = ref(SystemThemeEnum.LIGHT)
  const systemThemeMode = ref(SystemThemeEnum.LIGHT)
  const menuThemeType = ref(MenuThemeEnum.DESIGN)
  const systemThemeColor = ref(AppConfig.elementPlusTheme.primary)
  const boxBorderMode = ref(true)
  const uniqueOpened = ref(true)
  const showMenuButton = ref(true)
  const showRefreshButton = ref(true)
  const showCrumbs = ref(true)
  const autoClose = ref(false)
  const showWorkTab = ref(true)
  const showLanguage = ref(true)
  const showNprogress = ref(true)
  const colorWeak = ref(false)
  const showSettingGuide = ref(true)
  const pageTransition = ref('slide-right')
  const tabStyle = ref(defaultTabStyle)
  const menuOpen = ref(true)
  const refresh = ref(false)
  const watermarkVisible = ref(false)
  const customRadius = ref(defaultCustomRadius)
  const holidayFireworksLoaded = ref(false)
  const showFestivalText = ref(false)
  const festivalDate = ref('')
  const dualMenuShowText = ref(false)
  const containerWidth = ref(ContainerWidthEnum.FULL)

  const getMenuTheme = computed((): MenuThemeType => {
    const list = AppConfig.themeList.filter((item) => item.theme === menuThemeType.value)
    if (isDark.value) {
      return AppConfig.darkMenuStyles[0]
    } else {
      return list[0]
    }
  })

  const isDark = computed((): boolean => {
    return systemThemeType.value === SystemThemeEnum.DARK
  })

  const getMenuOpenWidth = computed((): string => {
    return menuOpenWidth.value + 'px' || defaultMenuWidth + 'px'
  })

  const getCustomRadius = computed((): string => {
    return customRadius.value + 'rem' || defaultCustomRadius + 'rem'
  })

  const isShowFireworks = computed((): boolean => {
    return festivalDate.value === useCeremony().currentFestivalData.value?.date ? false : true
  })

  const initState = () => {
    let sys = getSysStorage()

    if (sys) {
      sys = JSON.parse(sys)
      const { setting } = sys.user
      menuType.value = setting.menuType || MenuTypeEnum.LEFT
      menuOpenWidth.value = Number(setting.menuOpenWidth) || defaultMenuWidth
      systemThemeType.value = setting.systemThemeType || SystemThemeEnum.LIGHT
      systemThemeMode.value = setting.systemThemeMode || SystemThemeEnum.LIGHT
      menuThemeType.value = setting.menuThemeType || MenuThemeEnum.DESIGN
      containerWidth.value = setting.containerWidth || ContainerWidthEnum.FULL
      systemThemeColor.value = setting.systemThemeColor || AppConfig.elementPlusTheme.primary
      boxBorderMode.value = setting.boxBorderMode
      uniqueOpened.value = setting.uniqueOpened
      showMenuButton.value = setting.showMenuButton
      showRefreshButton.value = setting.showRefreshButton
      showCrumbs.value = setting.showCrumbs
      autoClose.value = setting.autoClose
      showWorkTab.value = setting.showWorkTab
      showLanguage.value = setting.showLanguage
      showNprogress.value = setting.showNprogress
      colorWeak.value = setting.colorWeak
      showSettingGuide.value = setting.showSettingGuide
      pageTransition.value = setting.pageTransition
      tabStyle.value = setting.tabStyle || defaultTabStyle
      menuOpen.value = setting.menuOpen
      watermarkVisible.value = setting.watermarkVisible
      customRadius.value = setting.customRadius || defaultCustomRadius
      holidayFireworksLoaded.value = setting.holidayFireworksLoaded
      showFestivalText.value = setting.showFestivalText
      festivalDate.value = setting.festivalDate
      dualMenuShowText.value = setting.dualMenuShowText
      setCustomRadius(customRadius.value)
      setElementThemeColor(setting.systemThemeColor)
    } else {
      setCustomRadius(customRadius.value)
      setElementThemeColor(AppConfig.elementPlusTheme.primary)
    }
  }

  const switchMenuLayouts = (type: MenuTypeEnum) => {
    menuType.value = type
  }

  const setMenuOpenWidth = (width: number) => {
    menuOpenWidth.value = width
  }

  const setGlopTheme = (theme: SystemThemeEnum, themeMode: SystemThemeEnum) => {
    systemThemeType.value = theme
    systemThemeMode.value = themeMode
  }

  const switchMenuStyles = (theme: MenuThemeEnum) => {
    menuThemeType.value = theme
  }

  const setElementTheme = (theme: string) => {
    systemThemeColor.value = theme
    setElementThemeColor(theme)
  }

  const setBorderMode = () => {
    boxBorderMode.value = !boxBorderMode.value
  }

  const setContainerWidth = (width: ContainerWidthEnum) => {
    containerWidth.value = width
  }

  const setUniqueOpened = () => {
    uniqueOpened.value = !uniqueOpened.value
  }

  const setButton = () => {
    showMenuButton.value = !showMenuButton.value
  }

  const setAutoClose = () => {
    autoClose.value = !autoClose.value
  }

  const setShowRefreshButton = () => {
    showRefreshButton.value = !showRefreshButton.value
  }

  const setCrumbs = () => {
    showCrumbs.value = !showCrumbs.value
  }

  const setWorkTab = (show: boolean) => {
    showWorkTab.value = show
  }

  const setLanguage = () => {
    showLanguage.value = !showLanguage.value
  }

  const setNprogress = () => {
    showNprogress.value = !showNprogress.value
  }

  const setColorWeak = () => {
    colorWeak.value = !colorWeak.value
  }

  const hideSettingGuide = () => {
    showSettingGuide.value = false
  }

  const openSettingGuide = () => {
    showSettingGuide.value = true
  }

  const setPageTransition = (transition: string) => {
    pageTransition.value = transition
  }

  const setTabStyle = (style: string) => {
    tabStyle.value = style
  }

  const setMenuOpen = (open: boolean) => {
    menuOpen.value = open
  }

  const reload = () => {
    refresh.value = !refresh.value
  }

  const setWatermarkVisible = (visible: boolean) => {
    watermarkVisible.value = visible
  }

  const setCustomRadius = (radius: string) => {
    customRadius.value = radius
    document.documentElement.style.setProperty('--custom-radius', `${radius}rem`)
  }

  const setholidayFireworksLoaded = (isLoad: boolean) => {
    holidayFireworksLoaded.value = isLoad
  }

  const setShowFestivalText = (show: boolean) => {
    showFestivalText.value = show
  }

  const setFestivalDate = (date: string) => {
    festivalDate.value = date
  }

  const setDualMenuShowText = (show: boolean) => {
    dualMenuShowText.value = show
  }

  return {
    menuType,
    menuOpenWidth,
    systemThemeType,
    systemThemeMode,
    menuThemeType,
    systemThemeColor,
    boxBorderMode,
    uniqueOpened,
    showMenuButton,
    showRefreshButton,
    showCrumbs,
    autoClose,
    showWorkTab,
    showLanguage,
    showNprogress,
    colorWeak,
    showSettingGuide,
    pageTransition,
    tabStyle,
    menuOpen,
    refresh,
    watermarkVisible,
    customRadius,
    holidayFireworksLoaded,
    showFestivalText,
    festivalDate,
    dualMenuShowText,
    containerWidth,
    getMenuTheme,
    isDark,
    getMenuOpenWidth,
    getCustomRadius,
    isShowFireworks,
    initState,
    switchMenuLayouts,
    setMenuOpenWidth,
    setGlopTheme,
    switchMenuStyles,
    setElementTheme,
    setBorderMode,
    setContainerWidth,
    setUniqueOpened,
    setButton,
    setAutoClose,
    setShowRefreshButton,
    setCrumbs,
    setWorkTab,
    setLanguage,
    setNprogress,
    setColorWeak,
    hideSettingGuide,
    openSettingGuide,
    setPageTransition,
    setTabStyle,
    setMenuOpen,
    reload,
    setWatermarkVisible,
    setCustomRadius,
    setholidayFireworksLoaded,
    setShowFestivalText,
    setFestivalDate,
    setDualMenuShowText
  }
})

// 设置主题颜色
function setElementThemeColor(color: string) {
  const mixColor = '#ffffff'
  const elStyle = document.documentElement.style

  elStyle.setProperty('--el-color-primary', color)
  handleElementThemeColor(color, useSettingStore().isDark)

  // 生成更淡一点的颜色
  for (let i = 1; i < 16; i++) {
    const itemColor = colourBlend(color, mixColor, i / 16)
    elStyle.setProperty(`--el-color-primary-custom-${i}`, itemColor)
  }
}
