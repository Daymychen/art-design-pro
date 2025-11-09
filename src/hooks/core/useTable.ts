/**
 * useTable - 企业级表格数据管理方案
 *
 * 功能完整的表格数据管理解决方案，专为后台管理系统设计。
 * 封装了表格开发中的所有常见需求，让你专注于业务逻辑。
 *
 * ## 主要功能
 *
 * 1. 数据管理 - 自动处理 API 请求、响应转换、加载状态和错误处理
 * 2. 分页控制 - 自动同步分页状态、移动端适配、智能页码边界处理
 * 3. 搜索功能 - 防抖搜索优化、参数管理、一键重置、参数过滤
 * 4. 缓存系统 - 智能请求缓存、多种清理策略、自动过期管理、统计信息
 * 5. 刷新策略 - 提供 5 种刷新方法适配不同业务场景（新增/更新/删除/手动/定时）
 * 6. 列配置管理 - 动态显示/隐藏列、列排序、配置持久化、批量操作（可选）
 *
 * @module useTable
 * @author Art Design Pro Team
 */

import { ref, reactive, computed, onMounted, onUnmounted, nextTick, readonly } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useTableColumns } from './useTableColumns'
import type { ColumnOption } from '@/types/component'
import {
  TableCache,
  CacheInvalidationStrategy,
  type ApiResponse
} from '../../utils/table/tableCache'
import {
  type TableError,
  defaultResponseAdapter,
  extractTableData,
  updatePaginationFromResponse,
  createSmartDebounce,
  createErrorHandler
} from '../../utils/table/tableUtils'
import { tableConfig } from '../../utils/table/tableConfig'

// 类型推导工具类型
type InferApiParams<T> = T extends (params: infer P) => any ? P : never
type InferApiResponse<T> = T extends (params: any) => Promise<infer R> ? R : never
type InferRecordType<T> = T extends Api.Common.PaginatedResponse<infer U> ? U : never

// 优化的配置接口 - 支持自动类型推导
export interface UseTableConfig<
  TApiFn extends (params: any) => Promise<any> = (params: any) => Promise<any>,
  TRecord = InferRecordType<InferApiResponse<TApiFn>>,
  TParams = InferApiParams<TApiFn>,
  TResponse = InferApiResponse<TApiFn>
> {
  // 核心配置
  core: {
    /** API 请求函数 */
    apiFn: TApiFn
    /** 默认请求参数 */
    apiParams?: Partial<TParams>
    /** 排除 apiParams 中的属性 */
    excludeParams?: string[]
    /** 是否立即加载数据 */
    immediate?: boolean
    /** 列配置工厂函数 */
    columnsFactory?: () => ColumnOption<TRecord>[]
    /** 自定义分页字段映射 */
    paginationKey?: {
      /** 当前页码字段名，默认为 'current' */
      current?: string
      /** 每页条数字段名，默认为 'size' */
      size?: string
    }
  }

  // 数据处理
  transform?: {
    /** 数据转换函数 */
    dataTransformer?: (data: TRecord[]) => TRecord[]
    /** 响应数据适配器 */
    responseAdapter?: (response: TResponse) => ApiResponse<TRecord>
  }

  // 性能优化
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

  // 生命周期钩子
  hooks?: {
    /** 数据加载成功回调（仅网络请求成功时触发） */
    onSuccess?: (data: TRecord[], response: ApiResponse<TRecord>) => void
    /** 错误处理回调 */
    onError?: (error: TableError) => void
    /** 缓存命中回调（从缓存获取数据时触发） */
    onCacheHit?: (data: TRecord[], response: ApiResponse<TRecord>) => void
    /** 加载状态变化回调 */
    onLoading?: (loading: boolean) => void
    /** 重置表单回调函数 */
    resetFormCallback?: () => void
  }

  // 调试配置
  debug?: {
    /** 是否启用日志输出 */
    enableLog?: boolean
    /** 日志级别 */
    logLevel?: 'info' | 'warn' | 'error'
  }
}

export function useTable<TApiFn extends (params: any) => Promise<any>>(
  config: UseTableConfig<TApiFn>
) {
  return useTableImpl(config)
}

/**
 * useTable 的核心实现 - 强大的表格数据管理 Hook
 *
 * 提供完整的表格解决方案，包括：
 * - 数据获取与缓存
 * - 分页控制
 * - 搜索功能
 * - 智能刷新策略
 * - 错误处理
 * - 列配置管理
 */
function useTableImpl<TApiFn extends (params: any) => Promise<any>>(
  config: UseTableConfig<TApiFn>
) {
  type TRecord = InferRecordType<InferApiResponse<TApiFn>>
  type TParams = InferApiParams<TApiFn>
  const {
    core: {
      apiFn,
      apiParams = {} as Partial<TParams>,
      excludeParams = [],
      immediate = true,
      columnsFactory,
      paginationKey
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

  // 分页字段名配置：优先使用传入的配置，否则使用全局配置
  const pageKey = paginationKey?.current || tableConfig.paginationKey.current
  const sizeKey = paginationKey?.size || tableConfig.paginationKey.size

  // 响应式触发器，用于手动更新缓存统计信息
  const cacheUpdateTrigger = ref(0)

  // 日志工具函数
  const logger = {
    log: (message: string, ...args: unknown[]) => {
      if (enableLog) {
        console.log(`[useTable] ${message}`, ...args)
      }
    },
    warn: (message: string, ...args: unknown[]) => {
      if (enableLog) {
        console.warn(`[useTable] ${message}`, ...args)
      }
    },
    error: (message: string, ...args: unknown[]) => {
      if (enableLog) {
        console.error(`[useTable] ${message}`, ...args)
      }
    }
  }

  // 缓存实例
  const cache = enableCache ? new TableCache<TRecord>(cacheTime, maxCacheSize, enableLog) : null

  // 加载状态机
  type LoadingState = 'idle' | 'loading' | 'success' | 'error'
  const loadingState = ref<LoadingState>('idle')
  const loading = computed(() => loadingState.value === 'loading')

  // 错误状态
  const error = ref<TableError | null>(null)

  // 表格数据
  const data = ref<TRecord[]>([])

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
    ) as TParams
  )

  // 分页配置
  const pagination = reactive<Api.Common.PaginationParams>({
    current: ((searchParams as Record<string, unknown>)[pageKey] as number) || 1,
    size: ((searchParams as Record<string, unknown>)[sizeKey] as number) || 10,
    total: 0
  })

  // 移动端分页 (响应式)
  const { width } = useWindowSize()
  const mobilePagination = computed(() => ({
    ...pagination,
    small: width.value < 768
  }))

  // 列配置
  const columnConfig = columnsFactory ? useTableColumns<TRecord>(columnsFactory) : null
  const columns = columnConfig?.columns
  const columnChecks = columnConfig?.columnChecks

  // 是否有数据
  const hasData = computed(() => data.value.length > 0)

  // 缓存统计信息
  const cacheInfo = computed(() => {
    // 依赖触发器，确保缓存变化时重新计算
    void cacheUpdateTrigger.value
    if (!cache) return { total: 0, size: '0KB', hitRate: '0 avg hits' }
    return cache.getStats()
  })

  // 错误处理函数
  const handleError = createErrorHandler(onError, enableLog)

  // 清理缓存，根据不同的业务场景选择性地清理缓存
  const clearCache = (strategy: CacheInvalidationStrategy, context?: string): void => {
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
    params?: Partial<TParams>,
    useCache = enableCache
  ): Promise<ApiResponse<TRecord>> => {
    // 取消上一个请求
    if (abortController) {
      abortController.abort()
    }

    // 创建新的取消控制器
    const currentController = new AbortController()
    abortController = currentController

    // 状态机：进入 loading 状态
    loadingState.value = 'loading'
    error.value = null

    try {
      let requestParams = Object.assign(
        {},
        searchParams,
        {
          [pageKey]: pagination.current,
          [sizeKey]: pagination.size
        },
        params || {}
      ) as TParams

      // 剔除不需要的参数
      if (excludeParams.length > 0) {
        const filteredParams = { ...requestParams }
        excludeParams.forEach((key) => {
          delete (filteredParams as Record<string, unknown>)[key]
        })
        requestParams = filteredParams as TParams
      }

      // 检查缓存
      if (useCache && cache) {
        const cachedItem = cache.get(requestParams)
        if (cachedItem) {
          data.value = cachedItem.data
          updatePaginationFromResponse(pagination, cachedItem.response)

          // 修复：避免重复设置相同的值，防止响应式循环更新
          const paramsRecord = searchParams as Record<string, unknown>
          if (paramsRecord[pageKey] !== pagination.current) {
            paramsRecord[pageKey] = pagination.current
          }
          if (paramsRecord[sizeKey] !== pagination.size) {
            paramsRecord[sizeKey] = pagination.size
          }

          // 状态机：缓存命中，进入 success 状态
          loadingState.value = 'success'

          // 缓存命中时触发专门的回调，而不是 onSuccess
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

      // 修复：避免重复设置相同的值，防止响应式循环更新
      const paramsRecord = searchParams as Record<string, unknown>
      if (paramsRecord[pageKey] !== pagination.current) {
        paramsRecord[pageKey] = pagination.current
      }
      if (paramsRecord[sizeKey] !== pagination.size) {
        paramsRecord[sizeKey] = pagination.size
      }

      // 缓存数据
      if (useCache && cache) {
        cache.set(requestParams, tableData, standardResponse)
        // 手动触发缓存状态更新
        cacheUpdateTrigger.value++
        logger.log(`数据已缓存`)
      }

      // 状态机：请求成功，进入 success 状态
      loadingState.value = 'success'

      // 成功回调
      if (onSuccess) {
        onSuccess(tableData, standardResponse)
      }

      return standardResponse
    } catch (err) {
      if (err instanceof Error && err.message === '请求已取消') {
        // 请求被取消，回到 idle 状态
        loadingState.value = 'idle'
        return { records: [], total: 0, current: 1, size: 10 }
      }

      // 状态机：请求失败，进入 error 状态
      loadingState.value = 'error'
      data.value = []
      const tableError = handleError(err, '获取表格数据失败')
      throw tableError
    } finally {
      // 只有当前控制器是活跃的才清空
      if (abortController === currentController) {
        abortController = null
      }
    }
  }

  // 获取数据 (保持当前页)
  const getData = async (params?: Partial<TParams>): Promise<ApiResponse<TRecord> | void> => {
    try {
      return await fetchData(params)
    } catch {
      // 错误已在 fetchData 中处理
      return Promise.resolve()
    }
  }

  // 分页获取数据 (重置到第一页) - 专门用于搜索场景
  const getDataByPage = async (params?: Partial<TParams>): Promise<ApiResponse<TRecord> | void> => {
    pagination.current = 1
    ;(searchParams as Record<string, unknown>)[pageKey] = 1

    // 搜索时清空当前搜索条件的缓存，确保获取最新数据
    clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, '搜索数据')

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
    const paramsRecord = searchParams as Record<string, unknown>
    const defaultPagination = {
      [pageKey]: 1,
      [sizeKey]: (paramsRecord[sizeKey] as number) || 10
    }

    // 清空所有搜索参数
    Object.keys(searchParams).forEach((key) => {
      delete paramsRecord[key]
    })

    // 重新设置默认参数
    Object.assign(searchParams, apiParams || {}, defaultPagination)

    // 重置分页
    pagination.current = 1
    pagination.size = defaultPagination[sizeKey] as number

    // 清空错误状态
    error.value = null

    // 清空缓存
    clearCache(CacheInvalidationStrategy.CLEAR_ALL, '重置搜索')

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

    const paramsRecord = searchParams as Record<string, unknown>
    pagination.size = newSize
    pagination.current = 1
    paramsRecord[sizeKey] = newSize
    paramsRecord[pageKey] = 1

    clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, '分页大小变化')

    await getData()
  }

  // 处理当前页变化
  const handleCurrentChange = async (newCurrent: number): Promise<void> => {
    if (newCurrent <= 0) return

    // 修复：防止重复调用
    if (isCurrentChanging) {
      return
    }

    // 修复：如果当前页没有变化，不需要重新请求
    if (pagination.current === newCurrent) {
      logger.log('分页页码未变化，跳过请求')
      return
    }

    try {
      isCurrentChanging = true

      // 修复：只更新必要的状态
      const paramsRecord = searchParams as Record<string, unknown>
      pagination.current = newCurrent
      // 只有当 searchParams 的分页字段与新值不同时才更新
      if (paramsRecord[pageKey] !== newCurrent) {
        paramsRecord[pageKey] = newCurrent
      }

      await getData()
    } finally {
      isCurrentChanging = false
    }
  }

  // 针对不同业务场景的刷新方法

  // 新增后刷新：回到第一页并清空分页缓存（适用于新增数据后）
  const refreshCreate = async (): Promise<void> => {
    debouncedGetDataByPage.cancel()
    pagination.current = 1
    ;(searchParams as Record<string, unknown>)[pageKey] = 1
    clearCache(CacheInvalidationStrategy.CLEAR_PAGINATION, '新增数据')
    await getData()
  }

  // 更新后刷新：保持当前页，仅清空当前搜索缓存（适用于更新数据后）
  const refreshUpdate = async (): Promise<void> => {
    clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, '编辑数据')
    await getData()
  }

  // 删除后刷新：智能处理页码，避免空页面（适用于删除数据后）
  const refreshRemove = async (): Promise<void> => {
    const { current } = pagination

    // 清除缓存并获取最新数据
    clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, '删除数据')
    await getData()

    // 如果当前页为空且不是第一页，回到上一页
    if (data.value.length === 0 && current > 1) {
      pagination.current = current - 1
      ;(searchParams as Record<string, unknown>)[pageKey] = current - 1
      await getData()
    }
  }

  // 全量刷新：清空所有缓存，重新获取数据（适用于手动刷新按钮）
  const refreshData = async (): Promise<void> => {
    debouncedGetDataByPage.cancel()
    clearCache(CacheInvalidationStrategy.CLEAR_ALL, '手动刷新')
    await getData()
  }

  // 轻量刷新：仅清空当前搜索条件的缓存，保持分页状态（适用于定时刷新）
  const refreshSoft = async (): Promise<void> => {
    clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, '软刷新')
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
    clearCache(CacheInvalidationStrategy.CLEAR_ALL, '清空数据')
  }

  // 清理已过期的缓存条目，释放内存空间
  const clearExpiredCache = (): number => {
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

  // 优化的返回值结构
  return {
    // 数据相关
    /** 表格数据 */
    data,
    /** 数据加载状态 */
    loading: readonly(loading),
    /** 错误状态 */
    error: readonly(error),
    /** 数据是否为空 */
    isEmpty: computed(() => data.value.length === 0),
    /** 是否有数据 */
    hasData,

    // 分页相关
    /** 分页状态信息 */
    pagination: readonly(pagination),
    /** 移动端分页配置 */
    paginationMobile: mobilePagination,
    /** 页面大小变化处理 */
    handleSizeChange,
    /** 当前页变化处理 */
    handleCurrentChange,

    // 搜索相关 - 统一前缀
    /** 搜索参数 */
    searchParams,
    /** 重置搜索参数 */
    resetSearchParams,

    // 数据操作 - 更明确的操作意图
    /** 加载数据 */
    fetchData: getData,
    /** 获取数据 */
    getData: getDataByPage,
    /** 获取数据（防抖） */
    getDataDebounced: debouncedGetDataByPage,
    /** 清空数据 */
    clearData,

    // 刷新策略
    /** 全量刷新：清空所有缓存，重新获取数据（适用于手动刷新按钮） */
    refreshData,
    /** 轻量刷新：仅清空当前搜索条件的缓存，保持分页状态（适用于定时刷新） */
    refreshSoft,
    /** 新增后刷新：回到第一页并清空分页缓存（适用于新增数据后） */
    refreshCreate,
    /** 更新后刷新：保持当前页，仅清空当前搜索缓存（适用于更新数据后） */
    refreshUpdate,
    /** 删除后刷新：智能处理页码，避免空页面（适用于删除数据后） */
    refreshRemove,

    // 缓存控制
    /** 缓存统计信息 */
    cacheInfo,
    /** 清除缓存，根据不同的业务场景选择性地清理缓存： */
    clearCache,
    // 支持4种清理策略
    // clearCache(CacheInvalidationStrategy.CLEAR_ALL, '手动刷新')     // 清空所有缓存
    // clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, '搜索数据') // 只清空当前搜索条件的缓存
    // clearCache(CacheInvalidationStrategy.CLEAR_PAGINATION, '新增数据') // 清空分页相关缓存
    // clearCache(CacheInvalidationStrategy.KEEP_ALL, '保持缓存')      // 不清理任何缓存
    /** 清理已过期的缓存条目，释放内存空间 */
    clearExpiredCache,

    // 请求控制
    /** 取消当前请求 */
    cancelRequest,

    // 列配置 (如果提供了 columnsFactory)
    ...(columnConfig && {
      /** 表格列配置 */
      columns,
      /** 列显示控制 */
      columnChecks,
      /** 新增列 */
      addColumn: columnConfig.addColumn,
      /** 删除列 */
      removeColumn: columnConfig.removeColumn,
      /** 切换列显示状态 */
      toggleColumn: columnConfig.toggleColumn,
      /** 更新列配置 */
      updateColumn: columnConfig.updateColumn,
      /** 批量更新列配置 */
      batchUpdateColumns: columnConfig.batchUpdateColumns,
      /** 重新排序列 */
      reorderColumns: columnConfig.reorderColumns,
      /** 获取指定列配置 */
      getColumnConfig: columnConfig.getColumnConfig,
      /** 获取所有列配置 */
      getAllColumns: columnConfig.getAllColumns,
      /** 重置所有列配置到默认状态 */
      resetColumns: columnConfig.resetColumns
    })
  }
}

// 重新导出类型和枚举，方便使用
export { CacheInvalidationStrategy } from '../../utils/table/tableCache'
export type { ApiResponse, CacheItem } from '../../utils/table/tableCache'
export type { BaseRequestParams, TableError } from '../../utils/table/tableUtils'
