/**
 * 快速入口 composable
 * 用于获取和管理快速入口配置
 */

import { computed } from 'vue'
import appConfig from '@/config'
import type { FastEnterApplication, FastEnterQuickLink } from '@/types/config'

export function useFastEnter() {
  // 获取快速入口配置
  const fastEnterConfig = computed(() => appConfig.fastEnter)

  // 获取启用的应用列表（按排序权重排序）
  const enabledApplications = computed<FastEnterApplication[]>(() => {
    if (!fastEnterConfig.value?.applications) return []

    return fastEnterConfig.value.applications
      .filter((app) => app.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  })

  // 获取启用的快速链接（按排序权重排序）
  const enabledQuickLinks = computed<FastEnterQuickLink[]>(() => {
    if (!fastEnterConfig.value?.quickLinks) return []

    return fastEnterConfig.value.quickLinks
      .filter((link) => link.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  })

  // 获取最小显示宽度
  const minWidth = computed(() => {
    return fastEnterConfig.value?.minWidth || 1200
  })

  return {
    fastEnterConfig,
    enabledApplications,
    enabledQuickLinks,
    minWidth
  }
}
