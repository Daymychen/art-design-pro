# TSX 快速入门指南

本文档介绍如何在 Vue 3 + TypeScript 项目中使用 TSX 语法编写组件。

## 📦 已配置的依赖

项目已经配置好以下依赖，无需额外安装：

- `@vitejs/plugin-vue-jsx` - Vite 的 Vue JSX 插件
- `@vitejs/plugin-vue` - Vite 的 Vue 插件
- TypeScript 5.6+

## 🔧 配置说明

项目已完成以下配置：

### 1. Vite 配置 (`vite.config.ts`)

```typescript
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx() // 添加 JSX 插件
    // ...其他插件
  ]
})
```

### 2. TypeScript 配置 (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...其他配置
  },
  "include": ["src/**/*.tsx", "src/**/*.ts", "src/**/*.vue"]
}
```

### 3. JSX 类型声明 (`src/types/jsx.d.ts`)

已添加全局 JSX 类型声明，解决 TypeScript 的 JSX 类型检查问题。这样在 `.tsx` 文件中使用 JSX 语法时不会出现类型错误。

## 🚀 快速开始

### 1. 创建 TSX 组件文件

创建一个 `.tsx` 文件，例如 `MyComponent.tsx`：

```tsx
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MyComponent',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup(props, { slots }) {
    const count = ref(0)

    const increment = () => {
      count.value++
    }

    return () => (
      <div class="my-component">
        <h2>{props.title}</h2>
        <button onClick={increment}>点击次数: {count.value}</button>
        {slots.default?.()}
      </div>
    )
  }
})
```

### 2. 在 Vue 文件中使用 TSX 组件

```vue
<template>
  <div>
    <MyComponent title="Hello TSX">
      <p>这是插槽内容</p>
    </MyComponent>
  </div>
</template>

<script setup lang="ts">
  import MyComponent from './MyComponent'
</script>
```

## 📝 TSX 语法要点

### Props 类型定义

使用 `PropType` 为 props 提供类型安全：

```tsx
import { defineComponent, type PropType } from 'vue'

interface ButtonProps {
  type: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
}

export default defineComponent({
  props: {
    type: {
      type: String as PropType<ButtonProps['type']>,
      default: 'primary'
    },
    size: {
      type: String as PropType<ButtonProps['size']>,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
```

### 响应式数据

使用 `ref`、`reactive`、`computed` 等 API：

```tsx
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    return () => (
      <div>
        <p>Count: {count.value}</p>
        <p>Doubled: {doubled.value}</p>
      </div>
    )
  }
})
```

### 事件处理

在 TSX 中使用驼峰命名的事件处理器：

```tsx
export default defineComponent({
  setup() {
    const handleClick = (e: MouseEvent) => {
      console.log('Clicked!', e)
    }

    const handleInput = (e: Event) => {
      const value = (e.target as HTMLInputElement).value
      console.log(value)
    }

    return () => (
      <div>
        <button onClick={handleClick}>Click me</button>
        <input onInput={handleInput} />
      </div>
    )
  }
})
```

### 条件渲染

使用 JavaScript 的条件表达式：

```tsx
export default defineComponent({
  setup() {
    const show = ref(true)
    const type = ref<'success' | 'error'>('success')

    return () => (
      <div>
        {/* && 运算符 */}
        {show.value && <p>显示的内容</p>}

        {/* 三元运算符 */}
        {type.value === 'success' ? <p class="success">成功</p> : <p class="error">错误</p>}

        {/* 立即执行函数 */}
        {(() => {
          if (show.value) {
            return <div>复杂条件</div>
          }
          return null
        })()}
      </div>
    )
  }
})
```

### 列表渲染

使用 `map` 方法：

```tsx
export default defineComponent({
  setup() {
    const items = ref([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ])

    return () => (
      <ul>
        {items.value.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    )
  }
})
```

### 插槽（Slots）

通过 `setup` 的第二个参数访问插槽：

```tsx
export default defineComponent({
  setup(props, { slots }) {
    return () => (
      <div class="wrapper">
        {/* 默认插槽 */}
        {slots.default?.()}

        {/* 具名插槽 */}
        <div class="header">{slots.header?.()}</div>
        <div class="footer">{slots.footer?.()}</div>

        {/* 作用域插槽 */}
        {slots.item?.({ data: 'some data' })}
      </div>
    )
  }
})
```

### 样式绑定

#### 行内样式

```tsx
import { defineComponent, computed, type CSSProperties } from 'vue'

export default defineComponent({
  setup() {
    const color = ref('#409EFF')

    const style = computed<CSSProperties>(() => ({
      color: color.value,
      fontSize: '16px',
      fontWeight: 'bold'
    }))

    return () => <div style={style.value}>Styled content</div>
  }
})
```

#### Class 绑定

```tsx
export default defineComponent({
  setup() {
    const isActive = ref(true)
    const hasError = ref(false)

    return () => (
      <div>
        {/* 字符串 */}
        <div class="static-class">Content</div>

        {/* 数组 */}
        <div class={['base-class', isActive.value && 'active']}>Content</div>

        {/* 对象（需要辅助函数） */}
        <div
          class={{
            active: isActive.value,
            error: hasError.value
          }}
        >
          Content
        </div>
      </div>
    )
  }
})
```

### v-model 的 TSX 写法

```tsx
export default defineComponent({
  setup() {
    const inputValue = ref('')

    return () => (
      <input
        value={inputValue.value}
        onInput={(e: Event) => {
          inputValue.value = (e.target as HTMLInputElement).value
        }}
      />
    )
  }
})
```

### 使用 Element Plus 组件

```tsx
export default defineComponent({
  setup() {
    const value = ref('')

    return () => (
      <div>
        <el-button type="primary" onClick={() => console.log('clicked')}>
          按钮
        </el-button>

        <el-input v-model={value.value} placeholder="请输入内容" />
      </div>
    )
  }
})
```

## 🎨 最佳实践

### 1. 组件命名

- TSX 文件使用 PascalCase 命名：`MyComponent.tsx`
- 组件 name 属性与文件名保持一致

### 2. 类型定义

- 为 Props 定义接口或类型
- 使用 `PropType` 进行类型断言
- 为事件处理器添加类型注解

### 3. 性能优化

```tsx
import { defineComponent, ref, memo } from 'vue'

// 使用 memo 优化性能
const MemoComponent = memo(
  defineComponent({
    props: {
      value: Number
    },
    setup(props) {
      return () => <div>{props.value}</div>
    }
  })
)
```

### 4. 代码组织

```tsx
import { defineComponent, ref, computed } from 'vue'
import type { PropType, CSSProperties } from 'vue'

// 1. 类型定义
interface MyComponentProps {
  title: string
  type?: 'primary' | 'success'
}

// 2. 组件定义
export default defineComponent({
  name: 'MyComponent',

  // 3. Props
  props: {
    title: {
      type: String as PropType<MyComponentProps['title']>,
      required: true
    },
    type: {
      type: String as PropType<MyComponentProps['type']>,
      default: 'primary'
    }
  },

  // 4. Setup
  setup(props, { slots, emit }) {
    // 5. 响应式数据
    const count = ref(0)

    // 6. 计算属性
    const displayValue = computed(() => count.value * 2)

    // 7. 方法
    const increment = () => {
      count.value++
      emit('update', count.value)
    }

    // 8. 生命周期
    onMounted(() => {
      console.log('mounted')
    })

    // 9. 渲染函数
    return () => (
      <div class="my-component">
        <h2>{props.title}</h2>
        <button onClick={increment}>{displayValue.value}</button>
        {slots.default?.()}
      </div>
    )
  }
})
```

## 📚 示例组件

项目中提供了以下 TSX 示例组件：

- `src/components/custom/tsx-example/TsxButton.tsx` - 按钮组件
- `src/components/custom/tsx-example/TsxCard.tsx` - 卡片组件
- `src/views/examples/tsx-demo/index.vue` - 演示页面

## 🔗 参考资源

- [Vue 3 官方文档 - 渲染函数 & JSX](https://cn.vuejs.org/guide/extras/render-function.html)
- [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
- [TypeScript 官方文档](https://www.typescriptlang.org/)

## ❓ 常见问题

### Q: 什么时候使用 TSX？

A: TSX 适合以下场景：

- 需要大量条件渲染和动态组件
- 复杂的数据驱动 UI
- 需要更好的类型推导
- 偏好 JavaScript 语法而非模板语法

### Q: TSX 和 SFC（.vue）可以混用吗？

A: 可以！项目完全支持 TSX 和 SFC 混用。根据具体场景选择最合适的方式。

### Q: 如何在 TSX 中使用自定义指令？

A: 使用 `withDirectives`：

```tsx
import { defineComponent, withDirectives, resolveDirective } from 'vue'

export default defineComponent({
  setup() {
    return () => {
      const myDirective = resolveDirective('my-directive')!

      return withDirectives(<div>Content</div>, [[myDirective, 'directive-value']])
    }
  }
})
```

### Q: 如何在 TSX 中使用 ref？

A: 使用字符串 ref 或 ref 函数：

```tsx
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const inputRef = ref<HTMLInputElement>()

    const focus = () => {
      inputRef.value?.focus()
    }

    return () => (
      <div>
        <input ref={inputRef} />
        <button onClick={focus}>Focus Input</button>
      </div>
    )
  }
})
```

## 🎯 下一步

- 查看示例组件了解更多用法
- 尝试将现有组件改写为 TSX 格式
- 在新功能开发中尝试使用 TSX

Happy Coding! 🚀
