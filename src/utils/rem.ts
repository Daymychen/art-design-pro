;(function (doc, win) {
  const docEl = doc.documentElement
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'

  const setFontSize = function () {
    const clientWidth = docEl.clientWidth
    if (!clientWidth) {
      return
    }
    docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px'
  }

  if (!doc.addEventListener) {
    return
  }
  win.addEventListener(resizeEvt, setFontSize, false)
  doc.addEventListener('DOMContentLoaded', setFontSize, false)

  setFontSize()
})(document, window)
