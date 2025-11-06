import { useSettingStore } from '@/store/modules/setting'
import { Router } from 'vue-router'
import NProgress from 'nprogress'
import { usePageControl } from '@/composables/usePageControl'

/** 路由全局后置守卫 */
export function setupAfterEachGuard(router: Router) {
  const { scrollToTop } = usePageControl()

  router.afterEach(() => {
    scrollToTop()
    if (useSettingStore().showNprogress) NProgress.done()
  })
}
