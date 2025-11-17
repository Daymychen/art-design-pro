/**
 * Vue JSX 类型声明
 * 为 TSX/JSX 文件提供类型支持
 */

import type { VNode } from 'vue'

// 全局 JSX 命名空间
declare global {
  namespace JSX {
    // 扩展 Vue 的 JSX 类型
    type Element = VNode

    interface ElementClass {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      $props: {}
    }

    interface ElementAttributesProperty {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      $props: {}
    }

    interface IntrinsicElements {
      [elem: string]: any
    }

    interface IntrinsicAttributes {
      key?: string | number | symbol
      ref?: any
    }
  }
}

export {}
