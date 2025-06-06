/**
 * Cookie 操作相关工具函数
 */

// 设置 Cookie
export function setCookie(key: string, value: string, expireDays: number): void {
  const date = new Date()
  date.setDate(date.getDate() + expireDays)
  document.cookie = `${key}=${encodeURIComponent(value)}${
    expireDays ? `;expires=${date.toUTCString()}` : ''
  }`
}

// 删除 Cookie
export function delCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

// 获取 Cookie
export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}
