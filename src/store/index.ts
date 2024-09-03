import type { App } from 'vue'
import { createPinia } from 'pinia'
export const store = createPinia()

export function initStore(app: App<Element>) {
  app.use(store)
}
