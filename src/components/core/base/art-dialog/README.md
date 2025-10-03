# ArtDialog - 智能弹窗组件

## 功能特性

### 🎯 自动表单验证

弹窗会自动检测内容组件是否包含表单，并在点击确认按钮时自动触发表单验证。

**工作流程：**

1. 点击确认按钮
2. 自动检测内容组件是否有 `handleSubmit` 方法
3. 如果有，调用该方法进行表单验证
4. 验证通过后，触发 `@submit` 事件
5. 验证失败，阻止弹窗关闭并提示错误

## 使用示例

### 基础用法（带表单）

```vue
<template>
  <div>
    <!-- 1. 使用弹窗组件 -->
    <ArtDialog :dialog-instance="userDialog">
      <UserForm ref="userFormRef" :record="currentData" @submit="handleFormSubmit" />
    </ArtDialog>
  </div>
</template>

<script setup lang="ts">
  import { useDialog } from '@/composables/useDialog'
  import ArtDialog from '@/components/core/base/art-dialog/index.vue'
  import UserForm from './UserForm.vue'

  // 2. 创建弹窗实例
  const userDialog = useDialog()
  const currentData = ref({})

  // 3. 打开弹窗（不需要处理 onConfirm）
  const handleAdd = () => {
    userDialog.open({
      title: '新增用户',
      width: '50%'
      // 表单验证和提交会自动处理
    })
  }

  // 4. 处理表单提交（验证通过后触发）
  const handleFormSubmit = async (formData: any) => {
    console.log('表单数据:', formData)
    await saveUser(formData)
    ElMessage.success('保存成功')
    await refreshData()
  }
</script>
```

### 表单组件示例

```vue
<!-- UserForm.vue -->
<template>
  <ArtForm ref="formRef" v-model="formData" :items="formItems" />
</template>

<script setup lang="ts">
  interface Emits {
    (e: 'submit', data: any): void
  }

  const emit = defineEmits<Emits>()
  const formRef = ref()
  const formData = ref({ username: '', email: '' })

  // 必须暴露 handleSubmit 方法
  const handleSubmit = async () => {
    // 1. 验证表单
    await formRef.value.validate()

    // 2. 验证通过，触发 submit 事件
    emit('submit', formData.value)
  }

  // 暴露给父组件
  defineExpose({
    handleSubmit
  })
</script>
```

## 核心配置

### DialogOptions

```typescript
interface DialogOptions {
  // ElDialog 原生属性
  title?: string
  width?: string
  alignCenter?: boolean
  draggable?: boolean
  closeOnClickModal?: boolean

  // 自定义属性
  showFooter?: boolean // 是否显示底部按钮
  confirmText?: string // 确认按钮文本
  cancelText?: string // 取消按钮文本
  component?: Component // 内容组件
  props?: Record<string, any> // 传递给内容组件的 props

  // 回调（通常不需要手动处理 onConfirm）
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
}
```

## 优势对比

### ❌ 旧的方式（手动处理）

```typescript
const handleAdd = () => {
  userDialog.open({
    title: '新增用户',
    onConfirm: async () => {
      // 需要手动调用表单验证
      await userFormRef.value?.handleSubmit()
    }
  })
}
```

### ✅ 新的方式（自动处理）

```typescript
const handleAdd = () => {
  userDialog.open({
    title: '新增用户'
    // 表单验证自动处理，无需手动调用
  })
}
```

## 注意事项

1. **表单组件约定**：内容组件需要暴露 `handleSubmit` 方法
2. **验证失败处理**：验证失败时会自动显示提示，无需手动处理
3. **提交事件**：使用 `@submit` 事件接收验证通过后的数据
4. **错误处理**：`handleSubmit` 验证失败时应该抛出错误以阻止弹窗关闭
