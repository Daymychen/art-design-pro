// 表格缓存管理

// 缓存失效策略枚举
export enum CacheInvalidationStrategy {
  /** 清空所有缓存 */
  CLEAR_ALL = 'clear_all',
  /** 仅清空当前查询条件的缓存 */
  CLEAR_CURRENT = 'clear_current',
  /** 清空所有分页缓存（保留不同搜索条件的缓存） */
  CLEAR_PAGINATION = 'clear_pagination',
  /** 不清除缓存 */
  KEEP_ALL = 'keep_all'
}

// 通用 API 响应接口（兼容不同的后端响应格式）
export interface ApiResponse<T = unknown> {
  records?: T[]
  data?: T[]
  total?: number
  current?: number
  size?: number
  [key: string]: unknown
}

// 缓存存储接口
export interface CacheItem<T> {
  data: T[]
  response: ApiResponse<T>
  timestamp: number
  params: string
  // 缓存标签，用于分组管理
  tags: Set<string>
  // 访问次数（用于 LRU 算法）
  accessCount: number
  // 最后访问时间
  lastAccessTime: number
}

// 增强的缓存管理类
export class TableCache<T> {
  private cache = new Map<string, CacheItem<T>>()
  private cacheTime: number
  private maxSize: number
  private enableLog: boolean

  constructor(cacheTime = 5 * 60 * 1000, maxSize = 50, enableLog = false) {
    // 默认5分钟，最多50条缓存
    this.cacheTime = cacheTime
    this.maxSize = maxSize
    this.enableLog = enableLog
  }

  // 内部日志工具
  private log(message: string, ...args: any[]) {
    if (this.enableLog) {
      console.log(`[TableCache] ${message}`, ...args)
    }
  }

  // 🔧 优化：生成稳定的缓存键
  private generateKey(params: unknown): string {
    if (!params || typeof params !== 'object') {
      return JSON.stringify(params)
    }

    // 对象属性排序后再序列化，确保键的稳定性
    const sortedParams = this.sortObjectKeys(params as Record<string, unknown>)
    return JSON.stringify(sortedParams)
  }

  // 递归排序对象键
  private sortObjectKeys(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    const keys = Object.keys(obj).sort()

    for (const key of keys) {
      const value = obj[key]
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = this.sortObjectKeys(value as Record<string, unknown>)
      } else {
        result[key] = value
      }
    }

    return result
  }

  // 🔧 优化：增强类型安全性
  private generateTags(params: Record<string, unknown>): Set<string> {
    const tags = new Set<string>()

    // 添加搜索条件标签
    const searchKeys = Object.keys(params).filter(
      (key) =>
        !['current', 'size', 'total'].includes(key) &&
        params[key] !== undefined &&
        params[key] !== '' &&
        params[key] !== null
    )

    if (searchKeys.length > 0) {
      const searchTag = searchKeys.map((key) => `${key}:${String(params[key])}`).join('|')
      tags.add(`search:${searchTag}`)
    } else {
      tags.add('search:default')
    }

    // 添加分页标签
    tags.add(`pagination:${params.size || 10}`)
    // 添加通用分页标签，用于清理所有分页缓存
    tags.add('pagination')

    return tags
  }

  // 🔧 优化：LRU 缓存清理
  private evictLRU(): void {
    if (this.cache.size <= this.maxSize) return

    // 找到最少使用的缓存项
    let lruKey = ''
    let minAccessCount = Infinity
    let oldestTime = Infinity

    for (const [key, item] of this.cache.entries()) {
      if (
        item.accessCount < minAccessCount ||
        (item.accessCount === minAccessCount && item.lastAccessTime < oldestTime)
      ) {
        lruKey = key
        minAccessCount = item.accessCount
        oldestTime = item.lastAccessTime
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey)
      this.log(`LRU 清理缓存: ${lruKey}`)
    }
  }

  // 设置缓存
  set(params: unknown, data: T[], response: ApiResponse<T>): void {
    const key = this.generateKey(params)
    const tags = this.generateTags(params as Record<string, unknown>)
    const now = Date.now()

    // 检查是否需要清理
    this.evictLRU()

    this.cache.set(key, {
      data,
      response,
      timestamp: now,
      params: key,
      tags,
      accessCount: 1,
      lastAccessTime: now
    })
  }

  // 获取缓存
  get(params: unknown): CacheItem<T> | null {
    const key = this.generateKey(params)
    const item = this.cache.get(key)

    if (!item) return null

    // 检查是否过期
    if (Date.now() - item.timestamp > this.cacheTime) {
      this.cache.delete(key)
      return null
    }

    // 更新访问统计
    item.accessCount++
    item.lastAccessTime = Date.now()

    return item
  }

  // 根据标签清除缓存
  clearByTags(tags: string[]): number {
    let clearedCount = 0

    for (const [key, item] of this.cache.entries()) {
      // 检查是否包含任意一个标签
      const hasMatchingTag = tags.some((tag) =>
        Array.from(item.tags).some((itemTag) => itemTag.includes(tag))
      )

      if (hasMatchingTag) {
        this.cache.delete(key)
        clearedCount++
      }
    }

    return clearedCount
  }

  // 清除当前搜索条件的缓存
  clearCurrentSearch(params: unknown): number {
    const key = this.generateKey(params)
    const deleted = this.cache.delete(key)
    return deleted ? 1 : 0
  }

  // 清除分页缓存
  clearPagination(): number {
    return this.clearByTags(['pagination'])
  }

  // 清空所有缓存
  clear(): void {
    this.cache.clear()
  }

  // 获取缓存统计信息
  getStats(): { total: number; size: string; hitRate: string } {
    const total = this.cache.size
    let totalSize = 0
    let totalAccess = 0

    for (const item of this.cache.values()) {
      // 粗略估算大小（JSON字符串长度）
      totalSize += JSON.stringify(item.data).length
      totalAccess += item.accessCount
    }

    // 转换为人类可读的大小
    const sizeInKB = (totalSize / 1024).toFixed(2)
    const avgHits = total > 0 ? (totalAccess / total).toFixed(1) : '0'

    return {
      total,
      size: `${sizeInKB}KB`,
      hitRate: `${avgHits} avg hits`
    }
  }

  // 清理过期缓存
  cleanupExpired(): number {
    let cleanedCount = 0
    const now = Date.now()

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.cacheTime) {
        this.cache.delete(key)
        cleanedCount++
      }
    }

    return cleanedCount
  }
}
