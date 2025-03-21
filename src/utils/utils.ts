/**
 * 常用 JavaScript 函数片段
 * author chen tao
 * date 2020-10-6
 */

/* 数组相关函数 */

// 数组去重
export function noRepeat<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

// 查找数组最大值
export function arrayMax(arr: number[]): number {
  if (!arr.length) throw new Error('Array is empty')
  return Math.max(...arr)
}

// 查找数组最小值
export function arrayMin(arr: number[]): number {
  if (!arr.length) throw new Error('Array is empty')
  return Math.min(...arr)
}

// 数组分割
export function chunk<T>(arr: T[], size: number = 1): T[][] {
  if (size <= 0) return [arr.slice()]
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
}

// 检查元素出现次数
export function countOccurrences<T>(arr: T[], value: T): number {
  return arr.reduce((count, current) => (current === value ? count + 1 : count), 0)
}

// 扁平化数组
export function flatten<T>(arr: any[], depth: number = Infinity): T[] {
  return arr.flat(depth)
}

// 返回两个数组的差集
export function difference<T>(arrA: T[], arrB: T[]): T[] {
  const setB = new Set(arrB)
  return arrA.filter((item) => !setB.has(item))
}

// 返回两个数组的交集
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2)
  return arr1.filter((item) => set2.has(item))
}

// 从右删除 n 个元素
export function dropRight<T>(arr: T[], n: number = 0): T[] {
  return arr.slice(0, Math.max(0, arr.length - n))
}

// 返回间隔 nth 的元素
export function everyNth<T>(arr: T[], nth: number): T[] {
  if (nth <= 0) return []
  return arr.filter((_, i) => i % nth === nth - 1)
}

// 返回第 n 个元素
export function nthElement<T>(arr: T[], n: number = 0): T | undefined {
  const index = n >= 0 ? n : arr.length + n
  return arr[index]
}

// 数组乱序
export function shuffle<T>(arr: T[]): T[] {
  const array = [...arr] // 创建新数组避免修改原数组
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/* 浏览器对象 BOM */

// 当前网页地址
export function currentURL(): string {
  return window.location.href
}

// 获取滚动条位置
export function getScrollPosition(el: HTMLElement | Window = window): { x: number; y: number } {
  return el === window
    ? {
        x: window.scrollX || document.documentElement.scrollLeft,
        y: window.scrollY || document.documentElement.scrollTop
      }
    : {
        x: (el as HTMLElement).scrollLeft,
        y: (el as HTMLElement).scrollTop
      }
}

// 获取 URL 参数
export function getURLParameters(url: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(url.split('?')[1]).entries())
}

// 复制文本
export function copy(str: string): boolean {
  try {
    navigator.clipboard.writeText(str)
    return true
  } catch (err) {
    console.error('Copy failed:', err)
    return false
  }
}

// 检测设备类型
export function detectDeviceType(): 'Mobile' | 'Desktop' {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'Mobile'
    : 'Desktop'
}

/* Cookie 操作 */

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

/* 日期相关 */

// 时间戳转时间
export function timestampToTime(timestamp: number = Date.now(), isMs: boolean = true): string {
  const date = new Date(isMs ? timestamp : timestamp * 1000)
  return date.toISOString().replace('T', ' ').slice(0, 19)
}

/* DOM 操作 */

let scrollTop = 0

export function preventScroll(): void {
  scrollTop = window.scrollY
  Object.assign(document.body.style, {
    position: 'fixed',
    width: '100%',
    top: `-${scrollTop}px`,
    overflowY: 'hidden'
  })
}

export function recoverScroll(): void {
  Object.assign(document.body.style, {
    position: '',
    width: '',
    top: '',
    overflowY: ''
  })
  window.scrollTo(0, scrollTop)
}

// 判断是否到达页面底部
export function bottomVisible(): boolean {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
}

// 判断元素是否在可视区域
export function elementIsVisibleInViewport(
  el: HTMLElement,
  partiallyVisible: boolean = false
): boolean {
  const { top, left, bottom, right } = el.getBoundingClientRect()
  const { innerHeight, innerWidth } = window

  return partiallyVisible
    ? top + el.offsetHeight > 0 &&
        top < innerHeight &&
        left + el.offsetWidth > 0 &&
        left < innerWidth
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth
}

// 获取元素样式
export function getStyle(el: HTMLElement, ruleName: string): string {
  return window.getComputedStyle(el)[ruleName as any]
}

/* 数字操作 */

export function commafy(num: number): string {
  return num.toLocaleString('en-US')
}

export function randomNum(min: number, max?: number): number {
  if (max === undefined) return Math.floor(Math.random() * min)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/* 字符串操作 */

export function removeHtmlTags(str: string = ''): string {
  return str.replace(/<[^>]*>/g, '')
}

// 判断是不是iframe
export function isIframe(url: string) {
  return url.includes('/outside/iframe')
}
