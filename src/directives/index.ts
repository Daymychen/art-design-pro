import type { App } from 'vue'
import { setupPermissionDirective } from './permission'
import { setupHighlightDirective } from './highlight'

export function setupGlobDirectives(app: App) {
  setupPermissionDirective(app)
  setupHighlightDirective(app)
}
