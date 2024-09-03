// 注册全局组件
import type { App } from 'vue'
import TableBar from './Table/TableBar.vue'
import ArtTable from './Table/ArtTable.vue'
import FormInput from './Form/FormInput.vue'
import FormSelect from './Form/FormSelect.vue'

export function registerGlobComp(app: App) {
  app.component('table-bar', TableBar)
  app.component('art-table', ArtTable)
  app.component('form-input', FormInput)
  app.component('form-select', FormSelect)
}
