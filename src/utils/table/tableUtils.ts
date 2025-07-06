// 表格工具函数

import type { ApiResponse } from './tableCache'

// 请求参数基础接口，扩展分页参数
export interface BaseRequestParams extends Api.Common.PaginatingParams {
  [key: string]: unknown
}

// 错误处理接口
export interface TableError {
  code: string
  message: string
  details?: unknown
}

/**
 * 默认响应适配器 - 支持多种常见的API响应格式
 */
export const defaultResponseAdapter = <T>(response: unknown): ApiResponse<T> => {
  // 处理空响应
  if (!response) {
    return { records: [], total: 0, current: 1, size: 10 }
  }

  // 如果响应直接是数组
  if (Array.isArray(response)) {
    return {
      records: response,
      total: response.length,
      current: 1,
      size: response.length
    }
  }

  // 处理对象类型响应
  if (typeof response === 'object') {
    const res = response as Record<string, unknown>

    // 标准格式：{ records, total, current, size }
    if ('records' in res || 'data' in res) {
      return {
        records: (res.records || res.data || []) as T[],
        total: (res.total || res.count || 0) as number,
        current: (res.current || res.page || res.pageNum || 1) as number,
        size: (res.size || res.pageSize || res.limit || 10) as number
      }
    }

    // 嵌套的data属性：{ data: { records, total } }
    if ('data' in res && res.data && typeof res.data === 'object') {
      const data = res.data as Record<string, unknown>

      // 处理 { data: { list, total } } 格式
      if ('list' in data || 'records' in data || 'items' in data) {
        return {
          records: (data.list || data.records || data.items || []) as T[],
          total: (data.total || data.count || 0) as number,
          current: (data.current ||
            data.page ||
            data.pageNum ||
            res.current ||
            res.page ||
            1) as number,
          size: (data.size ||
            data.pageSize ||
            data.limit ||
            res.size ||
            res.pageSize ||
            10) as number
        }
      }

      // 处理 { data: [...] } 格式
      if (Array.isArray(data)) {
        return {
          records: data as T[],
          total: data.length,
          current: 1,
          size: data.length
        }
      }
    }

    // 处理直接包含列表字段的格式：{ list, total }
    if ('list' in res || 'items' in res) {
      const records = (res.list || res.items || []) as T[]
      return {
        records,
        total: (res.total || res.count || records.length) as number,
        current: (res.current || res.page || res.pageNum || 1) as number,
        size: (res.size || res.pageSize || res.limit || 10) as number
      }
    }

    // 尝试从响应中提取数组字段
    const possibleArrayFields = ['data', 'list', 'items', 'records', 'result']
    for (const field of possibleArrayFields) {
      if (field in res && Array.isArray(res[field])) {
        const records = res[field] as T[]
        return {
          records,
          total: (res.total || res.count || records.length) as number,
          current: (res.current || res.page || 1) as number,
          size: (res.size || res.pageSize || 10) as number
        }
      }
    }
  }

  // 兜底处理：返回空数据
  console.warn('[tableUtils] 无法识别的响应格式:', response)
  return { records: [], total: 0, current: 1, size: 10 }
}

/**
 * 从标准化的API响应中提取表格数据
 */
export const extractTableData = <T>(response: ApiResponse<T>): T[] => {
  // 优先使用 records，然后是 data
  const data = response.records || response.data || []

  // 确保返回数组
  if (!Array.isArray(data)) {
    console.warn('[tableUtils] 期望得到数组数据，实际收到:', typeof data)
    return []
  }

  return data
}

/**
 * 根据API响应更新分页信息
 */
export const updatePaginationFromResponse = <T>(
  pagination: Api.Common.PaginatingParams,
  response: ApiResponse<T>
): void => {
  // 使用响应中的分页信息，如果没有则保持当前值
  pagination.total = response.total ?? pagination.total ?? 0
  pagination.current = response.current ?? pagination.current ?? 1
  pagination.size = response.size ?? pagination.size ?? 10

  // 边界检查：确保当前页不超过总页数
  const maxPage = Math.max(1, Math.ceil(pagination.total / pagination.size))
  if (pagination.current > maxPage) {
    pagination.current = maxPage
  }
}

/**
 * 创建智能防抖函数 - 支持取消和立即执行
 */
export const createSmartDebounce = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
): T & { cancel: () => void; flush: () => Promise<any> } => {
  let timeoutId: NodeJS.Timeout | null = null
  let lastArgs: Parameters<T> | null = null
  let lastResolve: ((value: any) => void) | null = null
  let lastReject: ((reason: any) => void) | null = null

  const debouncedFn = (...args: Parameters<T>): Promise<any> => {
    return new Promise((resolve, reject) => {
      // 取消之前的调用
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // 保存当前调用的参数和Promise resolvers
      lastArgs = args
      lastResolve = resolve
      lastReject = reject

      // 设置新的延迟调用
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args)
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          timeoutId = null
          lastArgs = null
          lastResolve = null
          lastReject = null
        }
      }, delay)
    })
  }

  // 取消防抖调用
  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
      lastArgs = null
      lastResolve = null
      lastReject = null
    }
  }

  // 立即执行防抖调用
  debouncedFn.flush = async (): Promise<any> => {
    if (timeoutId && lastArgs && lastResolve && lastReject) {
      clearTimeout(timeoutId)
      timeoutId = null

      const args = lastArgs
      const resolve = lastResolve
      const reject = lastReject

      lastArgs = null
      lastResolve = null
      lastReject = null

      try {
        const result = await fn(...args)
        resolve(result)
        return result
      } catch (error) {
        reject(error)
        throw error
      }
    }

    return Promise.resolve()
  }

  return debouncedFn as T & { cancel: () => void; flush: () => Promise<any> }
}

/**
 * 生成错误处理函数
 */
export const createErrorHandler = (
  onError?: (error: TableError) => void,
  enableLog: boolean = false
) => {
  const logger = {
    error: (message: string, ...args: any[]) => {
      if (enableLog) {
        console.error(`[useTable] ${message}`, ...args)
      }
    }
  }

  return (err: unknown, context: string): TableError => {
    const tableError: TableError = {
      code: 'UNKNOWN_ERROR',
      message: '未知错误',
      details: err
    }

    if (err instanceof Error) {
      tableError.message = err.message
      tableError.code = err.name
    } else if (typeof err === 'string') {
      tableError.message = err
    }

    logger.error(`${context}:`, err)

    if (onError) {
      onError(tableError)
    }

    return tableError
  }
}
