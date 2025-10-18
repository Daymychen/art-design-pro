import type { App, Directive, DirectiveBinding } from 'vue'

/**
 * 水波纹指令
 * 用法：
 * <!-- 基础用法 -->
 * <ElButton v-ripple>点击查看水波纹效果</ElButton>
 *
 * <!-- 自定义颜色 -->
 * <ElButton v-ripple="{ color: 'rgba(0, 0, 0, 0.2)' }">
 *   自定义水波纹颜色
 * </ElButton>
 */
export interface RippleOptions {
  color?: string
}

export const vRipple: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 获取指令的配置参数
    const options: RippleOptions = binding.value || {}

    // 设置元素为相对定位，并隐藏溢出部分
    el.style.position = 'relative'
    el.style.overflow = 'hidden'

    // 点击事件处理
    el.addEventListener('mousedown', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const left = e.clientX - rect.left
      const top = e.clientY - rect.top

      // 创建水波纹元素
      const ripple = document.createElement('div')
      const diameter = Math.max(el.clientWidth, el.clientHeight)
      const radius = diameter / 2

      // 根据直径计算动画时间（直径越大，动画时间越长）
      const baseTime = 600 // 基础动画时间（毫秒）
      const scaleFactor = 0.5 // 缩放因子
      const animationDuration = baseTime + diameter * scaleFactor

      // 设置水波纹的尺寸和位置
      ripple.style.width = ripple.style.height = `${diameter}px`
      ripple.style.left = `${left - radius}px`
      ripple.style.top = `${top - radius}px`
      ripple.style.position = 'absolute'
      ripple.style.borderRadius = '50%'
      ripple.style.pointerEvents = 'none'

      // 判断是否为有色按钮（Element Plus 按钮类型）
      const buttonTypes = ['primary', 'info', 'warning', 'danger', 'success'].map(
        (type) => `el-button--${type}`
      )
      const isColoredButton = buttonTypes.some((type) => el.classList.contains(type))
      const defaultColor = isColoredButton
        ? 'rgba(255, 255, 255, 0.35)' // 有色按钮使用白色水波纹
        : 'var(--el-color-primary-light-7)' // 默认按钮使用主题色水波纹

      // 设置水波纹颜色、初始状态和过渡效果
      ripple.style.backgroundColor = options.color || defaultColor
      ripple.style.transform = 'scale(0)'
      ripple.style.transition = `transform ${animationDuration}ms cubic-bezier(0.3, 0, 0.2, 1), opacity ${animationDuration}ms cubic-bezier(0.3, 0, 0.5, 1)`
      ripple.style.zIndex = '1'

      // 添加水波纹元素到DOM中
      el.appendChild(ripple)

      // 触发动画
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(2)'
        ripple.style.opacity = '0'
      })

      // 动画结束后移除水波纹元素
      setTimeout(() => {
        ripple.remove()
      }, animationDuration + 500) // 增加500ms缓冲时间
    })
  }
}

export function setupRippleDirective(app: App) {
  app.directive('ripple', vRipple)
}
