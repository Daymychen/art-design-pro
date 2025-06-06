/**
 * 路由相关工具函数
 */

// 检查是否为 iframe 路由
export function isIframe(url: string): boolean {
  return url.startsWith('/iframe/')
}
