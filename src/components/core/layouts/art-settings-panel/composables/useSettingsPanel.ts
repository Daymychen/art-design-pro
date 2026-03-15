import { ref, computed, watch } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { useBreakpoints } from '@vueuse/core'
import AppConfig from '@/config'
import { SystemThemeEnum, MenuTypeEnum } from '@/enums/appEnum'
import { mittBus } from '@/utils/sys'
import { StorageConfig } from '@/utils'
import { useTheme } from '@/hooks/core/useTheme'
import { useCeremony } from '@/hooks/core/useCeremony'
import { useSettingsState } from './useSettingsState'
import { useSettingsHandlers } from './useSettingsHandlers'

/**
 * 设置面板核心逻辑管理
 */
export function useSettingsPanel() {
  const settingStore = useSettingStore()
  const { systemThemeType, systemThemeMode, menuType } = storeToRefs(settingStore)

  // Composables
  const { openFestival, cleanup } = useCeremony()
  const { setSystemTheme, setSystemAutoTheme } = useTheme()
  const { initColorWeak } = useSettingsState()
  const { domOperations } = useSettingsHandlers()

  // 响应式状态
  const showDrawer = ref(false)

  // 使用 VueUse breakpoints 优化性能
  const breakpoints = useBreakpoints({ tablet: 1000 })
  const isMobile = breakpoints.smaller('tablet')

  // 记录窗口宽度变化前的菜单类型
  const getStoredDesktopMenuType = (): MenuTypeEnum | undefined => {
    const storedMenuType = localStorage.getItem(StorageConfig.RESPONSIVE_MENU_TYPE_KEY)
    return Object.values(MenuTypeEnum).includes(storedMenuType as MenuTypeEnum)
      ? (storedMenuType as MenuTypeEnum)
      : undefined
  }

  const setStoredDesktopMenuType = (type: MenuTypeEnum) => {
    localStorage.setItem(StorageConfig.RESPONSIVE_MENU_TYPE_KEY, type)
  }

  const clearStoredDesktopMenuType = () => {
    localStorage.removeItem(StorageConfig.RESPONSIVE_MENU_TYPE_KEY)
  }

  const storedDesktopMenuType = getStoredDesktopMenuType()
  const beforeMenuType = ref<MenuTypeEnum | undefined>(storedDesktopMenuType)
  const hasChangedMenu = ref(Boolean(storedDesktopMenuType))

  // 计算属性
  const systemThemeColor = computed(() => settingStore.systemThemeColor as string)

  // 主题相关处理
  const useThemeHandlers = () => {
    // 初始化系统颜色
    const initSystemColor = () => {
      if (!AppConfig.systemMainColor.includes(systemThemeColor.value)) {
        settingStore.setElementTheme(AppConfig.systemMainColor[0])
        settingStore.reload()
      }
    }

    // 初始化系统主题
    const initSystemTheme = () => {
      if (systemThemeMode.value === SystemThemeEnum.AUTO) {
        setSystemAutoTheme()
      } else {
        setSystemTheme(systemThemeType.value)
      }
    }

    // 监听系统主题变化
    const listenerSystemTheme = () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', initSystemTheme)
      return () => {
        mediaQuery.removeEventListener('change', initSystemTheme)
      }
    }

    return {
      initSystemColor,
      initSystemTheme,
      listenerSystemTheme
    }
  }

  // 响应式布局处理
  const useResponsiveLayout = () => {
    // 使用 watch 监听断点变化，性能更优
    const stopWatch = watch(
      isMobile,
      (mobile: boolean) => {
        if (mobile) {
          // 切换到移动端布局
          if (!hasChangedMenu.value) {
            beforeMenuType.value = menuType.value
            if (menuType.value !== MenuTypeEnum.LEFT) {
              setStoredDesktopMenuType(menuType.value)
              useSettingsState().switchMenuLayouts(MenuTypeEnum.LEFT)
              hasChangedMenu.value = true
            }
          }

          settingStore.setMenuOpen(false)
        } else {
          // 恢复桌面端布局
          if (hasChangedMenu.value && beforeMenuType.value) {
            if (menuType.value === MenuTypeEnum.LEFT) {
              useSettingsState().switchMenuLayouts(beforeMenuType.value)
            }

            clearStoredDesktopMenuType()
            hasChangedMenu.value = false
          }

          settingStore.setMenuOpen(true)
        }
      },
      { immediate: true }
    )

    return { stopWatch }
  }

  // 抽屉控制
  const useDrawerControl = () => {
    // 用于存储 setTimeout 的 ID，以便在需要时清除
    let themeChangeTimer: ReturnType<typeof setTimeout> | null = null

    // 打开抽屉
    const handleOpen = () => {
      // 清除可能存在的旧定时器
      if (themeChangeTimer) {
        clearTimeout(themeChangeTimer)
      }
      // 延迟添加 theme-change class，避免抽屉打开动画受影响
      themeChangeTimer = setTimeout(() => {
        domOperations.setBodyClass('theme-change', true)
        themeChangeTimer = null
      }, 500)
    }

    // 关闭抽屉
    const handleClose = () => {
      // 清除未执行的定时器，防止关闭后才添加 class
      if (themeChangeTimer) {
        clearTimeout(themeChangeTimer)
        themeChangeTimer = null
      }
      // 立即移除 theme-change class
      domOperations.setBodyClass('theme-change', false)
    }

    // 打开设置
    const openSetting = () => {
      showDrawer.value = true
    }

    // 关闭设置
    const closeDrawer = () => {
      showDrawer.value = false
    }

    return {
      handleOpen,
      handleClose,
      openSetting,
      closeDrawer
    }
  }

  // Props 变化监听
  const usePropsWatcher = (props: { open?: boolean }) => {
    watch(
      () => props.open,
      (val: boolean | undefined) => {
        if (val !== undefined) {
          showDrawer.value = val
        }
      }
    )
  }

  // 初始化设置
  const useSettingsInitializer = () => {
    const themeHandlers = useThemeHandlers()
    const { openSetting } = useDrawerControl()
    const { stopWatch } = useResponsiveLayout()
    let themeCleanup: (() => void) | null = null

    const initializeSettings = () => {
      mittBus.on('openSetting', openSetting)
      themeHandlers.initSystemColor()
      themeCleanup = themeHandlers.listenerSystemTheme()
      initColorWeak()

      // 设置盒子模式
      const boxMode = settingStore.boxBorderMode ? 'border-mode' : 'shadow-mode'
      domOperations.setRootAttribute('data-box-mode', boxMode)

      themeHandlers.initSystemTheme()
      openFestival()
    }

    const cleanupSettings = () => {
      stopWatch()
      themeCleanup?.()
      cleanup()
    }

    return {
      initializeSettings,
      cleanupSettings
    }
  }

  return {
    // 状态
    showDrawer,

    // 方法组合
    useThemeHandlers,
    useResponsiveLayout,
    useDrawerControl,
    usePropsWatcher,
    useSettingsInitializer
  }
}
