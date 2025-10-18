/**
 * 远程搜索 Composable
 */

import { ref, computed } from 'vue'

export interface UseRemoteConfig {
  /** 是否启用远程搜索 */
  enabled?: boolean
  /** 查询参数 key */
  queryKey?: string
  /** 防抖延迟 */
  debounce?: number
  /** 最小搜索字符数 */
  minLength?: number
}

/**
 * 远程搜索管理
 */
export function useRemote(config: UseRemoteConfig = {}) {
  const { enabled = false, queryKey = 'keyword', minLength = 0 } = config

  // 当前搜索关键词
  const query = ref('')

  // 是否正在搜索
  const isSearching = computed(() => {
    return enabled && query.value.length > 0
  })

  // 是否可以搜索
  const canSearch = computed(() => {
    if (!enabled) return false
    return query.value.length >= minLength
  })

  /**
   * 获取搜索参数
   */
  const getSearchParams = (baseParams: any = {}) => {
    if (!enabled || !canSearch.value) {
      return baseParams
    }

    return {
      ...baseParams,
      [queryKey]: query.value
    }
  }

  /**
   * 重置搜索
   */
  const resetSearch = () => {
    query.value = ''
  }

  /**
   * 设置搜索关键词
   */
  const setQuery = (value: string) => {
    query.value = value
  }

  return {
    query,
    isSearching,
    canSearch,
    getSearchParams,
    resetSearch,
    setQuery
  }
}
