/**
 * Pinia Store 配置模块
 *
 * 提供全局状态管理的初始化和配置
 *
 * ## 主要功能
 *
 * - Pinia Store 实例创建
 * - 持久化插件配置（pinia-plugin-persistedstate）
 * - 版本化存储键管理
 * - 自动数据迁移（跨版本）
 * - LocalStorage 序列化配置
 * - Store 初始化函数
 *
 * ## 持久化策略
 *
 * - 使用 StorageKeyManager 生成版本化的存储键
 * - 格式：sys-v{version}-{storeId}
 * - 自动迁移旧版本数据到当前版本
 * - 使用 localStorage 作为存储介质
 *
 * @module store/index
 * @author Art Design Pro Team
 */
import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { StorageKeyManager } from '@/utils/storage/storage-key-manager'

export const store = createPinia()

// 创建存储键管理器实例
const storageKeyManager = new StorageKeyManager()

// 配置持久化插件
store.use(
  createPersistedState({
    key: (storeId: string) => storageKeyManager.getStorageKey(storeId),
    storage: localStorage,
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  })
)

/**
 * 初始化 Store
 */
export function initStore(app: App<Element>): void {
  app.use(store)
}
