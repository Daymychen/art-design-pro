/**
 * 全局类型声明
 */

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /** 全局配置 */
    $config: any
  }
}

export {}
