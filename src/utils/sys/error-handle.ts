/**
 * 全局错误处理模块
 *
 * 提供统一的错误捕获和处理机制
 *
 * ## 主要功能
 *
 * - Vue 运行时错误捕获（组件错误、生命周期错误等）
 * - 全局脚本错误捕获（语法错误、运行时错误等）
 * - Promise 未捕获错误处理（unhandledrejection）
 * - 静态资源加载错误监控（图片、脚本、样式等）
 * - 错误日志记录和上报
 * - 统一的错误处理入口
 *
 * ## 使用场景
 * - 应用启动时安装全局错误处理器
 * - 捕获和记录所有类型的错误
 * - 错误上报到监控平台
 * - 提升应用稳定性和可维护性
 * - 问题排查和调试
 *
 * ## 错误类型
 *
 * - VueError: Vue 组件相关错误
 * - ScriptError: JavaScript 脚本错误
 * - PromiseError: Promise 未捕获的 rejection
 * - ResourceError: 静态资源加载失败
 *
 * @module utils/sys/error-handle
 * @author Art Design Pro Team
 */
import type { App } from 'vue'

/**
 * Vue 运行时错误处理
 */
export function vueErrorHandler(err: unknown, instance: any, info: string) {
  console.error('[VueError]', err, info, instance)
  // 这里可以上报到服务端，比如：
  // reportError({ type: 'vue', err, info })
}

/**
 * 全局脚本错误处理
 */
export function scriptErrorHandler(
  message: Event | string,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
): boolean {
  console.error('[ScriptError]', { message, source, lineno, colno, error })
  // reportError({ type: 'script', message, source, lineno, colno, error })
  return true // 阻止默认控制台报错，可根据需求改
}

/**
 * Promise 未捕获错误处理
 */
export function registerPromiseErrorHandler() {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[PromiseError]', event.reason)
    // reportError({ type: 'promise', reason: event.reason })
  })
}

/**
 * 资源加载错误处理 (img, script, css...)
 */
export function registerResourceErrorHandler() {
  window.addEventListener(
    'error',
    (event: Event) => {
      const target = event.target as HTMLElement
      if (
        target &&
        (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')
      ) {
        console.error('[ResourceError]', {
          tagName: target.tagName,
          src:
            (target as HTMLImageElement).src ||
            (target as HTMLScriptElement).src ||
            (target as HTMLLinkElement).href
        })
        // reportError({ type: 'resource', target })
      }
    },
    true // 捕获阶段才能监听到资源错误
  )
}

/**
 * 安装统一错误处理
 */
export function setupErrorHandle(app: App) {
  app.config.errorHandler = vueErrorHandler
  window.onerror = scriptErrorHandler
  registerPromiseErrorHandler()
  registerResourceErrorHandler()
}
