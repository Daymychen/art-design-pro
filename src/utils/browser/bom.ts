/**
 * 浏览器对象模型 (BOM) 相关工具函数
 */

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
