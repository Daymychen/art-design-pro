<!-- 设置操作按钮 -->
<template>
  <div
    class="mt-10 flex gap-8 border-t border-[var(--default-border)] bg-[var(--art-bg-color)] pt-5"
  >
    <ElButton type="primary" class="flex-1 !h-8" @click="handleCopyConfig">
      {{ $t('setting.actions.copyConfig') }}
    </ElButton>
    <ElButton type="danger" plain class="flex-1 !h-8" @click="handleResetConfig">
      {{ $t('setting.actions.resetConfig') }}
    </ElButton>
  </div>
</template>

<script setup lang="ts">
  import { nextTick } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  import { SETTING_DEFAULT_CONFIG } from '@/config/setting'
  import { useClipboard } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { MenuThemeEnum } from '@/enums/appEnum'
  import { useTheme } from '@/hooks/core/useTheme'

  defineOptions({ name: 'SettingActions' })

  const { t } = useI18n()
  const settingStore = useSettingStore()
  const { copy, copied } = useClipboard()
  const { switchThemeStyles } = useTheme()

  /** 枚举映射表 */
  const ENUM_MAPS = {
    menuType: {
      left: 'MenuTypeEnum.LEFT',
      top: 'MenuTypeEnum.TOP',
      'top-left': 'MenuTypeEnum.TOP_LEFT',
      'dual-menu': 'MenuTypeEnum.DUAL_MENU'
    },
    systemTheme: {
      auto: 'SystemThemeEnum.AUTO',
      light: 'SystemThemeEnum.LIGHT',
      dark: 'SystemThemeEnum.DARK'
    },
    menuTheme: {
      design: 'MenuThemeEnum.DESIGN',
      light: 'MenuThemeEnum.LIGHT',
      dark: 'MenuThemeEnum.DARK'
    },
    containerWidth: {
      '100%': 'ContainerWidthEnum.FULL',
      '1200px': 'ContainerWidthEnum.BOXED'
    }
  } as const

  /** 配置项定义 */
  interface ConfigItem {
    comment: string
    key: keyof typeof settingStore
    enumMap?: Record<string, string>
    forceValue?: any
  }

  const CONFIG_ITEMS: ConfigItem[] = [
    { comment: '菜单类型', key: 'menuType', enumMap: ENUM_MAPS.menuType },
    { comment: '菜单展开宽度', key: 'menuOpenWidth' },
    { comment: '菜单是否展开', key: 'menuOpen' },
    { comment: '双菜单是否显示文本', key: 'dualMenuShowText' },
    { comment: '系统主题类型', key: 'systemThemeType', enumMap: ENUM_MAPS.systemTheme },
    { comment: '系统主题模式', key: 'systemThemeMode', enumMap: ENUM_MAPS.systemTheme },
    { comment: '菜单风格', key: 'menuThemeType', enumMap: ENUM_MAPS.menuTheme },
    { comment: '系统主题颜色', key: 'systemThemeColor' },
    { comment: '是否显示菜单按钮', key: 'showMenuButton' },
    { comment: '是否显示快速入口', key: 'showFastEnter' },
    { comment: '是否显示刷新按钮', key: 'showRefreshButton' },
    { comment: '是否显示面包屑', key: 'showCrumbs' },
    { comment: '是否显示工作台标签', key: 'showWorkTab' },
    { comment: '是否显示语言切换', key: 'showLanguage' },
    { comment: '是否显示进度条', key: 'showNprogress' },
    { comment: '是否显示设置引导', key: 'showSettingGuide' },
    { comment: '是否显示节日文本', key: 'showFestivalText' },
    { comment: '是否显示水印', key: 'watermarkVisible' },
    { comment: '是否自动关闭', key: 'autoClose' },
    { comment: '是否唯一展开', key: 'uniqueOpened' },
    { comment: '是否色弱模式', key: 'colorWeak' },
    { comment: '是否刷新', key: 'refresh' },
    { comment: '是否加载节日烟花', key: 'holidayFireworksLoaded' },
    { comment: '边框模式', key: 'boxBorderMode' },
    { comment: '页面过渡效果', key: 'pageTransition' },
    { comment: '标签页样式', key: 'tabStyle' },
    { comment: '自定义圆角', key: 'customRadius' },
    { comment: '容器宽度', key: 'containerWidth', enumMap: ENUM_MAPS.containerWidth },
    { comment: '节日日期', key: 'festivalDate', forceValue: '' }
  ]

  /**
   * 将值转换为代码字符串
   */
  const valueToCode = (value: any, enumMap?: Record<string, string>): string => {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'

    // 优先查找枚举映射
    if (enumMap && typeof value === 'string' && enumMap[value]) {
      return enumMap[value]
    }

    // 其他类型处理
    if (typeof value === 'string') return `'${value}'`
    if (typeof value === 'boolean' || typeof value === 'number') return String(value)

    return JSON.stringify(value)
  }

  /**
   * 生成配置代码
   */
  const generateConfigCode = (): string => {
    const lines = ['export const SETTING_DEFAULT_CONFIG = {']

    CONFIG_ITEMS.forEach((item) => {
      lines.push(`  /** ${item.comment} */`)
      const value = item.forceValue !== undefined ? item.forceValue : settingStore[item.key]
      lines.push(`  ${String(item.key)}: ${valueToCode(value, item.enumMap)},`)
    })

    lines.push('}')
    return lines.join('\n')
  }

  /**
   * 复制配置到剪贴板
   */
  const handleCopyConfig = async () => {
    try {
      const configText = generateConfigCode()
      await copy(configText)

      if (copied.value) {
        ElMessage.success({
          message: t('setting.actions.copySuccess'),
          duration: 3000
        })
      }
    } catch (error) {
      console.error('复制配置失败:', error)
      ElMessage.error(t('setting.actions.copyFailed'))
    }
  }

  /**
   * 切换布尔值配置（如果当前值与默认值不同）
   */
  const toggleIfDifferent = (
    currentValue: boolean,
    defaultValue: boolean,
    toggleFn: () => void
  ) => {
    if (currentValue !== defaultValue) {
      toggleFn()
    }
  }

  /**
   * 重置配置为默认值
   */
  const handleResetConfig = async () => {
    try {
      const config = SETTING_DEFAULT_CONFIG

      // 菜单相关
      settingStore.switchMenuLayouts(config.menuType)
      settingStore.setMenuOpenWidth(config.menuOpenWidth)
      settingStore.setMenuOpen(config.menuOpen)
      settingStore.setDualMenuShowText(config.dualMenuShowText)

      // 主题相关 - 使用 switchThemeStyles 确保正确处理 AUTO 模式
      switchThemeStyles(config.systemThemeMode)

      // 等待主题切换完成后，根据实际应用的主题设置菜单主题
      await nextTick()
      const menuTheme = settingStore.isDark ? MenuThemeEnum.DARK : config.menuThemeType
      settingStore.switchMenuStyles(menuTheme)

      settingStore.setElementTheme(config.systemThemeColor)

      // 界面显示（切换类方法）
      toggleIfDifferent(settingStore.showMenuButton, config.showMenuButton, () =>
        settingStore.setButton()
      )
      toggleIfDifferent(settingStore.showFastEnter, config.showFastEnter, () =>
        settingStore.setFastEnter()
      )
      toggleIfDifferent(settingStore.showRefreshButton, config.showRefreshButton, () =>
        settingStore.setShowRefreshButton()
      )
      toggleIfDifferent(settingStore.showCrumbs, config.showCrumbs, () => settingStore.setCrumbs())
      toggleIfDifferent(settingStore.showLanguage, config.showLanguage, () =>
        settingStore.setLanguage()
      )
      toggleIfDifferent(settingStore.showNprogress, config.showNprogress, () =>
        settingStore.setNprogress()
      )

      // 界面显示（直接设置类方法）
      settingStore.setWorkTab(config.showWorkTab)
      settingStore.setShowFestivalText(config.showFestivalText)
      settingStore.setWatermarkVisible(config.watermarkVisible)

      // 功能设置
      toggleIfDifferent(settingStore.autoClose, config.autoClose, () => settingStore.setAutoClose())
      toggleIfDifferent(settingStore.uniqueOpened, config.uniqueOpened, () =>
        settingStore.setUniqueOpened()
      )
      toggleIfDifferent(settingStore.colorWeak, config.colorWeak, () => settingStore.setColorWeak())

      // 样式设置
      toggleIfDifferent(settingStore.boxBorderMode, config.boxBorderMode, () =>
        settingStore.setBorderMode()
      )
      settingStore.setPageTransition(config.pageTransition)
      settingStore.setTabStyle(config.tabStyle)
      settingStore.setCustomRadius(config.customRadius)
      settingStore.setContainerWidth(config.containerWidth)

      // 节日相关
      settingStore.setFestivalDate(config.festivalDate)
      settingStore.setholidayFireworksLoaded(config.holidayFireworksLoaded)

      location.reload()
    } catch (error) {
      console.error('重置配置失败:', error)
      ElMessage.error(t('setting.actions.resetFailed'))
    }
  }
</script>
