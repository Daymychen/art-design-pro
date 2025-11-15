/**
 * 存储配置管理模块
 *
 * 提供统一的本地存储配置和工具方法
 *
 * ## 主要功能
 *
 * - 版本化存储键管理，支持多版本数据隔离
 * - 存储键名生成和解析（带版本前缀）
 * - 版本号提取和验证
 * - 存储键匹配的正则表达式生成
 * - 旧版本存储键兼容处理
 * - 升级和登出延迟配置
 * - 主题存储键配置
 *
 * ## 使用场景
 *
 * - Pinia Store 持久化存储
 * - 应用版本升级时的数据迁移
 * - 多版本数据清理
 * - 存储键的统一管理和规范
 *
 * 存储键格式：sys-v{version}-{storeId}
 * 例如：sys-v1.0.0-user, sys-v1.0.0-setting
 *
 * @module utils/storage/storage-config
 * @author Art Design Pro Team
 */
export class StorageConfig {
  /** 当前应用版本 */
  static readonly CURRENT_VERSION = __APP_VERSION__

  /** 存储键前缀 */
  static readonly STORAGE_PREFIX = 'sys-v'

  /** 版本键名 */
  static readonly VERSION_KEY = 'sys-version'

  /** 主题键名（index.html中使用了，如果修改，需要同步修改） */
  static readonly THEME_KEY = 'sys-theme'

  /** 上次登录用户ID键名（用于判断是否为同一用户登录） */
  static readonly LAST_USER_ID_KEY = 'sys-last-user-id'

  /** 跳过升级检查的版本 */
  static readonly SKIP_UPGRADE_VERSION = '1.0.0'

  /** 升级处理延迟时间（毫秒） */
  static readonly UPGRADE_DELAY = 1000

  /** 登出延迟时间（毫秒） */
  static readonly LOGOUT_DELAY = 1000

  /**
   * 生成版本化的存储键名
   * @param storeId 存储ID
   * @param version 版本号，默认使用当前版本
   */
  static generateStorageKey(storeId: string, version: string = this.CURRENT_VERSION): string {
    return `${this.STORAGE_PREFIX}${version}-${storeId}`
  }

  /**
   * 生成旧版本的存储键名（不带分隔符）
   * @param version 版本号，默认使用当前版本
   */
  static generateLegacyKey(version: string = this.CURRENT_VERSION): string {
    return `${this.STORAGE_PREFIX}${version}`
  }

  /**
   * 创建存储键匹配的正则表达式
   * @param storeId 存储ID
   */
  static createKeyPattern(storeId: string): RegExp {
    return new RegExp(`^${this.STORAGE_PREFIX}[^-]+-${storeId}$`)
  }

  /**
   * 创建当前版本存储键匹配的正则表达式
   */
  static createCurrentVersionPattern(): RegExp {
    return new RegExp(`^${this.STORAGE_PREFIX}${this.CURRENT_VERSION}-`)
  }

  /**
   * 创建任意版本存储键匹配的正则表达式
   */
  static createVersionPattern(): RegExp {
    return new RegExp(`^${this.STORAGE_PREFIX}`)
  }

  /**
   * 检查是否为当前版本的键
   */
  static isCurrentVersionKey(key: string): boolean {
    return key.startsWith(`${this.STORAGE_PREFIX}${this.CURRENT_VERSION}`)
  }

  /**
   * 检查是否为版本化的键
   */
  static isVersionedKey(key: string): boolean {
    return key.startsWith(this.STORAGE_PREFIX)
  }

  /**
   * 从存储键中提取版本号
   */
  static extractVersionFromKey(key: string): string | null {
    const match = key.match(new RegExp(`^${this.STORAGE_PREFIX}([^-]+)`))
    return match ? match[1] : null
  }

  /**
   * 从存储键中提取存储ID
   */
  static extractStoreIdFromKey(key: string): string | null {
    const match = key.match(new RegExp(`^${this.STORAGE_PREFIX}[^-]+-(.+)$`))
    return match ? match[1] : null
  }
}
