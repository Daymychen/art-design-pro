/**
 * 全局事件总线，用于全局事件的发布与订阅
 * 用法：
 * mittBus.on('event', callback)
 * mittBus.emit('event', data)
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
