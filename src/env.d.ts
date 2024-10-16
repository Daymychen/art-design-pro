/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

declare module 'nprogress'

// 环境变量提示
// interface ImportMetaEnv {
//   VITE_BASE_API_URL: string
// }

// 导入 vue-i18n 的类型定义
// import 'vue-i18n';

// declare module 'vue' {
//   interface ComponentCustomProperties {
//     $t: typeof import('vue-i18n').t;
//   }
// }
