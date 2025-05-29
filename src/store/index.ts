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
