// 全屏
export function fullScreen() {
  const el: any = document.documentElement
  const rfs =
    el.requestFullScreen ||
    el.webkitRequestFullScreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullScreen

  if (rfs) {
    rfs.call(el)
  }
}

//退出全屏
export function exitScreen() {
  const el: any = document
  const cfs =
    el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen

  if (cfs) {
    cfs.call(el)
  }
}

// 将hex颜色转成rgb  例如(#F55442, 1)
export function hexToRgba(hex: string, opacity: number) {
  const RGBA =
    'rgba(' +
    parseInt('0x' + hex.slice(1, 3)) +
    ',' +
    parseInt('0x' + hex.slice(3, 5)) +
    ',' +
    parseInt('0x' + hex.slice(5, 7)) +
    ',' +
    opacity +
    ')'
  return {
    red: parseInt('0x' + hex.slice(1, 3)),
    green: parseInt('0x' + hex.slice(3, 5)),
    blue: parseInt('0x' + hex.slice(5, 7)),
    rgba: RGBA
  }
}

// 将rgb颜色转成hex  例如(24,12,255)
export function rgbToHex(r: any, g: any, b: any) {
  const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  return hex
}

// 颜色混合
export function colourBlend(c1: string, c2: string, ratio: any) {
  ratio = Math.max(Math.min(Number(ratio), 1), 0)
  const r1 = parseInt(c1.substring(1, 3), 16)
  const g1 = parseInt(c1.substring(3, 5), 16)
  const b1 = parseInt(c1.substring(5, 7), 16)
  const r2 = parseInt(c2.substring(1, 3), 16)
  const g2 = parseInt(c2.substring(3, 5), 16)
  const b2 = parseInt(c2.substring(5, 7), 16)
  let r: any = Math.round(r1 * (1 - ratio) + r2 * ratio)
  let g: any = Math.round(g1 * (1 - ratio) + g2 * ratio)
  let b: any = Math.round(b1 * (1 - ratio) + b2 * ratio)
  r = ('0' + (r || 0).toString(16)).slice(-2)
  g = ('0' + (g || 0).toString(16)).slice(-2)
  b = ('0' + (b || 0).toString(16)).slice(-2)
  return '#' + r + g + b
}

// 回到顶部
export function scrollToTop() {
  window.scrollTo({ top: 0 })
}
