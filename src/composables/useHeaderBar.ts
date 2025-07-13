/**
 * 顶部栏功能管理组合式函数
 * 提供顶部栏功能的配置管理和状态控制
 */

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingStore } from '@/store/modules/setting'
import { headerBarConfig } from '@/config/headerBar'
import { HeaderBarFeatureConfig } from '@/types'

/**
 * 顶部栏功能管理
 * @returns 顶部栏功能相关的状态和方法
 */
export function useHeaderBar() {
  const settingStore = useSettingStore()

  // 获取顶部栏配置
  const headerBarConfigRef = computed<HeaderBarFeatureConfig>(() => headerBarConfig)

  // 从store中获取相关状态
  const { showMenuButton, showFastEnter, showRefreshButton, showCrumbs, showLanguage } =
    storeToRefs(settingStore)

  /**
   * 检查特定功能是否启用
   * @param feature 功能名称
   * @returns 是否启用
   */
  const isFeatureEnabled = (feature: keyof HeaderBarFeatureConfig): boolean => {
    return headerBarConfigRef.value[feature]?.enabled ?? false
  }

  /**
   * 获取功能配置信息
   * @param feature 功能名称
   * @returns 功能配置信息
   */
  const getFeatureConfig = (feature: keyof HeaderBarFeatureConfig) => {
    return headerBarConfigRef.value[feature]
  }

  // 检查菜单按钮是否显示
  const shouldShowMenuButton = computed(() => {
    return isFeatureEnabled('menuButton') && showMenuButton.value
  })

  // 检查刷新按钮是否显示
  const shouldShowRefreshButton = computed(() => {
    return isFeatureEnabled('refreshButton') && showRefreshButton.value
  })

  // 检查快速入口是否显示
  const shouldShowFastEnter = computed(() => {
    return isFeatureEnabled('fastEnter') && showFastEnter.value
  })

  // 检查面包屑是否显示
  const shouldShowBreadcrumb = computed(() => {
    return isFeatureEnabled('breadcrumb') && showCrumbs.value
  })

  // 检查全局搜索是否显示
  const shouldShowGlobalSearch = computed(() => {
    return isFeatureEnabled('globalSearch')
  })

  // 检查全屏按钮是否显示
  const shouldShowFullscreen = computed(() => {
    return isFeatureEnabled('fullscreen')
  })

  // 检查通知中心是否显示
  const shouldShowNotification = computed(() => {
    return isFeatureEnabled('notification')
  })

  // 检查聊天功能是否显示
  const shouldShowChat = computed(() => {
    return isFeatureEnabled('chat')
  })

  // 检查语言切换是否显示
  const shouldShowLanguage = computed(() => {
    return isFeatureEnabled('language') && showLanguage.value
  })

  // 检查设置面板是否显示
  const shouldShowSettings = computed(() => {
    return isFeatureEnabled('settings')
  })

  // 检查主题切换是否显示
  const shouldShowThemeToggle = computed(() => {
    return isFeatureEnabled('themeToggle')
  })

  // 获取快速入口的最小宽度
  const fastEnterMinWidth = computed(() => {
    const config = getFeatureConfig('fastEnter')
    return (config as any)?.minWidth || 1200
  })

  /**
   * 检查功能是否启用（别名）
   * @param feature 功能名称
   * @returns 是否启用
   */
  const isFeatureActive = (feature: keyof HeaderBarFeatureConfig): boolean => {
    return isFeatureEnabled(feature)
  }

  /**
   * 获取功能配置（别名）
   * @param feature 功能名称
   * @returns 功能配置
   */
  const getFeatureInfo = (feature: keyof HeaderBarFeatureConfig) => {
    return getFeatureConfig(feature)
  }

  /**
   * 获取所有启用的功能列表
   * @returns 启用的功能名称数组
   */
  const getEnabledFeatures = (): (keyof HeaderBarFeatureConfig)[] => {
    return Object.keys(headerBarConfigRef.value).filter(
      (key) => headerBarConfigRef.value[key as keyof HeaderBarFeatureConfig]?.enabled
    ) as (keyof HeaderBarFeatureConfig)[]
  }

  /**
   * 获取所有禁用的功能列表
   * @returns 禁用的功能名称数组
   */
  const getDisabledFeatures = (): (keyof HeaderBarFeatureConfig)[] => {
    return Object.keys(headerBarConfigRef.value).filter(
      (key) => !headerBarConfigRef.value[key as keyof HeaderBarFeatureConfig]?.enabled
    ) as (keyof HeaderBarFeatureConfig)[]
  }

  /**
   * 获取所有启用的功能（别名）
   * @returns 启用的功能列表
   */
  const getActiveFeatures = () => {
    return getEnabledFeatures()
  }

  /**
   * 获取所有禁用的功能（别名）
   * @returns 禁用的功能列表
   */
  const getInactiveFeatures = () => {
    return getDisabledFeatures()
  }

  return {
    // 配置
    headerBarConfig: headerBarConfigRef,

    // 显示状态计算属性
    shouldShowMenuButton, // 是否显示菜单按钮
    shouldShowRefreshButton, // 是否显示刷新按钮
    shouldShowFastEnter, // 是否显示快速入口
    shouldShowBreadcrumb, // 是否显示面包屑
    shouldShowGlobalSearch, // 是否显示全局搜索
    shouldShowFullscreen, // 是否显示全屏按钮
    shouldShowNotification, // 是否显示通知中心
    shouldShowChat, // 是否显示聊天功能
    shouldShowLanguage, // 是否显示语言切换
    shouldShowSettings, // 是否显示设置面板
    shouldShowThemeToggle, // 是否显示主题切换

    // 配置相关
    fastEnterMinWidth, // 快速入口最小宽度

    // 方法
    isFeatureEnabled, // 检查功能是否启用
    isFeatureActive, // 检查功能是否启用（别名）
    getFeatureConfig, // 获取功能配置
    getFeatureInfo, // 获取功能配置（别名）
    getEnabledFeatures, // 获取所有启用的功能
    getDisabledFeatures, // 获取所有禁用的功能
    getActiveFeatures, // 获取所有启用的功能（别名）
    getInactiveFeatures // 获取所有禁用的功能（别名）
  }
}
