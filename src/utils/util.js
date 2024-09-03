/**
 * 常用JavaScript函数片段
 * author chen tao
 * date 2020-10-6
 */

// 数组
// 数组去重
export function noRepeat(arr) {
  return [...new Set(arr)]
}

// 查找数组最大值
export function arrayMax(arr) {
  return Math.max(...arr)
}

// 查找数组最小值
export function arrayMin(arr) {
  return Math.min(...arr)
}

// 返回已 size 为长度的数组分割的原数组
export function chunk(arr, size = 1) {
  return Array.from(
    {
      length: Math.ceil(arr.length / size)
    },
    (v, i) => arr.slice(i * size, i * size + size)
  )
}

// 检查数组中某元素出现的次数
export function countOccurrences(arr, value) {
  return arr.reduce((a, v) => (v === value ? a + 1 : a + 0), 0)
}

// 扁平化数组
export function flatten(arr, depth = -1) {
  if (depth === -1) {
    return [].concat(...arr.map((v) => (Array.isArray(v) ? this.flatten(v) : v)))
  }
  if (depth === 1) {
    return arr.reduce((a, v) => a.concat(v), [])
  }
  return arr.reduce((a, v) => a.concat(Array.isArray(v) ? this.flatten(v, depth - 1) : v), [])
}

// 返回两个数组中不同的元素
export function diffrence(arrA, arrB) {
  return arrA.concat(arrB).filter(function (v, i, arr) {
    return arr.indexOf(v) === arr.lastIndexOf(v)
  })
}

// 返回两个数组中相同的元素
export function intersection(arr1, arr2) {
  return arr2.filter((v) => arr1.includes(v))
}

// 从右删除 n 个元素
export function dropRight(arr, n = 0) {
  return n < arr.length ? arr.slice(0, arr.length - n) : []
}

// 返回数组中下标间隔 nth 的元素
// 例
// let arr = [1,2,3,4,5,6,7,8,9]
// this.everyNth(arr, 2) 返回[2, 4, 6, 8]
export function everyNth(arr, nth) {
  return arr.filter((v, i) => i % nth === nth - 1)
}

// 返回数组中第 n 个元素（支持负数）
export function nthElement(arr, n = 0) {
  return (n >= 0 ? arr.slice(n, n + 1) : arr.slice(n))[0]
}

// 数组乱排
export function shuffle(arr) {
  let array = arr
  let index = array.length

  while (index) {
    index -= 1
    let randomInedx = Math.floor(Math.random() * index)
    let middleware = array[index]
    array[index] = array[randomInedx]
    array[randomInedx] = middleware
  }

  return array
}

// 浏览器对象BOM

// 当前网页地址
export function currentURL() {
  return window.location.href
}

// 获取滚动条位置
export function getScrollPosition(el = window) {
  return {
    x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
    y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
  }
}

// 获取 url 中的参数
export function getURLParameters(url) {
  return url
    .match(/([^?=&]+)(=([^&]*))/g)
    .reduce((a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a), {})
}

// 页面跳转，是否记录在 history 中
export function redirect(url, asLink = true) {
  if (asLink) {
    window.location.href = url // 使用链接方式跳转
  } else {
    window.location.replace(url) // 使用替换方式跳转
  }
}

// 滚动条回到顶部动画
export function scrollToTop() {
  // 获取当前的滚动位置
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

  // 如果当前滚动位置大于 0，继续滚动
  if (scrollTop > 0) {
    // 计算新的滚动位置
    const newScrollTop = Math.max(scrollTop - scrollTop / 8, 0)

    // 使用 requestAnimationFrame 平滑滚动
    window.requestAnimationFrame(() => {
      window.scrollTo(0, newScrollTop)
      scrollToTop() // 递归调用
    })
  }
}

// 复制文本
export function copy(str) {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  el.style.top = '-9999px'
  document.body.appendChild(el)
  const selected =
    document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  if (selected) {
    document.getSelection().removeAllRanges()
    document.getSelection().addRange(selected)
  }
}

// 检测设备类型
export function detectDeviceType() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'Mobile'
    : 'Desktop'
}

// Cookie
// 增
export function setCookie(key, value, expiredays) {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie =
    key + '=' + escape(value) + (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
}

// 删
export function delCookie(name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

// 查
export function getCookie(name) {
  let arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) {
    return arr[2]
  } else {
    return null
  }
}

// 日期 Date

// 时间戳转换为时间
// 默认为当前时间转换结果
// isMs 为时间戳是否为毫秒
export function timestampToTime(timestamp = Date.parse(new Date()), isMs = true) {
  const date = new Date(timestamp * (isMs ? 1 : 1000))
  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

// 文档对象 DOM

/**
 * 固定滚动条
 * 功能描述：一些业务场景，如弹框出现时，需要禁止页面滚动，
 * 这是兼容安卓和 iOS 禁止页面滚动的解决方案
 */
let scrollTop = 0

export function preventScroll() {
  // 存储当前滚动位置
  scrollTop = window.scrollY

  // 将可滚动区域固定定位，可滚动区域高度为 0 后就不能滚动了
  document.body.style['overflow-y'] = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.top = -scrollTop + 'px'
  // document.body.style['overscroll-behavior'] = 'none'
}

// 恢复滚动
export function recoverScroll() {
  document.body.style['overflow-y'] = 'auto'
  document.body.style.position = 'static'
  // document.querySelector('body').style['overscroll-behavior'] = 'none'

  window.scrollTo(0, scrollTop)
}

// 判断当前位置是否为页面底部
export function bottomVisible() {
  return (
    document.documentElement.clientHeight + window.scrollY >=
    (document.documentElement.scrollHeight || document.documentElement.clientHeight)
  )
}

// 判断元素是否在可视范围内
// partiallyVisible 为是否为完全可见
export function elementIsVisibleInViewport(el, partiallyVisible = false) {
  const { top, left, bottom, right } = el.getBoundingClientRect()

  return partiallyVisible
    ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth
}

// 获取元素 css 样式
export function getStyle(el, ruleName) {
  return getComputedStyle(el, null).getPropertyValue(ruleName)
}

// 进入全屏
// launchFullscreen(document.documentElement);
// launchFullscreen(document.getElementById("id")); //某个元素进入全屏
export function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen()
  }
}

// 退出全屏
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}

// 全屏事件
document.addEventListener('fullscreenchange', function () {
  if (document.fullscreenElement) {
    console.log('进入全屏')
  } else {
    console.log('退出全屏')
  }
})

// 数字 Number
// 数字千分位分割
export function commafy(num) {
  return num.toString().indexOf('.') !== -1
    ? num.toLocaleString()
    : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

// 生成随机数
export function randomNum(min, max) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * min + 1, 10)
    case 2:
      return parseInt(Math.random() * (max - min + 1) + min, 10)
    default:
      return 0
  }
}

/**
 * 去除字符串中的 HTML 标签
 * @param {string} str - 要处理的字符串
 * @returns {string} - 去除 HTML 标签后的字符串
 */
export function removeHtmlTags(str = '') {
  // 使用更简单的正则表达式去除 HTML 标签
  return str.replace(/<\/?[^>]+>/g, '')
}
