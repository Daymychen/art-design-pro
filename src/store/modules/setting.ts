import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MenuThemeType } from '@/types/store'
import AppConfig from '@/config'
import { SystemThemeEnum, MenuThemeEnum, MenuTypeEnum, ContainerWidthEnum } from '@/enums/appEnum'
import { setElementThemeColor } from '@/utils/ui'
import { useCeremony } from '@/composables/useCeremony'

const { defaultMenuWidth, defaultCustomRadius, defaultTabStyle } = AppConfig.systemSetting

// 系统设置
export const useSettingStore = defineStore(
  'settingStore',
  () => {
    const menuType = ref(MenuTypeEnum.LEFT)
    const menuOpenWidth = ref(defaultMenuWidth)
    const systemThemeType = ref(SystemThemeEnum.AUTO)
    const systemThemeMode = ref(SystemThemeEnum.AUTO)
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
    const pageTransition = ref('slide-left')
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

    // 初始化主题样式
    const initThemeStyles = () => {
      setElementThemeColor(systemThemeColor.value)
      document.documentElement.style.setProperty('--custom-radius', `${customRadius.value}rem`)
    }

    nextTick(() => {
      initThemeStyles()
    })

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
  },
  {
    persist: {
      key: 'setting',
      storage: localStorage
    }
  }
)
