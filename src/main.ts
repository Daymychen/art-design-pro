import App from './App.vue'
import { createApp } from 'vue'
import { initStore } from './store'                 // Store
import { initRouter } from './router'               // Router
import language from './locales'                    // 国际化
import '@styles/core/tailwind.css'                  // tailwind
import '@styles/index.scss'                         // 样式
import '@utils/sys/console.ts'                      // 控制台输出内容
import { setupGlobDirectives } from './directives'
import { setupErrorHandle } from './utils/sys/error-handle'
import { getSystemConfig } from '@/utils/config/config-loader'

document.addEventListener(
  'touchstart',
  function () { },
  { passive: false }
)

/**
 * 初始化应用
 */
async function bootstrap() {
  const app = createApp(App)

  // 加载系统配置并注入到全局
  await getSystemConfig(app)

  initStore(app)
  initRouter(app)
  setupGlobDirectives(app)
  setupErrorHandle(app)
  app.use(language)

  app.mount('#app')
}

// 启动应用
bootstrap()