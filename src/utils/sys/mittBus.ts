/**
 * 全局事件总线模块
 *
 * 基于 mitt 库实现的类型安全的事件总线
 *
 * ## 主要功能
 *
 * - 跨组件通信（发布/订阅模式）
 * - 类型安全的事件定义和调用
 * - 全局事件管理（烟花效果、设置面板、搜索对话框等）
 * - 解耦组件间的直接依赖
 *
 * ## 使用场景
 *
 * - 跨层级组件通信
 * - 全局功能触发（设置、搜索、聊天、锁屏等）
 * - 特效触发（烟花效果）
 * - 避免 props 层层传递
 *
 * ## 用法示例
 *
 * ```typescript
 * // 订阅事件
 * mittBus.on('openSetting', () => { ... })
 *
 * // 发布事件
 * mittBus.emit('openSetting')
 *
 * // 带参数的事件
 * mittBus.emit('triggerFireworks', 'image-url')
 * ```
 *
 * ## 已定义的事件
 *
 * - triggerFireworks: 触发烟花效果（可选图片URL）
 * - openSetting: 打开设置面板
 * - openSearchDialog: 打开搜索对话框
 * - openChat: 打开聊天窗口
 * - openLockScreen: 打开锁屏
 *
 * @module utils/sys/mittBus
 * @author Art Design Pro Team
 */
import mitt, { type Emitter } from 'mitt'

// 定义事件类型映射
type Events = {
  // 烟花效果事件 - 可选的图片URL参数
  triggerFireworks: string | undefined
  // 打开设置面板事件 - 无参数
  openSetting: void
  // 打开搜索对话框事件 - 无参数
  openSearchDialog: void
  // 打开聊天窗口事件 - 无参数
  openChat: void
  // 打开锁屏事件 - 无参数
  openLockScreen: void
}

// 创建类型安全的事件总线实例
const mittBus: Emitter<Events> = mitt<Events>()

export default mittBus
