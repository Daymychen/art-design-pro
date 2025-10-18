/**
 * API Select 核心逻辑 Composable
 * 整合所有功能模块
 */

import { ref, watch, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { get } from 'lodash-es'
import type { Ref } from 'vue'
import type { ApiSelectProps, OptionItem, LoadingState } from './types'
import { useRemote } from './useRemote'
import { useOptions } from './useOptions'

export interface UseApiSelectOptions extends ApiSelectProps {
  /** 绑定值 */
  modelValue?: Ref<any>
  /** emit 函数 */
  emit?: {
    (e: 'load-success', data: OptionItem[]): void
    (e: 'load-error', error: any): void
    (e: 'load-start'): void
    (e: 'load-end'): void
    (e: 'remote-search', query: string): void
    (e: 'options-change', options: OptionItem[]): void
  }
}

export function useApiSelect(props: UseApiSelectOptions) {
  const {
    api,
    params = {},
    labelField = 'label',
    valueField = 'value',
    dataPath = 'data',
    immediate = true,
    loadOn = 'mounted',
    debounce: debounceTime = 300,
    transform,
    prependOptions,
    appendOptions,
    remote = false,
    remoteQueryKey = 'keyword',
    remoteDebounce = 300,
    remoteMinLength = 0,
    emit
  } = props

  // ========== 状态管理 ==========
  const loadingState = ref<LoadingState>('idle')
  const error = ref<Error | null>(null)

  // ========== 远程搜索 ==========
  const remoteSearch = useRemote({
    enabled: remote,
    queryKey: remoteQueryKey,
    debounce: remoteDebounce,
    minLength: remoteMinLength
  })

  // ========== 选项管理 ==========
  const optionsManager = useOptions({
    labelField,
    valueField,
    prependOptions,
    appendOptions,
    transform
  })

  // ========== 计算属性 ==========
  const loading = ref(false)
  const options = optionsManager.processedOptions

  /**
   * 构建请求参数
   */
  const buildParams = (baseParams: any = params) => {
    let finalParams = { ...baseParams }

    // 添加远程搜索参数
    if (remote) {
      finalParams = remoteSearch.getSearchParams(finalParams)
    }

    return finalParams
  }

  /**
   * 加载数据核心逻辑
   */
  const loadData = async (): Promise<void> => {
    if (!api) {
      return
    }

    const requestParams = buildParams()

    try {
      loading.value = true
      loadingState.value = 'loading'
      error.value = null
      emit?.('load-start')

      // 调用 API
      const response = Array.isArray(requestParams)
        ? await api(...requestParams)
        : await api(requestParams)

      // 提取数据（使用 lodash get，默认返回空数组）
      let data = get(response, dataPath, [])

      // 确保数据是数组
      if (!Array.isArray(data)) {
        console.warn('[ApiSelect] 响应数据不是数组:', data)
        data = []
      }

      // 更新选项
      optionsManager.setRawOptions(data)

      loadingState.value = 'success'
      emit?.('load-success', data)
      emit?.('options-change', options.value)
    } catch (err: any) {
      error.value = err
      loadingState.value = 'error'
      emit?.('load-error', err)
    } finally {
      loading.value = false
      emit?.('load-end')
    }
  }

  /**
   * 刷新数据
   */
  const refresh = async () => {
    remoteSearch.resetSearch()
    await loadData()
  }

  /**
   * 刷新数据（防抖版本，参数变化时使用）
   */
  const debouncedRefresh = useDebounceFn(refresh, debounceTime)

  /**
   * 远程搜索（使用真正的防抖）
   */
  const handleRemoteSearch = useDebounceFn(async (query: string) => {
    if (!remote) return

    remoteSearch.setQuery(query)
    emit?.('remote-search', query)

    await loadData()
  }, remoteDebounce)

  /**
   * 清空选项
   */
  const clearOptions = () => {
    optionsManager.clearOptions()
  }

  /**
   * 手动重试
   */
  const manualRetry = async () => {
    await loadData()
  }

  // ========== 生命周期和监听 ==========

  /**
   * 监听参数变化（使用防抖）
   */
  watch(
    () => props.params,
    () => {
      debouncedRefresh()
    },
    { deep: true }
  )

  /**
   * 监听远程搜索关键词变化
   * 当搜索关键词从有值变为空值时，重新加载所有数据
   */
  if (remote) {
    watch(
      () => remoteSearch.query.value,
      (newQuery, oldQuery) => {
        // 只在清空搜索时触发（从有值变为空值）
        if (oldQuery && !newQuery) {
          loadData()
        }
      }
    )
  }

  /**
   * 组件挂载时加载
   */
  if (loadOn === 'mounted' && immediate) {
    onMounted(() => {
      loadData()
    })
  }

  return {
    // 状态
    loading,
    loadingState,
    error,
    options,

    // 远程搜索
    query: remoteSearch.query,
    isSearching: remoteSearch.isSearching,

    // 方法
    loadData,
    refresh,
    handleRemoteSearch,
    clearOptions,
    manualRetry,
    findOptionByValue: optionsManager.findOptionByValue,
    findOptionsByValues: optionsManager.findOptionsByValues,
    getOptionLabel: optionsManager.getOptionLabel,
    getOptionValue: optionsManager.getOptionValue
  }
}
