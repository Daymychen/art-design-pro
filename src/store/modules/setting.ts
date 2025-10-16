import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import { MenuThemeType } from '@/types/store'
import AppConfig from '@/config'
import { SystemThemeEnum, MenuThemeEnum, MenuTypeEnum, ContainerWidthEnum } from '@/enums/appEnum'
import { setElementThemeColor } from '@/utils/ui'
import { useCeremony } from '@/composables/useCeremony'
import { StorageConfig } from '@/utils'

const { defaultMenuWidth, defaultCustomRadius, defaultTabStyle } = AppConfig.systemSetting

/**
 * 系统设置状态管理
 * 管理应用的菜单、主题、界面显示等各项设置
 */
export const useSettingStore = defineStore(
  'settingStore',
  () => {
    // 菜单相关设置
    /** 菜单类型 */
    const menuType = ref(MenuTypeEnum.LEFT)
    /** 菜单展开宽度 */
    const menuOpenWidth = ref(defaultMenuWidth)
    /** 菜单是否展开 */
    const menuOpen = ref(true)
    /** 双菜单是否显示文本 */
    const dualMenuShowText = ref(false)

    // 主题相关设置
    /** 系统主题类型 */
    const systemThemeType = ref(SystemThemeEnum.AUTO)
    /** 系统主题模式 */
    const systemThemeMode = ref(SystemThemeEnum.AUTO)
    /** 菜单主题类型 */
    const menuThemeType = ref(MenuThemeEnum.DESIGN)
    /** 系统主题颜色 */
    const systemThemeColor = ref(AppConfig.systemMainColor[0])

    // 界面显示设置
    /** 是否显示菜单按钮 */
    const showMenuButton = ref(true)
    /** 是否显示快速入口 */
    const showFastEnter = ref(true)
    /** 是否显示刷新按钮 */
    const showRefreshButton = ref(true)
    /** 是否显示面包屑 */
    const showCrumbs = ref(true)
    /** 是否显示工作台标签 */
    const showWorkTab = ref(true)
    /** 是否显示语言切换 */
    const showLanguage = ref(true)
    /** 是否显示进度条 */
    const showNprogress = ref(false)
    /** 是否显示设置引导 */
    const showSettingGuide = ref(true)
    /** 是否显示节日文本 */
    const showFestivalText = ref(false)
    /** 是否显示水印 */
    const watermarkVisible = ref(false)

    // 功能设置
    /** 是否自动关闭 */
    const autoClose = ref(false)
    /** 是否唯一展开 */
    const uniqueOpened = ref(true)
    /** 是否色弱模式 */
    const colorWeak = ref(false)
    /** 是否刷新 */
    const refresh = ref(false)
    /** 是否加载节日烟花 */
    const holidayFireworksLoaded = ref(false)

    // 样式设置
    /** 边框模式 */
    const boxBorderMode = ref(true)
    /** 页面过渡效果 */
    const pageTransition = ref('slide-left')
    /** 标签页样式 */
    const tabStyle = ref(defaultTabStyle)
    /** 自定义圆角 */
    const customRadius = ref(defaultCustomRadius)
    /** 容器宽度 */
    const containerWidth = ref(ContainerWidthEnum.FULL)

    // 节日相关
    /** 节日日期 */
    const festivalDate = ref('')

    /**
     * 获取菜单主题
     * 根据当前主题类型和暗色模式返回对应的主题配置
     */
    const getMenuTheme = computed((): MenuThemeType => {
      const list = AppConfig.themeList.filter((item) => item.theme === menuThemeType.value)
      if (isDark.value) {
        return AppConfig.darkMenuStyles[0]
      } else {
        return list[0]
      }
    })

    /**
     * 判断是否为暗色模式
     */
    const isDark = computed((): boolean => {
      return systemThemeType.value === SystemThemeEnum.DARK
    })

    /**
     * 获取菜单展开宽度
     */
    const getMenuOpenWidth = computed((): string => {
      return menuOpenWidth.value + 'px' || defaultMenuWidth + 'px'
    })

    /**
     * 获取自定义圆角
     */
    const getCustomRadius = computed((): string => {
      return customRadius.value + 'rem' || defaultCustomRadius + 'rem'
    })

    /**
     * 是否显示烟花
     * 根据当前日期和节日日期判断是否显示烟花效果
     */
    const isShowFireworks = computed((): boolean => {
      return festivalDate.value === useCeremony().currentFestivalData.value?.date ? false : true
    })

    /**
     * 切换菜单布局
     * @param type 菜单类型
     */
    const switchMenuLayouts = (type: MenuTypeEnum) => {
      menuType.value = type
    }

    /**
     * 设置菜单展开宽度
     * @param width 宽度值
     */
    const setMenuOpenWidth = (width: number) => {
      menuOpenWidth.value = width
    }

    /**
     * 设置全局主题
     * @param theme 主题类型
     * @param themeMode 主题模式
     */
    const setGlopTheme = (theme: SystemThemeEnum, themeMode: SystemThemeEnum) => {
      systemThemeType.value = theme
      systemThemeMode.value = themeMode
      localStorage.setItem(StorageConfig.THEME_KEY, theme)
    }

    /**
     * 切换菜单样式
     * @param theme 菜单主题
     */
    const switchMenuStyles = (theme: MenuThemeEnum) => {
      menuThemeType.value = theme
    }

    /**
     * 设置Element Plus主题颜色
     * @param theme 主题颜色
     */
    const setElementTheme = (theme: string) => {
      systemThemeColor.value = theme
      setElementThemeColor(theme)
    }

    /**
     * 切换边框模式
     */
    const setBorderMode = () => {
      boxBorderMode.value = !boxBorderMode.value
    }

    /**
     * 设置容器宽度
     * @param width 容器宽度枚举值
     */
    const setContainerWidth = (width: ContainerWidthEnum) => {
      containerWidth.value = width
    }

    /**
     * 切换唯一展开模式
     */
    const setUniqueOpened = () => {
      uniqueOpened.value = !uniqueOpened.value
    }

    /**
     * 切换菜单按钮显示
     */
    const setButton = () => {
      showMenuButton.value = !showMenuButton.value
    }

    /**
     * 切换快速入口显示
     */
    const setFastEnter = () => {
      showFastEnter.value = !showFastEnter.value
    }

    /**
     * 切换自动关闭
     */
    const setAutoClose = () => {
      autoClose.value = !autoClose.value
    }

    /**
     * 切换刷新按钮显示
     */
    const setShowRefreshButton = () => {
      showRefreshButton.value = !showRefreshButton.value
    }

    /**
     * 切换面包屑显示
     */
    const setCrumbs = () => {
      showCrumbs.value = !showCrumbs.value
    }

    /**
     * 设置工作台标签显示
     * @param show 是否显示
     */
    const setWorkTab = (show: boolean) => {
      showWorkTab.value = show
    }

    /**
     * 切换语言切换显示
     */
    const setLanguage = () => {
      showLanguage.value = !showLanguage.value
    }

    /**
     * 切换进度条显示
     */
    const setNprogress = () => {
      showNprogress.value = !showNprogress.value
    }

    /**
     * 切换色弱模式
     */
    const setColorWeak = () => {
      colorWeak.value = !colorWeak.value
    }

    /**
     * 隐藏设置引导
     */
    const hideSettingGuide = () => {
      showSettingGuide.value = false
    }

    /**
     * 显示设置引导
     */
    const openSettingGuide = () => {
      showSettingGuide.value = true
    }

    /**
     * 设置页面过渡效果
     * @param transition 过渡效果名称
     */
    const setPageTransition = (transition: string) => {
      pageTransition.value = transition
    }

    /**
     * 设置标签页样式
     * @param style 样式名称
     */
    const setTabStyle = (style: string) => {
      tabStyle.value = style
    }

    /**
     * 设置菜单展开状态
     * @param open 是否展开
     */
    const setMenuOpen = (open: boolean) => {
      menuOpen.value = open
    }

    /**
     * 刷新页面
     */
    const reload = () => {
      refresh.value = !refresh.value
    }

    /**
     * 设置水印显示
     * @param visible 是否显示
     */
    const setWatermarkVisible = (visible: boolean) => {
      watermarkVisible.value = visible
    }

    /**
     * 设置自定义圆角
     * @param radius 圆角值
     */
    const setCustomRadius = (radius: string) => {
      customRadius.value = radius
      document.documentElement.style.setProperty('--custom-radius', `${radius}rem`)
    }

    /**
     * 设置节日烟花加载状态
     * @param isLoad 是否已加载
     */
    const setholidayFireworksLoaded = (isLoad: boolean) => {
      holidayFireworksLoaded.value = isLoad
    }

    /**
     * 设置节日文本显示
     * @param show 是否显示
     */
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
      showFastEnter,
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
      setFastEnter,
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
