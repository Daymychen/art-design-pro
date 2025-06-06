import { StorageConfig } from '@/utils/storage'

/**
 * 存储键名管理器
 * 负责处理版本化的存储键名生成和数据迁移
 */
export class StorageKeyManager {
  /**
   * 获取当前版本的存储键名
   */
  private getCurrentVersionKey(storeId: string): string {
    return StorageConfig.generateStorageKey(storeId)
  }

  /**
   * 检查当前版本的数据是否存在
   */
  private hasCurrentVersionData(key: string): boolean {
    return localStorage.getItem(key) !== null
  }

  /**
   * 查找其他版本的同名存储键
   */
  private findExistingKey(storeId: string): string | null {
    const storageKeys = Object.keys(localStorage)
    const pattern = StorageConfig.createKeyPattern(storeId)

    return storageKeys.find((key) => pattern.test(key) && localStorage.getItem(key)) || null
  }

  /**
   * 将数据从旧版本迁移到当前版本
   */
  private migrateData(fromKey: string, toKey: string): void {
    try {
      const existingData = localStorage.getItem(fromKey)
      if (existingData) {
        localStorage.setItem(toKey, existingData)
        console.info(`[Storage] 已迁移数据: ${fromKey} → ${toKey}`)
      }
    } catch (error) {
      console.warn(`[Storage] 数据迁移失败: ${fromKey}`, error)
    }
  }

  /**
   * 获取持久化存储的键名（支持自动数据迁移）
   */
  getStorageKey(storeId: string): string {
    const currentKey = this.getCurrentVersionKey(storeId)

    // 优先使用当前版本的数据
    if (this.hasCurrentVersionData(currentKey)) {
      return currentKey
    }

    // 查找并迁移其他版本的数据
    const existingKey = this.findExistingKey(storeId)
    if (existingKey) {
      this.migrateData(existingKey, currentKey)
    }

    return currentKey
  }
}
