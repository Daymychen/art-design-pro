import { router } from '@/router'
import { App, Directive, DirectiveBinding } from 'vue'

/**
 * 权限指令（后端控制模式可用）
 * 用法：
 * <ElButton v-auth="'add'">按钮</ElButton>
 */

interface AuthBinding extends DirectiveBinding {
  value: string
}

function checkAuthPermission(el: HTMLElement, binding: AuthBinding): void {
  // 获取当前路由的权限列表
  const authList = (router.currentRoute.value.meta.authList as Array<{ authMark: string }>) || []

  // 检查是否有对应的权限标识
  const hasPermission = authList.some((item) => item.authMark === binding.value)

  // 如果没有权限，移除元素
  if (!hasPermission) {
    removeElement(el)
  }
}

function removeElement(el: HTMLElement): void {
  if (el.parentNode) {
    el.parentNode.removeChild(el)
  }
}

const authDirective: Directive = {
  mounted: checkAuthPermission,
  updated: checkAuthPermission
}

export function setupAuthDirective(app: App): void {
  app.directive('auth', authDirective)
}
