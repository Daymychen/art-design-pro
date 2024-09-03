import { router } from '@/router'
import { App, Directive } from 'vue'

const authDirective: Directive = {
  mounted(el, binding) {
    const authList = (router.currentRoute.value.meta.authList as Array<{ auth_mark: string }>) || []

    const hasPermission = authList.some((item) => item.auth_mark === binding.value)

    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  }
}

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective)
}
