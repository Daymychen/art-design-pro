import { ref, reactive, computed, onMounted, onUnmounted, nextTick, readonly } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useTableColumns } from './useTableColumns'
import type { ColumnOption } from '@/types/component'

// 导入拆分的模块
import { TableCache, CacheInvalidationStrategy, type ApiResponse } from '../utils/table/tableCache'

import {
  type BaseRequestParams,
  type TableError,
  defaultResponseAdapter,
  extractTableData,
  updatePaginationFromResponse,
  createSmartDebounce,
  createErrorHandler
} from '../utils/table/tableUtils'

// 🚀 优化的配置接口 - 按功能域分组
export interface UseTableConfig<
  T = unknown,
  P extends BaseRequestParams = BaseRequestParams,
  R = any
> {
  // 🔧 核心配置
  core: {
    /** API 请求函数 */
    apiFn: (params: P) => Promise<R>
    /** 默认请求参数 */
    apiParams?: Partial<P>
    /** 是否立即加载数据 */
    immediate?: boolean
    /** 列配置工厂函数 */
    columnsFactory?: () => ColumnOption<T>[]
    /** 自定义分页字段映射 */
    paginationKey?: {
      /** 当前页码字段名，默认为 'current' */
      current?: string
      /** 每页条数字段名，默认为 'size' */
      size?: string
    }
  }

  // 🎯 数据处理
  transform?: {
    /** 数据转换函数 */
    dataTransformer?: (data: unknown) => T[]
    /** 响应数据适配器 */
    responseAdapter?: (response: R) => ApiResponse<T>
  }

  // 🚀 性能优化
  performance?: {
    /** 是否启用缓存 */
    enableCache?: boolean
    /** 缓存时间（毫秒） */
    cacheTime?: number
    /** 防抖延迟时间（毫秒） */
    debounceTime?: number
    /** 最大缓存条数限制 */
    maxCacheSize?: number
  }

  // 🎪 生命周期钩子
  hooks?: {
    /** 数据加载成功回调（仅网络请求成功时触发） */
    onSuccess?: (data: T[], response: ApiResponse<T>) => void
    /** 错误处理回调 */
    onError?: (error: TableError) => void
    /** 缓存命中回调（从缓存获取数据时触发） */
    onCacheHit?: (data: T[], response: ApiResponse<T>) => void
    /** 加载状态变化回调 */
    onLoading?: (loading: boolean) => void
    /** 重置表单回调函数 */
    resetFormCallback?: () => void
  }

  // 🔍 调试配置
  debug?: {
    /** 是否启用日志输出 */
    enableLog?: boolean
    /** 日志级别 */
    logLevel?: 'info' | 'warn' | 'error'
  }
}

/**
 * 🚀 useTable - 强大的表格数据管理 Hook
 *
 * 提供完整的表格解决方案，包括：
 * - 数据获取与缓存
 * - 分页控制
 * - 搜索功能
 * - 智能刷新策略
 * - 错误处理
 * - 列配置管理
 */
export function useTable<T = unknown, P extends BaseRequestParams = BaseRequestParams, R = any>(
  config: UseTableConfig<T, P, R>
) {
  // 🔧 解构优化后的配置
  const {
    core: {
      apiFn,
      apiParams = {} as Partial<P>,
      immediate = true,
      columnsFactory,
      paginationKey = { current: 'current', size: 'size' }
    },
    transform: { dataTransformer, responseAdapter = defaultResponseAdapter } = {},
    performance: {
      enableCache = false,
      cacheTime = 5 * 60 * 1000,
      debounceTime = 300,
      maxCacheSize = 50
    } = {},
    hooks: { onSuccess, onError, onCacheHit, resetFormCallback } = {},
    debug: { enableLog = false } = {}
  } = config

  // 🔧 分页字段名配置
  const pageKey = paginationKey?.current || 'current'
  const sizeKey = paginationKey?.size || 'size'

  // 响应式触发器，用于手动更新缓存统计信息
  const cacheUpdateTrigger = ref(0)

  // 🔧 日志工具函数
  const logger = {
    log: (message: string, ...args: any[]) => {
      if (enableLog) {
        console.log(`[useTable] ${message}`, ...args)
      }
    },
    warn: (message: string, ...args: any[]) => {
      if (enableLog) {
        console.warn(`[useTable] ${message}`, ...args)
      }
    },
    error: (message: string, ...args: any[]) => {
      if (enableLog) {
        console.error(`[useTable] ${message}`, ...args)
      }
    }
  }

  // 缓存实例
  const cache = enableCache ? new TableCache<T>(cacheTime, maxCacheSize, enableLog) : null

  // 加载状态
  const loading = ref(false)

  // 错误状态
  const error = ref<TableError | null>(null)

  // 表格数据
  const data = ref<T[]>([])

  // 请求取消控制器
  let abortController: AbortController | null = null

  // 缓存清理定时器
  let cacheCleanupTimer: NodeJS.Timeout | null = null

  // 搜索参数
  const searchParams = reactive(
    Object.assign(
      {
        [pageKey]: 1,
        [sizeKey]: 10
      },
      apiParams || {}
    ) as P
  )

  // 分页配置
  const pagination = reactive<Api.Common.PaginatingParams>({
    current: (searchParams as any)[pageKey] || 1,
    size: (searchParams as any)[sizeKey] || 10,
    total: 0
  })

  // 移动端分页 (响应式)
  const { width } = useWindowSize()
  const mobilePagination = computed(() => ({
    ...pagination,
    small: width.value < 768
  }))

  // 列配置
  const columnConfig = columnsFactory ? useTableColumns<T>(columnsFactory) : null
  const columns = columnConfig?.columns
  const columnChecks = columnConfig?.columnChecks

  // 是否有数据
  const hasData = computed(() => data.value.length > 0)

  // 缓存统计信息
  const cacheStats = computed(() => {
    // 依赖触发器，确保缓存变化时重新计算
    void cacheUpdateTrigger.value
    if (!cache) return { total: 0, size: '0KB', hitRate: '0 avg hits' }
    return cache.getStats()
  })

  // 错误处理函数
  const handleError = createErrorHandler(onError, enableLog)

  // 智能缓存失效处理
  const invalidateCache = (strategy: CacheInvalidationStrategy, context?: string): void => {
    if (!cache) return

    let clearedCount = 0

    switch (strategy) {
      case CacheInvalidationStrategy.CLEAR_ALL:
        cache.clear()
        logger.log(`清空所有缓存 - ${context || ''}`)
        break

      case CacheInvalidationStrategy.CLEAR_CURRENT:
        clearedCount = cache.clearCurrentSearch(searchParams)
        logger.log(`清空当前搜索缓存 ${clearedCount} 条 - ${context || ''}`)
        break

      case CacheInvalidationStrategy.CLEAR_PAGINATION:
        clearedCount = cache.clearPagination()
        logger.log(`清空分页缓存 ${clearedCount} 条 - ${context || ''}`)
        break

      case CacheInvalidationStrategy.KEEP_ALL:
      default:
        logger.log(`保持缓存不变 - ${context || ''}`)
        break
    }
    // 手动触发缓存状态更新
    cacheUpdateTrigger.value++
  }

  // 获取数据的核心方法
  const fetchData = async (
    params?: Partial<P>,
    useCache = enableCache
  ): Promise<ApiResponse<T>> => {
    // 取消上一个请求
    if (abortController) {
      abortController.abort()
    }

    // 创建新的取消控制器
    const currentController = new AbortController()
    abortController = currentController

    loading.value = true
    error.value = null

    try {
      const requestParams = Object.assign(
        {},
        searchParams,
        {
          [pageKey]: pagination.current,
          [sizeKey]: pagination.size
        },
        params || {}
      ) as P

      // 检查缓存
      if (useCache && cache) {
        const cachedItem = cache.get(requestParams)
        if (cachedItem) {
          data.value = cachedItem.data
          updatePaginationFromResponse(pagination, cachedItem.response)

          // 🔧 修复：避免重复设置相同的值，防止响应式循环更新
          if ((searchParams as any)[pageKey] !== pagination.current) {
            ;(searchParams as any)[pageKey] = pagination.current
          }
          if ((searchParams as any)[sizeKey] !== pagination.size) {
            ;(searchParams as any)[sizeKey] = pagination.size
          }

          loading.value = false

          // 🔧 缓存命中时触发专门的回调，而不是 onSuccess
          if (onCacheHit) {
            onCacheHit(cachedItem.data, cachedItem.response)
          }

          logger.log(`缓存命中`)
          return cachedItem.response
        }
      }

      const response = await apiFn(requestParams)

      // 检查请求是否被取消
      if (currentController.signal.aborted) {
        throw new Error('请求已取消')
      }

      // 使用响应适配器转换为标准格式
      const standardResponse = responseAdapter(response)

      // 处理响应数据
      let tableData = extractTableData(standardResponse)

      // 应用数据转换函数
      if (dataTransformer) {
        tableData = dataTransformer(tableData)
      }

      // 更新状态
      data.value = tableData
      updatePaginationFromResponse(pagination, standardResponse)

      // 🔧 修复：避免重复设置相同的值，防止响应式循环更新
      if ((searchParams as any)[pageKey] !== pagination.current) {
        ;(searchParams as any)[pageKey] = pagination.current
      }
      if ((searchParams as any)[sizeKey] !== pagination.size) {
        ;(searchParams as any)[sizeKey] = pagination.size
      }

      // 缓存数据
      if (useCache && cache) {
        cache.set(requestParams, tableData, standardResponse)
        // 手动触发缓存状态更新
        cacheUpdateTrigger.value++
        logger.log(`数据已缓存`)
      }

      // 成功回调
      if (onSuccess) {
        onSuccess(tableData, standardResponse)
      }

      return standardResponse
    } catch (err) {
      if (err instanceof Error && err.message === '请求已取消') {
        // 请求被取消，不做处理
        return { records: [], total: 0, current: 1, size: 10 }
      }

      data.value = []
      const tableError = handleError(err, '获取表格数据失败')
      throw tableError
    } finally {
      loading.value = false
      // 只有当前控制器是活跃的才清空
      if (abortController === currentController) {
        abortController = null
      }
    }
  }

  // 获取数据 (保持当前页)
  const getData = async (params?: Partial<P>): Promise<ApiResponse<T> | void> => {
    try {
      return await fetchData(params)
    } catch {
      // 错误已在 fetchData 中处理
      return Promise.resolve()
    }
  }

  // 分页获取数据 (重置到第一页) - 专门用于搜索场景
  const getDataByPage = async (params?: Partial<P>): Promise<ApiResponse<T> | void> => {
    pagination.current = 1
    ;(searchParams as any)[pageKey] = 1

    // 🔧 搜索时清空当前搜索条件的缓存，确保获取最新数据
    invalidateCache(CacheInvalidationStrategy.CLEAR_CURRENT, '搜索数据')

    try {
      return await fetchData(params, false) // 搜索时不使用缓存
    } catch {
      // 错误已在 fetchData 中处理
      return Promise.resolve()
    }
  }

  // 智能防抖搜索函数
  const debouncedGetDataByPage = createSmartDebounce(getDataByPage, debounceTime)

  // 重置搜索参数
  const resetSearchParams = async (): Promise<void> => {
    // 取消防抖的搜索
    debouncedGetDataByPage.cancel()

    // 保存分页相关的默认值
    const defaultPagination = {
      [pageKey]: 1,
      [sizeKey]: (searchParams as any)[sizeKey] || 10
    }

    // 清空所有搜索参数
    Object.keys(searchParams).forEach((key) => {
      delete (searchParams as Record<string, any>)[key]
    })

    // 重新设置默认参数
    Object.assign(searchParams, apiParams || {}, defaultPagination)

    // 重置分页
    pagination.current = 1
    pagination.size = (defaultPagination as any)[sizeKey]

    // 清空错误状态
    error.value = null

    // 清空缓存
    invalidateCache(CacheInvalidationStrategy.CLEAR_ALL, '重置搜索')

    // 重新获取数据
    await getData()

    // 执行重置回调
    if (resetFormCallback) {
      await nextTick()
      resetFormCallback()
    }
  }

  // 防重复调用的标志
  let isCurrentChanging = false

  // 处理分页大小变化
  const handleSizeChange = async (newSize: number): Promise<void> => {
    if (newSize <= 0) return

    debouncedGetDataByPage.cancel()

    pagination.size = newSize
    pagination.current = 1
    ;(searchParams as any)[sizeKey] = newSize
    ;(searchParams as any)[pageKey] = 1

    invalidateCache(CacheInvalidationStrategy.CLEAR_CURRENT, '分页大小变化')

    await getData()
  }

  // 处理当前页变化
  const handleCurrentChange = async (newCurrent: number): Promise<void> => {
    if (newCurrent <= 0) return

    // 🔧 修复：防止重复调用
    if (isCurrentChanging) {
      return
    }

    // 🔧 修复：如果当前页没有变化，不需要重新请求
    if (pagination.current === newCurrent) {
      logger.log('分页页码未变化，跳过请求')
      return
    }

    try {
      isCurrentChanging = true

      // 🔧 修复：只更新必要的状态
      pagination.current = newCurrent
      // 只有当 searchParams 的分页字段与新值不同时才更新
      if ((searchParams as any)[pageKey] !== newCurrent) {
        ;(searchParams as any)[pageKey] = newCurrent
      }

      await getData()
    } finally {
      isCurrentChanging = false
    }
  }

  // 🚀 针对不同业务场景的刷新方法

  // 新增数据后刷新 - 回到第一页，清空分页缓存
  const refreshAfterAdd = async (): Promise<void> => {
    debouncedGetDataByPage.cancel()
    pagination.current = 1
    ;(searchParams as any)[pageKey] = 1
    invalidateCache(CacheInvalidationStrategy.CLEAR_PAGINATION, '新增数据')
    await getData()
  }

  // 编辑数据后刷新 - 保持当前页，清空当前搜索缓存
  const refreshAfterEdit = async (): Promise<void> => {
    invalidateCache(CacheInvalidationStrategy.CLEAR_CURRENT, '编辑数据')
    await getData()
  }

  // 删除数据后刷新 - 智能处理页码
  const refreshAfterDelete = async (): Promise<void> => {
    // 如果当前页只有1条数据，且不是第1页，则回到上一页
    if (data.value.length === 1 && pagination.current > 1) {
      pagination.current = pagination.current - 1
      ;(searchParams as any)[pageKey] = pagination.current
    }

    invalidateCache(CacheInvalidationStrategy.CLEAR_CURRENT, '删除数据')
    await getData()
  }

  // 通用刷新 - 清空所有缓存
  const refresh = async (): Promise<void> => {
    debouncedGetDataByPage.cancel()
    invalidateCache(CacheInvalidationStrategy.CLEAR_ALL, '手动刷新')
    await getData()
  }

  // 软刷新 - 仅清空当前搜索缓存
  const softRefresh = async (): Promise<void> => {
    invalidateCache(CacheInvalidationStrategy.CLEAR_CURRENT, '软刷新')
    await getData()
  }

  // 取消当前请求
  const cancelRequest = (): void => {
    if (abortController) {
      abortController.abort()
    }
    debouncedGetDataByPage.cancel()
  }

  // 清空数据
  const clearData = (): void => {
    data.value = []
    error.value = null
    invalidateCache(CacheInvalidationStrategy.CLEAR_ALL, '清空数据')
  }

  // 手动清理过期缓存
  const cleanupExpiredCache = (): number => {
    if (!cache) return 0
    const cleanedCount = cache.cleanupExpired()
    if (cleanedCount > 0) {
      // 手动触发缓存状态更新
      cacheUpdateTrigger.value++
    }
    return cleanedCount
  }

  // 设置定期清理过期缓存
  if (enableCache && cache) {
    cacheCleanupTimer = setInterval(() => {
      const cleanedCount = cache.cleanupExpired()
      if (cleanedCount > 0) {
        logger.log(`自动清理 ${cleanedCount} 条过期缓存`)
        // 手动触发缓存状态更新
        cacheUpdateTrigger.value++
      }
    }, cacheTime / 2) // 每半个缓存周期清理一次
  }

  // 挂载时自动加载数据
  if (immediate) {
    onMounted(async () => {
      await getData()
    })
  }

  // 组件卸载时彻底清理
  onUnmounted(() => {
    cancelRequest()
    if (cache) {
      cache.clear()
    }
    if (cacheCleanupTimer) {
      clearInterval(cacheCleanupTimer)
    }
  })

  // 🚀 优化的返回值结构
  return {
    // 数据相关 - 更明确的命名
    tableData: data,
    isLoading: readonly(loading),
    hasError: readonly(error),
    isEmpty: computed(() => data.value.length === 0),
    hasData,

    // 分页相关 - 统一前缀
    paginationState: readonly(pagination),
    paginationMobile: mobilePagination,
    onPageSizeChange: handleSizeChange,
    onCurrentPageChange: handleCurrentChange,

    // 搜索相关 - 统一前缀
    searchState: searchParams,
    resetSearch: resetSearchParams,

    // 数据操作 - 更明确的操作意图
    loadData: getData,
    searchData: getDataByPage,
    searchDataDebounced: debouncedGetDataByPage,

    // 刷新策略 - 更明确的场景
    refreshAll: refresh,
    refreshSoft: softRefresh,
    refreshAfterCreate: refreshAfterAdd,
    refreshAfterUpdate: refreshAfterEdit,
    refreshAfterRemove: refreshAfterDelete,

    // 缓存控制
    cacheStatistics: cacheStats,
    invalidateCache,
    clearExpiredCache: cleanupExpiredCache,

    // 请求控制
    abortRequest: cancelRequest,
    clearAllData: clearData,

    // 列配置 (如果提供了 columnsFactory)
    ...(columnConfig && {
      columns,
      columnChecks
    })
  }
}

// 重新导出类型和枚举，方便使用
export { CacheInvalidationStrategy } from '../utils/table/tableCache'
export type { ApiResponse, CacheItem } from '../utils/table/tableCache'
export type { BaseRequestParams, TableError } from '../utils/table/tableUtils'
