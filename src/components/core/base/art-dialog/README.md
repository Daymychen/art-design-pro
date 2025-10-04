# ArtDialog 弹窗组件

基于 Element Plus Dialog 封装的增强弹窗组件，配合 `useDialog` composable 提供简洁、高效的弹窗管理能力。

## ✨ 核心特性

- 🎯 **自动化处理** - 自动处理表单验证和弹窗关闭
- 🎨 **插槽模式** - 灵活的插槽模式，适配各种使用场景
- 💪 **类型安全** - 完整的 TypeScript 类型支持
- 🚀 **简洁 API** - 极简的 API 设计，易学易用
- ⚡ **轻量高效** - 精简的代码实现，性能优秀

## 📦 快速开始

### 基础用法（推荐）

```vue
<template>
  <div>
    <ElButton @click="handleAdd">新增用户</ElButton>

    <!-- 弹窗组件 -->
    <UserDialog :dialog-instance="userDialog" />
  </div>
</template>

<script setup lang="ts">
  import { useDialog } from '@/composables/useDialog'
  import UserDialog from './modules/user-dialog.vue'

  const userDialog = useDialog()

  // 打开弹窗 - 简洁！
  const handleAdd = () => {
    userDialog.open({
      title: '新增用户',
      width: '50%',
      props: { record: {} },
      onSubmit: async (formData) => {
        // 表单验证已通过，formData 是验证后的数据
        await createUser(formData)
        ElMessage.success('添加成功')
        await refreshData()
        // 弹窗会自动关闭 ✅
      }
    })
  }
</script>
```

### 表单弹窗组件（UserDialog.vue）

```vue
<template>
  <ArtDialog :dialog-instance="dialogInstance" @confirm-click="handleConfirmClick">
    <ArtForm ref="formRef" v-model="formData" :items="formItems" :rules="rules" />
  </ArtDialog>
</template>

<script setup lang="ts">
  import type { useDialog } from '@/composables/useDialog'

  interface Props {
    dialogInstance: ReturnType<typeof useDialog>
  }

  const props = defineProps<Props>()

  // 从 dialogInstance 中获取 record
  const record = computed(() => props.dialogInstance.dialogConfig.value.props?.record || {})

  const formRef = ref()
  const formData = ref({ username: '', email: '' })

  // 监听 record 变化，初始化表单数据
  watch(
    () => record.value,
    () => {
      formData.value = {
        username: record.value.username || '',
        email: record.value.email || ''
      }
    },
    { immediate: true, deep: true }
  )

  // 处理确认按钮点击
  const handleConfirmClick = async () => {
    // 1. 验证表单
    await formRef.value?.validate()

    // 2. 调用 confirm 执行 onSubmit
    await props.dialogInstance.confirm(formData.value)
  }
</script>
```

## 🎯 核心概念

### 数据流

```
用户点击"确定"按钮
    ↓
触发 @confirm-click 事件
    ↓
handleConfirmClick 验证表单
    ↓
调用 dialogInstance.confirm(formData)
    ↓
执行 onSubmit 回调（业务逻辑）
    ↓
成功后自动关闭弹窗 ✅
```

### useDialog 实例

`useDialog` 返回一个弹窗实例，包含以下核心属性和方法：

```typescript
const dialog = useDialog()

// 状态
dialog.visible // 弹窗可见性
dialog.loading // 加载状态（提交时自动变为 true）
dialog.dialogConfig // 弹窗配置对象
dialog.canConfirm // 是否可以确认（computed）

// 核心方法
dialog.open(options) // 打开弹窗
dialog.close() // 关闭弹窗
dialog.confirm(data) // 确认操作（执行 onSubmit 并自动关闭）
dialog.cancel() // 取消操作

// 辅助方法
dialog.setVisible(value) // 设置可见性

// 生命周期
dialog.handleOpened() // 打开后回调
dialog.handleClosed() // 关闭后回调
```

## 📖 API 文档

### DialogOptions 配置项

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| **自定义属性** |  |  |  |
| `showFooter` | `boolean` | `true` | 是否显示底部按钮 |
| `confirmText` | `string` | `'确定'` | 确认按钮文本 |
| `cancelText` | `string` | `'取消'` | 取消按钮文本 |
| `props` | `Record<string, any>` | `{}` | 传递给内容组件的 props |
| `onSubmit` | `(data?: T) => void \| Promise<void>` | - | 提交回调（表单验证通过后调用） |
| `onCancel` | `() => void \| Promise<void>` | - | 取消回调 |
| `onOpened` | `() => void` | - | 打开后回调（用于 DOM 操作） |
| `onClosed` | `() => void` | - | 关闭后回调（用于清理资源） |
| `disableConfirm` | `boolean` | `false` | 是否禁用确认按钮 |
| **ElDialog 原生属性** |  |  |  |
| `title` | `string` | `'弹窗'` | 弹窗标题 |
| `width` | `string \| number` | `'600px'` | 弹窗宽度 |
| `alignCenter` | `boolean` | `true` | 是否水平居中 |
| `draggable` | `boolean` | `false` | 是否可拖拽 |
| `closeOnClickModal` | `boolean` | `false` | 点击遮罩是否关闭 |
| `closeOnPressEscape` | `boolean` | `true` | 按 ESC 是否关闭 |
| `destroyOnClose` | `boolean` | `false` | 关闭时是否销毁内容 |
| `beforeClose` | `(done: () => void) => void` | - | 关闭前的回调 |
| ... |  |  | 支持所有 ElDialog 原生属性 |

## 💡 使用场景

### 场景 1：表单弹窗（最常用）

```typescript
// 新增
const handleAdd = () => {
  userDialog.open({
    title: '新增用户',
    props: { record: {} },
    onSubmit: async (formData: any) => {
      await createUser(formData)
      ElMessage.success('添加成功')
      await refreshData()
    }
  })
}

// 编辑
const handleEdit = (row: User) => {
  userDialog.open({
    title: '编辑用户',
    props: { record: row },
    onSubmit: async (formData: any) => {
      await updateUser(row.id, formData)
      ElMessage.success('更新成功')
      await refreshData()
    }
  })
}
```

### 场景 2：自定义 Footer

```vue
<ArtDialog :dialog-instance="dialogInstance" @confirm-click="handleConfirmClick">
  <template #default>
    <!-- 弹窗内容 -->
  </template>
  
  <template #footer="{ confirm, cancel, loading }">
    <ElButton @click="cancel" :disabled="loading">取消</ElButton>
    <ElButton type="primary" @click="confirm" :loading="loading">
      保存并继续
    </ElButton>
    <ElButton type="success" @click="handleSaveAndClose">
      保存并关闭
    </ElButton>
  </template>
</ArtDialog>
```

### 场景 3：生命周期钩子

```typescript
const handleAudit = () => {
  userDialog.open({
    title: '审核用户',
    width: '800px',
    props: { userId: 123 },
    onOpened: () => {
      // 打开后自动聚焦第一个输入框
      nextTick(() => {
        document.querySelector('input')?.focus()
      })
    },
    onClosed: () => {
      // 关闭后清理资源
      console.log('弹窗已关闭')
    },
    onSubmit: async (formData) => {
      await auditUser(formData)
      ElMessage.success('审核成功')
      await refreshData()
    }
  })
}
```

### 场景 4：禁用确认按钮

```typescript
const handleEdit = (row: User) => {
  userDialog.open({
    title: '编辑用户',
    props: { record: row },
    disableConfirm: true, // 禁用确认按钮
    onSubmit: async (formData) => {
      await updateUser(row.id, formData)
      ElMessage.success('更新成功')
    }
  })
}

// 可以动态控制禁用状态
userDialog.dialogConfig.value.disableConfirm = false
```

### 场景 5：错误处理

```typescript
const handleAdd = () => {
  userDialog.open({
    title: '新增用户',
    props: { record: {} },
    onSubmit: async (formData) => {
      try {
        await createUser(formData)
        ElMessage.success('添加成功')
        await refreshData()
      } catch (error) {
        // 自定义错误处理
        ElMessage.error('添加失败: ' + error.message)
        throw error // 抛出错误以阻止弹窗关闭
      }
    }
  })
}
```

## 🔧 高级用法

### 多个弹窗管理

```typescript
// 创建多个独立的弹窗实例
const userDialog = useDialog()
const roleDialog = useDialog()
const permissionDialog = useDialog()

// 可以同时打开多个弹窗
const handleEditUserRole = (user: User) => {
  userDialog.open({
    title: '编辑用户',
    props: { user },
    onSubmit: async (formData) => {
      await updateUser(formData)
      ElMessage.success('用户更新成功')
    }
  })

  roleDialog.open({
    title: '分配角色',
    props: { userId: user.id },
    onSubmit: async (formData) => {
      await assignRoles(formData)
      ElMessage.success('角色分配成功')
    }
  })
}
```

### 插槽模式（简单弹窗）

```vue
<template>
  <ArtDialog :dialog-instance="dialogInstance" @confirm-click="handleConfirmClick">
    <template #default="{ props }">
      <ElForm :model="formData">
        <ElFormItem label="用户名">
          <ElInput v-model="formData.username" />
        </ElFormItem>
        <ElFormItem label="邮箱">
          <ElInput v-model="formData.email" />
        </ElFormItem>
      </ElForm>
    </template>
  </ArtDialog>
</template>

<script setup lang="ts">
  const dialogInstance = defineProps<{
    dialogInstance: ReturnType<typeof useDialog>
  }>()

  const formData = ref({ username: '', email: '' })

  const handleConfirmClick = async () => {
    await dialogInstance.confirm(formData.value)
  }
</script>
```

## 📝 最佳实践

### 1. 表单组件结构

```vue
<template>
  <ArtDialog :dialog-instance="dialogInstance" @confirm-click="handleConfirmClick">
    <ArtForm ref="formRef" v-model="formData" :items="formItems" :rules="rules" />
  </ArtDialog>
</template>

<script setup lang="ts">
  // ✅ 使用 ReturnType 获取类型
  interface Props {
    dialogInstance: ReturnType<typeof useDialog>
  }

  const props = defineProps<Props>()

  // ✅ 从 dialogInstance 中获取数据
  const record = computed(() => props.dialogInstance.dialogConfig.value.props?.record || {})

  const formRef = ref()
  const formData = ref({})

  // ✅ 处理确认按钮点击
  const handleConfirmClick = async () => {
    await formRef.value?.validate()
    await props.dialogInstance.confirm(formData.value)
  }

  // ✅ 监听 record 变化初始化表单
  watch(
    () => record.value,
    () => {
      formData.value = { ...record.value }
    },
    { immediate: true, deep: true }
  )
</script>
```

### 2. 错误处理

```typescript
// ✅ 推荐：在 onSubmit 中处理错误
const handleAdd = () => {
  userDialog.open({
    title: '新增用户',
    props: { record: {} },
    onSubmit: async (formData) => {
      try {
        await createUser(formData)
        ElMessage.success('添加成功')
        await refreshData()
      } catch (error) {
        ElMessage.error('添加失败：' + error.message)
        throw error // 抛出错误以阻止弹窗关闭
      }
    }
  })
}

// ✅ 也可以不捕获，让错误自然向上抛
const handleAdd = () => {
  userDialog.open({
    title: '新增用户',
    props: { record: {} },
    onSubmit: async (formData) => {
      // 如果出错，onSubmit 会抛出异常
      // confirm 方法会捕获异常并阻止弹窗关闭
      await createUser(formData)
      ElMessage.success('添加成功')
      await refreshData()
    }
  })
}
```

### 3. 弹窗配置复用

```typescript
// ✅ 提取通用配置
const commonDialogConfig = {
  width: '50%',
  alignCenter: true,
  closeOnClickModal: false
}

const handleAdd = () => {
  userDialog.open({
    ...commonDialogConfig,
    title: '新增用户',
    props: { record: {} },
    onSubmit: async (formData) => {
      await createUser(formData)
      ElMessage.success('添加成功')
      await refreshData()
    }
  })
}

const handleEdit = (row: User) => {
  userDialog.open({
    ...commonDialogConfig,
    title: '编辑用户',
    props: { record: row },
    onSubmit: async (formData) => {
      await updateUser(row.id, formData)
      ElMessage.success('更新成功')
      await refreshData()
    }
  })
}
```

### 4. TypeScript 类型支持

```typescript
// ✅ 使用泛型指定数据类型
interface UserFormData {
  username: string
  email: string
  role: string[]
}

const userDialog = useDialog<UserFormData>()

// 在 open 时 onSubmit 参数会有类型提示
userDialog.open({
  title: '新增用户',
  props: { record: {} },
  onSubmit: async (formData: UserFormData) => {
    // formData 有完整的类型提示
    await createUser(formData)
    ElMessage.success('添加成功')
  }
})
```

## ⚠️ 注意事项

1. **弹窗自动关闭** - `onSubmit` 执行成功后会自动关闭弹窗，无需手动调用 `close()`
2. **错误处理** - 如果 `onSubmit` 抛出错误，弹窗会保持打开状态，用户可以修改后重试
3. **表单验证** - 在子组件的 `@confirm-click` 处理函数中进行表单验证
4. **数据传递** - 使用 `dialogConfig.value.props` 在父子组件间传递数据

## 🆚 对比

### 传统方式 vs ArtDialog

```typescript
// ❌ 传统方式：需要手动管理状态
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const formRef = ref()
const formData = ref({})

const handleAdd = () => {
  dialogVisible.value = true
  formData.value = {}
}

const handleConfirm = async () => {
  try {
    await formRef.value?.validate()
    dialogLoading.value = true
    await createUser(formData.value)
    ElMessage.success('添加成功')
    await refreshData()
    dialogVisible.value = false // 手动关闭
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    dialogLoading.value = false
  }
}
```

```typescript
// ✅ ArtDialog：自动化、简洁
const userDialog = useDialog()

const handleAdd = () => {
  userDialog.open({
    title: '新增用户',
    props: { record: {} },
    onSubmit: async (formData) => {
      await createUser(formData)
      ElMessage.success('添加成功')
      await refreshData()
      // 自动关闭、自动处理 loading ✅
    }
  })
}
```

**优势：**

- ✅ 自动管理 `visible` 和 `loading` 状态
- ✅ 自动关闭弹窗（成功后）
- ✅ 自动阻止关闭（出错时）
- ✅ 代码量减少 60%+
- ✅ 更易维护和测试

## 🔗 相关链接

- [Element Plus Dialog](https://element-plus.org/zh-CN/component/dialog.html)
- [ArtForm 表单组件](../forms/art-form/README.md)
- [useTable 表格钩子](../../../composables/useTable.ts)

## 📄 License

MIT
