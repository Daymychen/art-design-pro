# ArtForm 组件完整功能文档

一个基于 Element Plus 的强大表单组件，支持配置化开发、动态表单、表单验证、插槽扩展等功能。

---

## 📖 目录

- [快速开始](#快速开始)
- [基础功能](#基础功能)
  - [1. 支持的组件类型](#1-支持的组件类型)
  - [2. 双向绑定（v-model）](#2-双向绑定v-model)
  - [3. Options 配置](#3-options-配置)
- [表单验证](#表单验证)
  - [1. 快捷必填配置](#1-快捷必填配置)
  - [2. 详细验证规则](#2-详细验证规则)
  - [3. 表单方法](#3-表单方法)
- [布局配置](#布局配置)
  - [1. 响应式栅格布局](#1-响应式栅格布局)
  - [2. 单项自定义宽度](#2-单项自定义宽度)
  - [3. 响应式断点](#3-响应式断点)
  - [4. 标签配置](#4-标签配置)
  - [5. 间距配置](#5-间距配置)
- [高级功能](#高级功能)
  - [1. 插槽扩展](#1-插槽扩展)
  - [2. 自定义组件支持](#2-自定义组件支持)
  - [3. 禁用状态支持](#3-禁用状态支持)
  - [4. Placeholder 自动处理](#4-placeholder-自动处理)
  - [5. 表单项事件监听](#5-表单项事件监听)
  - [6. 条件渲染增强](#6-条件渲染增强)
  - [7. 只读模式支持](#7-只读模式支持)
  - [8. 默认值初始化](#8-默认值初始化)
  - [9. ElForm 属性透传](#9-elform-属性透传)
  - [10. 表单项属性配置](#10-表单项属性配置)
  - [11. 表单项说明/提示](#11-表单项说明提示)
  - [12. 数据转换（Transform）](#12-数据转换transform)
  - [13. 条件验证（Dependencies）](#13-条件验证dependencies)
  - [14. 动态数组字段](#14-动态数组字段)
  - [15. 表单分组/折叠](#15-表单分组折叠)
  - [16. 表单重置与清空](#16-表单重置与清空)
- [完整示例](#完整示例)
- [API 参考](#api-参考)
  - [Props（组件属性）](#props组件属性)
  - [FormItem 配置](#formitem-配置)
  - [支持的组件类型](#支持的组件类型type)
  - [暴露的方法](#暴露的方法通过-ref)
  - [插槽](#插槽)
  - [事件](#事件)
  - [类型定义](#类型定义)
- [向后兼容性](#向后兼容性)
- [最佳实践](#最佳实践)
  - [1. 表单设计原则](#1-表单设计原则)
  - [2. 性能优化](#2-性能优化)
  - [3. 验证策略](#3-验证策略)
  - [4. 表单联动](#4-表单联动)
  - [5. 表单复用](#5-表单复用)
- [总结](#总结)
  - [核心功能一览](#核心功能一览)
  - [适用场景](#适用场景)
  - [与其他表单组件对比](#与其他表单组件对比)
- [结语](#结语)

---

## 快速开始

### 基本用法

```vue
<template>
  <ArtForm v-model="formData" :items="formItems" />
</template>

<script setup lang="ts">
  const formData = ref({
    username: '',
    email: ''
  })

  const formItems = [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名'
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱'
    }
  ]
</script>
```

---

## 基础功能

### 1. 支持的组件类型

ArtForm 支持以下 Element Plus 组件类型：

| 类型            | 说明               | Element 组件    |
| --------------- | ------------------ | --------------- |
| `input`         | 文本输入框         | ElInput         |
| `number`        | 数字输入框         | ElInputNumber   |
| `select`        | 下拉选择器         | ElSelect        |
| `switch`        | 开关               | ElSwitch        |
| `checkbox`      | 复选框             | ElCheckbox      |
| `checkboxgroup` | 复选框组           | ElCheckboxGroup |
| `radiogroup`    | 单选框组           | ElRadioGroup    |
| `date`          | 日期选择器         | ElDatePicker    |
| `daterange`     | 日期范围选择器     | ElDatePicker    |
| `datetime`      | 日期时间选择器     | ElDatePicker    |
| `datetimerange` | 日期时间范围选择器 | ElDatePicker    |
| `rate`          | 评分               | ElRate          |
| `slider`        | 滑块               | ElSlider        |
| `cascader`      | 级联选择器         | ElCascader      |
| `timepicker`    | 时间选择器         | ElTimePicker    |
| `timeselect`    | 时间选择           | ElTimeSelect    |
| `treeselect`    | 树选择器           | ElTreeSelect    |

**示例：**

```vue
<script setup lang="ts">
  const formItems = [
    { key: 'name', label: '姓名', type: 'input' },
    { key: 'age', label: '年龄', type: 'number' },
    {
      key: 'gender',
      label: '性别',
      type: 'select',
      props: {
        options: [
          { label: '男', value: '男' },
          { label: '女', value: '女' }
        ]
      }
    },
    { key: 'birthday', label: '生日', type: 'date' },
    { key: 'rating', label: '评分', type: 'rate' },
    { key: 'enabled', label: '启用', type: 'switch' }
  ]
</script>
```

### 2. 双向绑定（v-model）

使用 `v-model` 实现表单数据的双向绑定：

```vue
<template>
  <ArtForm v-model="formData" :items="formItems" />

  <!-- 实时显示表单数据 -->
  <pre>{{ formData }}</pre>
</template>

<script setup lang="ts">
  const formData = ref({
    username: 'admin',
    email: 'admin@example.com'
  })
</script>
```

### 3. Options 配置

对于 `select`、`checkboxgroup`、`radiogroup` 等组件，可以通过 `options` 或 `props.options` 配置选项：

```vue
<script setup lang="ts">
  const formItems = [
    {
      key: 'gender',
      label: '性别',
      type: 'select',
      // 方式 1: 直接在 props 中配置
      props: {
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
        ]
      }
    },
    {
      key: 'hobbies',
      label: '爱好',
      type: 'checkboxgroup',
      props: {
        options: [
          { label: '读书', value: 'reading' },
          { label: '运动', value: 'sports' },
          { label: '旅游', value: 'travel' }
        ]
      }
    },
    {
      key: 'level',
      label: '等级',
      type: 'radiogroup',
      props: {
        options: [
          { label: '初级', value: 'junior' },
          { label: '中级', value: 'intermediate' },
          { label: '高级', value: 'senior' }
        ]
      }
    }
  ]
</script>
```

---

## 表单验证

### 1. 快捷必填配置

使用 `required` 和 `requiredMessage` 快速配置必填项：

```vue
<script setup lang="ts">
  const formItems = [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      required: true,
      requiredMessage: '请输入用户名' // 可选，默认为 "请输入{label}"
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input',
      required: true // 使用默认提示："请输入邮箱"
    }
  ]
</script>
```

### 2. 详细验证规则

使用 `rules` 配置复杂的验证规则：

```vue
<script setup lang="ts">
  const formItems = [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      rules: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      ]
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input',
      rules: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '请输入正确的邮箱格式',
          trigger: 'blur'
        }
      ]
    },
    {
      key: 'password',
      label: '密码',
      type: 'input',
      rules: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value.length < 6) {
              callback(new Error('密码长度不能少于6位'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  ]
</script>
```

### 3. 表单方法

ArtForm 通过 `ref` 暴露了多个实用方法。

```vue
<template>
  <ArtForm ref="formRef" v-model="formData" :items="formItems" />
  <ElButton @click="handleSubmit">提交</ElButton>
  <ElButton @click="handleReset">重置</ElButton>
</template>

<script setup lang="ts">
  const formRef = ref()
  const formData = ref({})

  // ===== 1. 表单验证 =====

  const handleSubmit = async () => {
    // 方式 1: 使用 Promise
    try {
      await formRef.value?.validate()
      console.log('验证通过', formData.value)
    } catch (error) {
      console.log('验证失败', error)
    }

    // 方式 2: 使用回调
    formRef.value?.validate((valid: boolean, fields?: Record<string, any>) => {
      if (valid) {
        console.log('验证通过', formData.value)
      } else {
        console.log('验证失败', fields)
      }
    })
  }

  // ===== 2. 验证指定字段 =====

  const validateField = () => {
    // 验证单个字段
    formRef.value?.validateField('username', (valid: boolean) => {
      console.log('username 验证结果:', valid)
    })

    // 验证多个字段
    formRef.value?.validateField(['username', 'email'], (valid: boolean) => {
      console.log('多字段验证结果:', valid)
    })
  }

  // ===== 3. 重置/清空表单 =====

  const handleReset = () => {
    // 方式 1: resetFields() - 仅重置可见字段（Element Plus 原生方法）
    formRef.value?.resetFields()

    // 方式 2: clear() - 清空所有字段（包括隐藏字段，设置为 undefined）
    formRef.value?.clear()

    // 方式 3: reset() - 重置到初始状态
    // - 如果提供了 initialValues prop，则恢复到该初始值
    // - 否则调用 resetFields() 恢复到表单注册时的值
    formRef.value?.reset()
  }

  // ===== 4. 清空验证 =====

  const clearValidate = () => {
    // 清空所有字段的验证
    formRef.value?.clearValidate()

    // 清空指定字段的验证
    formRef.value?.clearValidate('username')
    formRef.value?.clearValidate(['username', 'email'])
  }

  // ===== 5. 滚动到指定字段 =====

  const scrollToError = () => {
    // 验证失败后，滚动到第一个错误字段
    formRef.value?.validate((valid, fields) => {
      if (!valid) {
        const firstErrorField = Object.keys(fields)[0]
        formRef.value?.scrollToField(firstErrorField)
      }
    })
  }

  // ===== 6. 获取表单实例 =====

  const getFormInstance = () => {
    // 获取 Element Plus 的 FormInstance，可调用其他原生方法
    const elFormInstance = formRef.value?.formRef
    console.log(elFormInstance)
  }
</script>
```

**方法对比：**

| 方法 | 说明 | 使用场景 |
| --- | --- | --- |
| `validate()` | 验证整个表单 | 表单提交前 |
| `validateField()` | 验证指定字段 | 表单项失焦、动态验证 |
| `resetFields()` | 重置表单（仅可见字段，EP 原生） | 取消编辑、清空表单 |
| `clear()` | 清空表单（所有字段包括隐藏字段设为 undefined） | 完全清空表单数据 |
| `reset()` | 重置表单（有 initialValues 则恢复，否则调用 resetFields()） | 取消编辑恢复原值 |
| `clearValidate()` | 清空验证提示 | 重新编辑时清空错误 |
| `scrollToField()` | 滚动到指定字段 | 长表单定位错误 |

---

## 布局配置

### 1. 响应式栅格布局

基于 Element Plus 的 24 格栅格系统：

```vue
<template>
  <!-- 默认每项占 6 格（一行 4 个） -->
  <ArtForm v-model="formData" :items="formItems" :span="6" />

  <!-- 每项占 8 格（一行 3 个） -->
  <ArtForm v-model="formData" :items="formItems" :span="8" />

  <!-- 每项占 12 格（一行 2 个） -->
  <ArtForm v-model="formData" :items="formItems" :span="12" />

  <!-- 每项占 24 格（一行 1 个） -->
  <ArtForm v-model="formData" :items="formItems" :span="24" />
</template>
```

### 2. 单项自定义宽度

可以为每个表单项单独设置宽度：

```vue
<script setup lang="ts">
  const formItems = [
    {
      key: 'title',
      label: '标题',
      type: 'input',
      span: 24 // 独占一行
    },
    {
      key: 'author',
      label: '作者',
      type: 'input',
      span: 8 // 占 8 格
    },
    {
      key: 'date',
      label: '日期',
      type: 'date',
      span: 8 // 占 8 格
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      span: 8 // 占 8 格
    }
  ]
</script>
```

### 3. 响应式断点

组件内置响应式断点配置：

```vue
<!-- 组件内部的响应式配置 -->
<ElCol
  :xs="24"      <!-- 超小屏幕（<768px）：独占一行 -->
  :sm="12"      <!-- 小屏幕（≥768px）：一行两个 -->
  :md="8"       <!-- 中等屏幕（≥992px）：一行三个 -->
  :lg="item.span || span"   <!-- 大屏幕（≥1200px）：使用配置的 span -->
  :xl="item.span || span"   <!-- 超大屏幕（≥1920px）：使用配置的 span -->
>
```

### 4. 标签配置

```vue
<template>
  <!-- 全局标签配置 -->
  <ArtForm
    v-model="formData"
    :items="formItems"
    label-position="right"   <!-- 标签位置: left/right/top -->
    label-width="100px"      <!-- 标签宽度 -->
  />
</template>

<script setup lang="ts">
const formItems = [
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    labelWidth: '120px'  // 单独设置此项的标签宽度
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'input'  // 使用全局的 labelWidth
  }
]
</script>
```

### 5. 间距配置

```vue
<template>
  <!-- 设置表单项之间的间距 -->
  <ArtForm
    v-model="formData"
    :items="formItems"
    :gutter="20"  <!-- 列间距，默认 12 -->
  />
</template>
```

---

## 高级功能

### 1. ✅ 插槽扩展

ArtForm 支持两种插槽方式：**表单项插槽** 和 **动态插槽**。

#### 1.1 表单项插槽（完全自定义）

通过具名插槽 `#[item.key]` 完全替换表单项内容。

**用法示例：**

```vue
<template>
  <ArtForm v-model="formData" :items="formItems">
    <!-- 自定义 username 字段的渲染 -->
    <template #username="{ item, modelValue }">
      <div class="custom-input">
        <ElInput
          v-model="modelValue.username"
          prefix-icon="User"
          placeholder="自定义用户名输入框"
        />
        <span class="tips">用户名长度: {{ modelValue.username?.length || 0 }}</span>
      </div>
    </template>

    <!-- 自定义 avatar 字段 -->
    <template #avatar="{ item, modelValue }">
      <div class="avatar-uploader">
        <img v-if="modelValue.avatar" :src="modelValue.avatar" />
        <ElButton @click="handleUpload">上传头像</ElButton>
      </div>
    </template>
  </ArtForm>
</template>

<script setup lang="ts">
  const formData = ref({
    username: '',
    avatar: ''
  })

  const formItems = [
    { key: 'username', label: '用户名', type: 'input' },
    { key: 'avatar', label: '头像', type: 'input' } // type 可以随意，会被插槽替换
  ]

  const handleUpload = () => {
    // 上传逻辑
  }
</script>
```

**插槽参数：**

- `item`: 当前表单项配置对象
- `modelValue`: 整个表单的数据对象（可直接修改）

---

#### 1.2 动态插槽（Element 组件插槽）

通过 `item.slots` 配置传递给 Element Plus 组件的插槽内容。

**用法示例：**

```vue
<template>
  <ArtForm v-model="formData" :items="formItems" />
</template>

<script setup lang="ts">
  import { h } from 'vue'
  import { ElIcon } from 'element-plus'
  import { Search, Plus } from '@element-plus/icons-vue'

  const formData = ref({
    search: '',
    custom: ''
  })

  const formItems = [
    {
      key: 'search',
      label: '搜索',
      type: 'input',
      // 为 ElInput 添加 prefix 和 append 插槽
      slots: {
        prefix: () => h(ElIcon, null, () => h(Search)),
        append: () => h('span', { style: 'cursor: pointer' }, '搜索')
      }
    },
    {
      key: 'custom',
      label: '自定义',
      type: 'select',
      props: {
        options: []
      },
      // 为 ElSelect 添加 empty 插槽
      slots: {
        empty: () =>
          h('div', { style: 'text-align: center; padding: 20px' }, [
            h(ElIcon, { size: 40, style: 'color: #ccc' }, () => h(Plus)),
            h('p', '暂无数据')
          ])
      }
    }
  ]
</script>
```

**支持的插槽类型：**

根据不同的表单组件，可以使用不同的插槽：

| 组件         | 支持的插槽                      |
| ------------ | ------------------------------- |
| ElInput      | prefix, suffix, prepend, append |
| ElSelect     | prefix, empty, header, footer   |
| ElCascader   | empty                           |
| ElTreeSelect | prefix, empty                   |
| ElDatePicker | range-separator                 |

---

### 2. ✅ 自定义组件支持

除了使用字符串 `type`，还可以直接传入 Vue 组件。

**用法示例：**

```vue
<template>
  <ArtForm v-model="formData" :items="formItems" />
</template>

<script setup lang="ts">
  import { defineComponent, h } from 'vue'
  import MyCustomInput from '@/components/MyCustomInput.vue'

  // 方式 1: 使用现成的 Vue 组件
  const formItems = [
    {
      key: 'custom1',
      label: '自定义组件1',
      type: MyCustomInput, // 直接传入组件
      props: {
        placeholder: '这是自定义组件'
      }
    },
    {
      key: 'custom2',
      label: '自定义组件2',
      type: defineComponent({
        props: ['modelValue'],
        emits: ['update:modelValue'],
        setup(props, { emit }) {
          return () =>
            h('div', { class: 'my-custom-component' }, [
              h('input', {
                value: props.modelValue,
                onInput: (e: any) => emit('update:modelValue', e.target.value),
                placeholder: '完全自定义的输入框'
              })
            ])
        }
      })
    }
  ]

  const formData = ref({
    custom1: '',
    custom2: ''
  })
</script>
```

**要求：**

- 自定义组件必须支持 `v-model`（即实现 `modelValue` prop 和 `update:modelValue` 事件）
- 可以通过 `props` 传递额外的属性

---

### 3. ✅ 禁用状态支持

支持全局禁用和单项禁用控制。

**用法示例：**

```vue
<template>
  <!-- 全局禁用整个表单 -->
  <ArtForm v-model="formData" :items="formItems" :disabled="true" />

  <!-- 单项禁用 -->
  <ArtForm v-model="formData" :items="formItemsWithDisabled" />
</template>

<script setup lang="ts">
  const formData = ref({ username: '', email: '' })

  // 单项禁用示例
  const formItemsWithDisabled = [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      disabled: true // 仅禁用此项
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input'
    }
  ]
</script>
```

**优先级：** `item.disabled` > `全局 disabled`

---

### 4. ✅ Placeholder 自动处理

`placeholder` 属性现在可以正常工作，支持自动传递给表单组件。

**用法示例：**

```vue
<script setup lang="ts">
  const formItems = [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名' // 会自动应用到 ElInput
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input',
      // 也可以在 props 中设置
      props: {
        placeholder: '请输入邮箱地址'
      }
    }
  ]
</script>
```

---

### 5. ✅ 表单项事件监听

新增 `onChange` 回调，可以监听任何表单项的值变化。

**用法示例：**

```vue
<template>
  <ArtForm v-model="formData" :items="formItems" :onChange="handleFormChange" />
</template>

<script setup lang="ts">
  const formData = ref({
    country: '',
    city: ''
  })

  // 监听表单值变化
  const handleFormChange = (key: string, value: any, formData: Record<string, any>) => {
    console.log(`字段 ${key} 的值变为: ${value}`)

    // 示例：当国家变化时，清空城市选择
    if (key === 'country') {
      formData.city = ''
    }
  }
</script>
```

---

### 6. ✅ 条件渲染增强

`hidden` 属性现在支持函数形式，可以根据表单数据动态判断是否隐藏。

**用法示例：**

```vue
<script setup lang="ts">
  const formItems = [
    {
      key: 'hasAddress',
      label: '是否填写地址',
      type: 'switch'
    },
    {
      key: 'address',
      label: '详细地址',
      type: 'input',
      // 根据 hasAddress 的值动态显示/隐藏
      hidden: (formData) => !formData.hasAddress
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input',
      // 静态隐藏仍然支持
      hidden: false
    }
  ]
</script>
```

**应用场景：**

- 表单联动（选择某个选项后显示额外字段）
- 条件必填（某些情况下才显示和要求填写）
- 权限控制（根据用户权限显示不同字段）

---

### 7. ✅ 只读模式支持

支持全局只读和单项只读，适合详情展示页面。

**用法示例：**

```vue
<template>
  <!-- 全局只读 - 详情页展示 -->
  <ArtForm v-model="formData" :items="formItems" :readonly="true" />

  <!-- 混合模式：部分只读，部分可编辑 -->
  <ArtForm v-model="formData" :items="mixedFormItems" />
</template>

<script setup lang="ts">
  const formData = ref({
    id: '001',
    username: 'admin',
    email: 'admin@example.com'
  })

  // 混合只读示例
  const mixedFormItems = [
    {
      key: 'id',
      label: 'ID',
      type: 'input',
      readonly: true // 仅此项只读
    },
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      readonly: true
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input' // 此项可编辑
    }
  ]
</script>
```

**优先级：** `item.readonly` > `全局 readonly`

---

### 8. ✅ 默认值初始化

支持为表单项设置默认值，组件挂载时自动初始化。

**取舍规则快速参考：**

| formData[key] 的值 | item.defaultValue | 最终结果  | 说明                 |
| ------------------ | ----------------- | --------- | -------------------- |
| `'admin'`          | `'guest'`         | `'admin'` | v-model 优先 ✅      |
| `undefined`        | `'guest'`         | `'guest'` | 应用 defaultValue ✅ |
| `''`（空字符串）   | `'guest'`         | `''`      | 保持空字符串 ✅      |
| `null`             | `'guest'`         | `null`    | 保持 null ✅         |
| `0`                | `18`              | `0`       | 保持 0 ✅            |
| `false`            | `true`            | `false`   | 保持 false ✅        |
| 不存在             | `'guest'`         | `'guest'` | 应用 defaultValue ✅ |

**核心原则：** 只有 `undefined` 会被 `defaultValue` 替换，其他所有值（包括假值）都保持不变。

---

**用法示例：**

```vue
<script setup lang="ts">
  const formData = ref({})

  const formItems = [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      defaultValue: 'guest' // 自动设置初始值
    },
    {
      key: 'gender',
      label: '性别',
      type: 'select',
      defaultValue: '男',
      props: {
        options: [
          { label: '男', value: '男' },
          { label: '女', value: '女' }
        ]
      }
    },
    {
      key: 'age',
      label: '年龄',
      type: 'number',
      defaultValue: 18
    }
  ]

  // 组件挂载后，formData 会自动变为：
  // { username: 'guest', gender: '男', age: 18 }
</script>
```

**取舍规则：**

优先级：**`v-model 的值` > `item.defaultValue`**

只有当 `formData[key]` **严格等于 `undefined`** 时，才会应用 `item.defaultValue`。

**各种情况说明：**

```typescript
// 情况 1: formData 已有值，不会被 defaultValue 覆盖
const formData = ref({ username: 'admin' })
const formItems = [{ key: 'username', type: 'input', defaultValue: 'guest' }]
// 结果：username = 'admin' ✅（v-model 优先）

// 情况 2: formData 为空对象，会应用 defaultValue
const formData = ref({})
const formItems = [{ key: 'username', type: 'input', defaultValue: 'guest' }]
// 结果：username = 'guest' ✅（应用 defaultValue）

// 情况 3: formData 的值为 null/空字符串/0/false，不会被覆盖
const formData = ref({
  username: '', // 空字符串
  age: 0, // 数字 0
  enabled: false, // 布尔 false
  remark: null // null
})
const formItems = [
  { key: 'username', type: 'input', defaultValue: 'guest' },
  { key: 'age', type: 'number', defaultValue: 18 },
  { key: 'enabled', type: 'switch', defaultValue: true },
  { key: 'remark', type: 'input', defaultValue: '无' }
]
// 结果：
// username = '' ✅（保持空字符串）
// age = 0 ✅（保持 0）
// enabled = false ✅（保持 false）
// remark = null ✅（保持 null）
// 注意：只有 undefined 才会被 defaultValue 替换

// 情况 4: formData 中的 key 不存在（undefined）
const formData = ref({ other: 'value' })
const formItems = [{ key: 'username', type: 'input', defaultValue: 'guest' }]
// 结果：username = 'guest' ✅（应用 defaultValue）
```

**最佳实践：**

```typescript
// 推荐方式 1: 让组件管理默认值
const formData = ref({}) // 空对象
const formItems = [
  { key: 'gender', type: 'select', defaultValue: '男' },
  { key: 'age', type: 'number', defaultValue: 18 }
]
// 组件会自动初始化为 { gender: '男', age: 18 }

// 推荐方式 2: 外部提供完整初始值（编辑场景）
const formData = ref({
  gender: userData.gender || '男', // 有用户数据就用用户的
  age: userData.age || 18
})
const formItems = [
  { key: 'gender', type: 'select', defaultValue: '男' }, // 不会生效
  { key: 'age', type: 'number', defaultValue: 18 } // 不会生效
]

// ⚠️ 注意：如果想让 defaultValue 在编辑时也生效，需要这样：
const formData = ref({
  gender: userData.gender ?? undefined, // 使用 ?? 而不是 ||
  age: userData.age ?? undefined
})
// 这样当 userData.gender 为 null/'' 时，会变成 undefined，从而应用 defaultValue
```

**实际应用场景：**

```vue
<template>
  <div>
    <!-- 场景 1: 新增用户（使用 defaultValue） -->
    <ArtForm v-if="dialogType === 'add'" v-model="formData" :items="formItems" />

    <!-- 场景 2: 编辑用户（使用 v-model 的值） -->
    <ArtForm v-else v-model="formData" :items="formItems" />
  </div>
</template>

<script setup lang="ts">
  const dialogType = ref('add') // 'add' 或 'edit'
  const formData = ref({})

  const formItems = [
    {
      key: 'gender',
      label: '性别',
      type: 'select',
      defaultValue: '男', // 新增时的默认值
      props: {
        options: [
          { label: '男', value: '男' },
          { label: '女', value: '女' }
        ]
      }
    },
    {
      key: 'status',
      label: '状态',
      type: 'switch',
      defaultValue: true // 新增时默认启用
    }
  ]

  // 新增模式
  const handleAdd = () => {
    dialogType.value = 'add'
    formData.value = {} // 空对象，会应用 defaultValue
    // 结果：{ gender: '男', status: true }
  }

  // 编辑模式
  const handleEdit = (userData: any) => {
    dialogType.value = 'edit'
    formData.value = {
      gender: userData.gender, // 例如 '女'
      status: userData.status // 例如 false
    }
    // 结果：{ gender: '女', status: false }
    // defaultValue 不会覆盖已有的值
  }
</script>
```

---

### 9. ✅ ElForm 属性透传

ArtForm 继承了 Element Plus 的 ElForm 组件的所有属性，可以直接传递。

**用法示例：**

```vue
<template>
  <ArtForm
    v-model="formData"
    :items="formItems"
    :inline="true"              <!-- ElForm 的 inline 属性 -->
    :label-position="'top'"     <!-- ElForm 的 label-position 属性 -->
    :size="'large'"             <!-- ElForm 的 size 属性 -->
    :status-icon="true"         <!-- ElForm 的 status-icon 属性 -->
    :validate-on-rule-change="false"  <!-- ElForm 的属性 -->
    :hide-required-asterisk="false"   <!-- ElForm 的属性 -->
    :scroll-to-error="true"     <!-- ElForm 的属性 -->
    @submit.prevent="handleSubmit"    <!-- ElForm 的事件 -->
  />
</template>

<script setup lang="ts">
const formData = ref({ username: '', email: '' })
const formItems = [
  { key: 'username', label: '用户名', type: 'input' },
  { key: 'email', label: '邮箱', type: 'input' }
]

const handleSubmit = () => {
  console.log('表单提交')
}
</script>
```

**常用的 ElForm 属性：**

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `inline` | `boolean` | `false` | 行内表单模式 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 表单内组件的尺寸 |
| `status-icon` | `boolean` | `false` | 是否在输入框中显示校验结果反馈图标 |
| `validate-on-rule-change` | `boolean` | `true` | 是否在 rules 改变时立即触发验证 |
| `hide-required-asterisk` | `boolean` | `false` | 是否隐藏必填字段的星号 |
| `scroll-to-error` | `boolean` | `false` | 验证失败时是否滚动到第一个错误字段 |
| `scroll-into-view-options` | `object \| boolean` | - | 滚动到错误字段时的配置 |

**完整的 Element Plus 文档：** [ElForm API](https://element-plus.org/zh-CN/component/form.html#form-api)

---

### 10. ✅ 表单项属性配置

除了组件特定的属性，每个表单项还支持以下通用配置。

**FormItem 完整配置：**

```typescript
interface FormItem {
  // ===== 基础配置 =====
  key: string // 字段名（必填）
  label?: string // 标签文本
  type?: string | Component // 组件类型或自定义组件

  // ===== 布局配置 =====
  span?: number // 栅格占位（1-24）
  labelWidth?: string // 标签宽度
  hidden?: boolean | ((formData: Record<string, any>) => boolean) // 是否隐藏

  // ===== 表单控制 =====
  disabled?: boolean // 是否禁用
  readonly?: boolean // 是否只读
  placeholder?: string // 占位符文本
  defaultValue?: any // 默认值

  // ===== 验证配置 =====
  required?: boolean // 是否必填
  requiredMessage?: string // 必填提示信息
  rules?: FormRule[] // 详细验证规则

  // ===== 组件配置 =====
  props?: Record<string, any> // 传递给组件的属性
  slots?: Record<string, () => VNode> // 动态插槽
}
```

**示例：**

```vue
<script setup lang="ts">
  import type { FormItem } from '@/types/component/form'

  const formItems: FormItem[] = [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      span: 12,
      labelWidth: '100px',
      disabled: false,
      readonly: false,
      placeholder: '请输入用户名',
      defaultValue: 'guest',
      required: true,
      requiredMessage: '用户名不能为空',
      rules: [{ min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }],
      props: {
        maxlength: 20,
        showWordLimit: true,
        clearable: true
      }
    }
  ]
</script>
```

### 11. ✅ 表单项说明/提示

为表单项添加提示信息和帮助文本，提升用户体验。

#### 11.1 Tooltip 提示

在 label 旁显示问号图标，鼠标悬停显示提示信息。

```vue
<script setup lang="ts">
  const formItems = [
    {
      key: 'password',
      label: '密码',
      type: 'input',
      tooltip: '密码需包含大小写字母和数字，至少8位字符', // 问号图标提示
      props: {
        type: 'password',
        showPassword: true
      }
    },
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      tooltip: '用户名一旦设置不可修改'
    }
  ]
</script>
```

#### 11.2 Help 帮助文本

在表单项下方显示说明文字。

```vue
<script setup lang="ts">
  const formItems = [
    {
      key: 'email',
      label: '邮箱',
      type: 'input',
      help: '我们将向该邮箱发送验证码', // 表单项下方的说明
      required: true
    },
    {
      key: 'phone',
      label: '手机号',
      type: 'input',
      tooltip: '用于接收通知', // 可以同时使用 tooltip 和 help
      help: '格式：86-13800138000'
    }
  ]
</script>
```

**应用场景：**

- 解释字段含义或填写规则
- 提供示例格式
- 警告或注意事项
- 额外的操作提示

---

### 12. ✅ 数据转换（Transform）

在表单显示和数据提交之间进行格式转换。

**用法示例：**

```vue
<template>
  <ArtForm ref="formRef" v-model="formData" :items="formItems" />
  <ElButton @click="handleSubmit">提交</ElButton>
</template>

<script setup lang="ts">
  const formRef = ref()
  const formData = ref({
    birthday: '2000-01-01', // 后端返回的字符串
    price: 9900 // 后端存储的分（整数）
  })

  const formItems = [
    {
      key: 'birthday',
      label: '生日',
      type: 'date',
      // 数据转换
      transform: {
        // 输入转换：后端数据 -> 表单显示
        input: (value: string) => {
          return value ? new Date(value) : null
        },
        // 输出转换：表单数据 -> 提交给后端
        output: (value: Date) => {
          return value ? value.toISOString().split('T')[0] : ''
        }
      }
    },
    {
      key: 'price',
      label: '价格（元）',
      type: 'number',
      transform: {
        // 分 -> 元
        input: (value: number) => value / 100,
        // 元 -> 分
        output: (value: number) => Math.round(value * 100)
      }
    }
  ]

  const handleSubmit = async () => {
    // 获取转换后的提交数据
    const submitData = formRef.value?.getSubmitData()
    console.log('提交数据:', submitData)
    // { birthday: '2000-01-01', price: 9900 }

    // 或直接验证后提交
    await formRef.value?.validate()
    const data = formRef.value?.getSubmitData()
    // 发送到后端...
  }
</script>
```

**更多示例：**

```typescript
// 示例 1: 时间戳转换
{
  key: 'createdAt',
  label: '创建时间',
  type: 'datetime',
  transform: {
    input: (timestamp: number) => new Date(timestamp),
    output: (date: Date) => date.getTime()
  }
}

// 示例 2: 数组 <-> 字符串
{
  key: 'tags',
  label: '标签',
  type: 'select',
  props: {
    multiple: true,
    options: [...]
  },
  transform: {
    // '标签1,标签2' -> ['标签1', '标签2']
    input: (value: string) => value ? value.split(',') : [],
    // ['标签1', '标签2'] -> '标签1,标签2'
    output: (value: string[]) => value.join(',')
  }
}

// 示例 3: 布尔值 <-> 数字
{
  key: 'status',
  label: '状态',
  type: 'switch',
  transform: {
    input: (value: number) => value === 1,
    output: (value: boolean) => value ? 1 : 0
  }
}
```

**应用场景：**

- 日期时间格式转换
- 金额单位转换（元/分）
- 数据结构转换（字符串/数组）
- 布尔值和数字互转
- 任何前后端数据格式不一致的情况

---

### 13. ✅ 条件验证（Dependencies）

当某个字段发生变化时，自动重新验证依赖该字段的其他表单项。

**用法示例：**

```vue
<script setup lang="ts">
  const formData = ref({
    password: '',
    confirmPassword: ''
  })

  const formItems = [
    {
      key: 'password',
      label: '密码',
      type: 'input',
      props: { type: 'password' },
      rules: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码不能少于6位', trigger: 'blur' }
      ]
    },
    {
      key: 'confirmPassword',
      label: '确认密码',
      type: 'input',
      props: { type: 'password' },
      // 依赖 password 字段
      dependencies: ['password'],
      rules: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== formData.value.password) {
              callback(new Error('两次密码输入不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  ]
</script>
```

**工作原理：**

当 `password` 字段的值发生变化时：

1. 组件自动检测哪些字段依赖于 `password`
2. 自动重新验证 `confirmPassword` 字段
3. 确保密码一致性校验实时生效

**更多示例：**

```typescript
// 示例 1: 省市联动验证
{
  key: 'city',
  label: '城市',
  type: 'select',
  dependencies: ['province'], // 省份变化时重新验证
  rules: [
    {
      required: true,
      message: '请选择城市',
      trigger: 'change'
    },
    {
      validator: (rule, value, callback) => {
        // 确保城市属于选择的省份
        const province = formData.value.province
        if (province && !cityBelongsToProvince(value, province)) {
          callback(new Error('请选择正确的城市'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 示例 2: 日期范围验证
{
  key: 'endDate',
  label: '结束日期',
  type: 'date',
  dependencies: ['startDate'], // 开始日期变化时重新验证
  rules: [
    {
      validator: (rule, value, callback) => {
        const startDate = formData.value.startDate
        if (startDate && value && value < startDate) {
          callback(new Error('结束日期不能早于开始日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 示例 3: 多字段依赖
{
  key: 'totalPrice',
  label: '总价',
  type: 'number',
  dependencies: ['quantity', 'unitPrice'], // 依赖多个字段
  rules: [
    {
      validator: (rule, value, callback) => {
        const { quantity, unitPrice } = formData.value
        const expected = quantity * unitPrice
        if (Math.abs(value - expected) > 0.01) {
          callback(new Error(`总价应为 ${expected} 元`))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
```

**应用场景：**

- 密码确认
- 日期范围验证
- 省市联动验证
- 金额计算验证
- 任何需要关联验证的字段

---

### 14. ✅ 动态数组字段

支持动态添加/删除表单项，适用于联系人、地址、商品列表等场景。

**用法示例：**

```vue
<template>
  <ArtForm v-model="formData" :items="formItems" />
</template>

<script setup lang="ts">
  const formData = ref({
    contacts: ['', ''] // 初始2个联系人
  })

  const formItems = [
    {
      key: 'contacts',
      label: '联系人',
      type: 'array', // 动态数组类型
      placeholder: '请输入联系人姓名',
      arrayConfig: {
        itemType: 'input', // 数组项的类型
        min: 1, // 最少1项
        max: 5, // 最多5项
        addText: '添加联系人', // 添加按钮文本
        removeText: '删除', // 删除按钮文本（可选）
        showActions: true // 是否显示操作按钮（默认 true）
      }
    }
  ]
</script>
```

**高级配置：**

```vue
<script setup lang="ts">
  const formData = ref({
    addresses: [{ province: '', city: '', detail: '' }]
  })

  const formItems = [
    {
      key: 'phones',
      label: '手机号',
      type: 'array',
      span: 24,
      arrayConfig: {
        itemType: 'input', // 使用输入框
        itemProps: {
          // 传递给每个输入框的属性
          maxlength: 11,
          placeholder: '请输入手机号'
        },
        min: 1,
        max: 3,
        addText: '+ 添加手机号'
      }
    },
    {
      key: 'emails',
      label: '邮箱地址',
      type: 'array',
      span: 24,
      arrayConfig: {
        itemType: 'input',
        itemProps: {
          type: 'email',
          placeholder: '请输入邮箱地址'
        },
        min: 0, // 可以为0个
        max: 10
      }
    }
  ]
</script>
```

**注意事项：**

1. 数组字段的 `formData[key]` 必须是数组类型
2. 如果未初始化，组件会自动创建 `min` 个空项
3. 删除按钮在达到 `min` 时自动禁用
4. 添加按钮在达到 `max` 时自动禁用

**应用场景：**

- 多个联系人/手机号/邮箱
- 收货地址列表
- 商品明细
- 教育/工作经历
- 任何需要动态增减的表单项

---

### 15. ✅ 表单分组/折叠

将表单项分组展示，支持折叠/展开，适合长表单。

**用法示例：**

```vue
<template>
  <ArtForm v-model="formData" :items="formItems" />
</template>

<script setup lang="ts">
  const formData = ref({
    // 基本信息
    username: '',
    email: '',
    phone: '',
    // 详细信息
    address: '',
    bio: ''
  })

  const formItems = [
    {
      key: 'group1',
      type: 'group', // 分组类型
      groupConfig: {
        title: '基本信息', // 分组标题
        collapsible: true, // 是否可折叠
        defaultExpanded: true, // 默认展开
        children: [
          // 分组内的表单项
          {
            key: 'username',
            label: '用户名',
            type: 'input',
            required: true,
            span: 12
          },
          {
            key: 'email',
            label: '邮箱',
            type: 'input',
            required: true,
            span: 12
          },
          {
            key: 'phone',
            label: '手机号',
            type: 'input',
            span: 12
          }
        ]
      }
    },
    {
      key: 'group2',
      type: 'group',
      groupConfig: {
        title: '详细信息',
        collapsible: true,
        defaultExpanded: false, // 默认折叠
        children: [
          {
            key: 'address',
            label: '地址',
            type: 'input',
            span: 24
          },
          {
            key: 'bio',
            label: '个人简介',
            type: 'input',
            props: {
              type: 'textarea',
              rows: 4
            },
            span: 24
          }
        ]
      }
    }
  ]
</script>
```

**完整配置示例：**

```typescript
{
  key: 'advancedSettings',
  type: 'group',
  label: '高级设置', // 可选，会被 groupConfig.title 覆盖
  groupConfig: {
    title: '高级设置',
    collapsible: true, // 可折叠
    defaultExpanded: false, // 默认折叠
    children: [
      {
        key: 'setting1',
        label: '设置项1',
        type: 'switch'
      },
      {
        key: 'setting2',
        label: '设置项2',
        type: 'input'
      }
    ]
  }
}
```

**特点：**

- 支持多层分组
- 支持折叠/展开动画
- 分组内的表单项支持所有功能（验证、隐藏、插槽等）
- 可以配置是否可折叠
- 可以设置默认展开状态

**应用场景：**

- 长表单分组展示
- 高级设置折叠
- 不同类别的信息分组
- 提升表单可读性

---

### 16. ✅ 表单重置与清空

提供多种表单重置和清空方法，满足不同场景需求。

**用法示例：**

```vue
<template>
  <ArtForm ref="formRef" v-model="formData" :items="formItems" :initialValues="initialValues" />
  <ElButton @click="handleClear">清空</ElButton>
  <ElButton @click="handleReset">重置</ElButton>
  <ElButton @click="handleResetFields">重置字段</ElButton>
</template>

<script setup lang="ts">
  const formRef = ref()

  // 表单初始值（从后端获取）
  const initialValues = ref({
    username: 'admin',
    email: 'admin@example.com',
    status: true
  })

  // 当前表单值
  const formData = ref({ ...initialValues.value })

  const formItems = [
    { key: 'username', label: '用户名', type: 'input' },
    { key: 'email', label: '邮箱', type: 'input' },
    { key: 'status', label: '状态', type: 'switch' }
  ]

  // 清空所有字段
  const handleClear = () => {
    formRef.value?.clear()
    // 结果：{ username: undefined, email: undefined, status: undefined }
  }

  // 重置到初始值（因为提供了 initialValues）
  const handleReset = () => {
    formRef.value?.reset()
    // 结果：{ username: 'admin', email: 'admin@example.com', status: true }
  }

  // Element Plus 原生方法（仅重置可见字段）
  const handleResetFields = () => {
    formRef.value?.resetFields()
  }
</script>
```

**示例 2：不使用 initialValues 的场景（如编辑对话框）**

```vue
<template>
  <!-- 不传 initialValues，直接用 v-model 绑定表单数据 -->
  <ArtForm ref="formRef" v-model="formData" :items="formItems" />
  <ElButton @click="handleClear">清空</ElButton>
  <ElButton @click="handleReset">重置</ElButton>
</template>

<script setup lang="ts">
  const formRef = ref()

  // 当对话框打开时，formData 会被初始化
  const formData = ref({
    username: 'admin', // 来自后端的数据
    email: 'admin@example.com',
    status: true
  })

  const formItems = [
    { key: 'username', label: '用户名', type: 'input' },
    { key: 'email', label: '邮箱', type: 'input' },
    { key: 'status', label: '状态', type: 'switch' }
  ]

  // 清空所有字段
  const handleClear = () => {
    formRef.value?.clear()
    // 结果：{ username: undefined, email: undefined, status: undefined }
  }

  // 重置到表单注册时的值（打开对话框时的初始值）
  const handleReset = () => {
    formRef.value?.reset()
    // 因为没有 initialValues，会调用 resetFields()
    // 结果：恢复到表单首次绑定时的值 { username: 'admin', email: 'admin@example.com', status: true }
  }
</script>
```

**方法对比：**

| 方法 | 说明 | 行为逻辑 | 使用场景 |
| --- | --- | --- | --- |
| `clear()` | 清空所有字段 | 所有字段（包括隐藏）设为 undefined | 完全清空表单 |
| `reset()` | 重置表单到初始状态 | 如果传了 initialValues 就恢复到 initialValues，否则调用 resetFields() | 取消编辑恢复原值 |
| `resetFields()` | Element Plus 原生重置方法 | 恢复到表单注册时的值（仅可见字段） | 常规表单重置 |

**应用场景：**

- **清空表单**：新增表单时清空所有数据（使用 `clear()`）
- **取消编辑**：
  - 方式 1：编辑表单取消时恢复原值（使用 `reset()` + `initialValues`）
  - 方式 2：直接恢复到表单打开时的值（使用 `reset()`，不传 initialValues）
- **表单错误后恢复**：提交失败后恢复初始状态（使用 `reset()`）
- **重置到默认配置**：恢复系统默认设置（使用 `reset()` + `initialValues`）

**注意事项：**

1. **`clear()` 适用场景**：完全清空表单，所有字段变为 `undefined`
2. **`reset()` 适用场景**：
   - 如果传入了 `initialValues` prop，会恢复到该初始值对象
   - 如果没有传入 `initialValues`，会调用 Element Plus 的 `resetFields()`，恢复到表单注册时的值
3. **`resetFields()` 适用场景**：Element Plus 原生方法，仅重置可见字段，隐藏字段不会被重置

---

## 完整示例

结合所有新功能的综合示例：

```vue
<template>
  <ArtForm
    v-model="formData"
    :items="formItems"
    :disabled="isFormDisabled"
    :readonly="isFormReadonly"
    :onChange="handleChange"
    :span="24"
    label-width="100px"
  />
</template>

<script setup lang="ts">
  import type { FormItem } from '@/types/component/form'

  const formData = ref({})
  const isFormDisabled = ref(false)
  const isFormReadonly = ref(false)

  const formItems: FormItem[] = [
    {
      key: 'userType',
      label: '用户类型',
      type: 'select',
      defaultValue: 'personal',
      props: {
        options: [
          { label: '个人用户', value: 'personal' },
          { label: '企业用户', value: 'company' }
        ]
      }
    },
    {
      key: 'companyName',
      label: '企业名称',
      type: 'input',
      placeholder: '请输入企业名称',
      // 只有选择企业用户时才显示
      hidden: (formData) => formData.userType !== 'company',
      required: true
    },
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      required: true,
      disabled: false
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱地址',
      readonly: true, // 邮箱不可修改
      defaultValue: 'user@example.com'
    },
    {
      key: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '请输入手机号',
      props: {
        maxlength: 11
      }
    }
  ]

  const handleChange = (key: string, value: any, formData: Record<string, any>) => {
    console.log(`${key} changed to:`, value)

    // 业务逻辑示例：切换用户类型时，清空企业名称
    if (key === 'userType' && value === 'personal') {
      formData.companyName = ''
    }
  }
</script>
```

---

## API 参考

### Props（组件属性）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` / `v-model` | `Record<string, any>` | `{}` | 表单数据对象（双向绑定） |
| `items` | `FormItem[]` | `[]` | 表单项配置数组 |
| `span` | `number` | `6` | 表单项默认栅格占位（1-24） |
| `gutter` | `number` | `12` | 表单项之间的间距 |
| `labelPosition` | `'left' \| 'right' \| 'top'` | `'right'` | 标签位置 |
| `labelWidth` | `string` | `'70px'` | 标签宽度 |
| `disabled` | `boolean` | `false` | 全局禁用表单 |
| `readonly` | `boolean` | `false` | 全局只读表单 |
| `rules` | `Record<string, FormRule[]>` | `{}` | 外部验证规则（优先级更高） |
| `onChange` | `(key: string, value: any, formData: Record<string, any>) => void` | - | 表单项值变化回调 |
| `initialValues` | `Record<string, any>` | - | 表单初始值，用于 resetToInitial() |
| **...ElForm Props** | - | - | 继承 Element Plus 的所有 ElForm 属性 |

---

### FormItem 配置

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `key` | `string` | ✅ | 字段名，对应 formData 的 key |
| `label` | `string` | ❌ | 标签文本 |
| `type` | `string \| Component` | ❌ | 组件类型或自定义组件（默认 `'input'`） |
| `span` | `number` | ❌ | 栅格占位，覆盖全局 span |
| `labelWidth` | `string` | ❌ | 标签宽度，覆盖全局 labelWidth |
| `hidden` | `boolean \| (formData) => boolean` | ❌ | 是否隐藏，支持函数动态判断 |
| `disabled` | `boolean` | ❌ | 是否禁用，覆盖全局 disabled |
| `readonly` | `boolean` | ❌ | 是否只读，覆盖全局 readonly |
| `placeholder` | `string` | ❌ | 占位符文本 |
| `defaultValue` | `any` | ❌ | 默认值（仅当 formData[key] === undefined 时生效） |
| `required` | `boolean` | ❌ | 是否必填（快捷配置） |
| `requiredMessage` | `string` | ❌ | 必填提示信息（默认"请输入{label}"） |
| `rules` | `FormRule[]` | ❌ | 详细验证规则 |
| `props` | `Record<string, any>` | ❌ | 传递给组件的属性 |
| `slots` | `Record<string, () => VNode>` | ❌ | 动态插槽（传递给组件内部） |
| `tooltip` | `string` | ❌ | Label 旁的提示信息（问号图标） |
| `help` | `string` | ❌ | 表单项下方的帮助文本 |
| `transform` | `FormTransform` | ❌ | 数据转换配置（input/output） |
| `dependencies` | `string[]` | ❌ | 依赖的字段列表 |
| `arrayConfig` | `FormArrayConfig` | ❌ | 动态数组字段配置（type='array' 时） |
| `groupConfig` | `FormGroupConfig` | ❌ | 表单分组配置（type='group' 时） |

---

### 支持的组件类型（type）

| type 值           | Element 组件      | 说明               |
| ----------------- | ----------------- | ------------------ |
| `'input'`         | `ElInput`         | 文本输入框（默认） |
| `'number'`        | `ElInputNumber`   | 数字输入框         |
| `'select'`        | `ElSelect`        | 下拉选择器         |
| `'switch'`        | `ElSwitch`        | 开关               |
| `'checkbox'`      | `ElCheckbox`      | 单个复选框         |
| `'checkboxgroup'` | `ElCheckboxGroup` | 复选框组           |
| `'radiogroup'`    | `ElRadioGroup`    | 单选框组           |
| `'date'`          | `ElDatePicker`    | 日期选择器         |
| `'daterange'`     | `ElDatePicker`    | 日期范围选择器     |
| `'datetime'`      | `ElDatePicker`    | 日期时间选择器     |
| `'datetimerange'` | `ElDatePicker`    | 日期时间范围选择器 |
| `'rate'`          | `ElRate`          | 评分               |
| `'slider'`        | `ElSlider`        | 滑块               |
| `'cascader'`      | `ElCascader`      | 级联选择器         |
| `'timepicker'`    | `ElTimePicker`    | 时间选择器         |
| `'timeselect'`    | `ElTimeSelect`    | 时间选择           |
| `'treeselect'`    | `ElTreeSelect`    | 树选择器           |
| `'array'`         | -                 | 动态数组字段       |
| `'group'`         | -                 | 表单分组           |
| 自定义组件        | -                 | 传入 Vue 组件对象  |

---

### 暴露的方法（通过 ref）

| 方法 | 参数 | 返回值 | 说明 |
| --- | --- | --- | --- |
| `validate` | `(callback?: (valid, fields) => void)` | `Promise<boolean>` | 验证整个表单 |
| `validateField` | `(props: string \| string[], callback?)` | `Promise<void>` | 验证指定字段 |
| `resetFields` | `()` | `void` | 重置表单字段（Element Plus 原生方法，仅可见字段） |
| `clear` | `()` | `void` | 清空表单（所有字段包括隐藏字段设为 undefined） |
| `reset` | `()` | `void` | 重置表单（有 initialValues 则恢复到该值，否则调用 resetFields()） |
| `clearValidate` | `(props?: string \| string[])` | `void` | 清空验证提示 |
| `scrollToField` | `(prop: string)` | `void` | 滚动到指定字段 |
| `getSubmitData` | `()` | `Record<string, any>` | 获取提交数据（应用 transform.output） |
| `addArrayItem` | `(key: string)` | `void` | 添加数组项 |
| `removeArrayItem` | `(key: string, index: number)` | `void` | 删除数组项 |
| `formRef` | - | `FormInstance` | Element Plus 的表单实例 |

---

### 插槽

| 插槽名 | 参数 | 说明 |
| --- | --- | --- |
| `[item.key]` | `{ item: FormItem, modelValue: Record<string, any> }` | 自定义表单项内容，替换默认组件 |

**示例：**

```vue
<ArtForm v-model="formData" :items="formItems">
  <!-- 自定义 username 字段 -->
  <template #username="{ item, modelValue }">
    <ElInput v-model="modelValue.username" placeholder="自定义输入框" />
  </template>
</ArtForm>
```

---

### 事件

| 事件名               | 参数                           | 说明                                 |
| -------------------- | ------------------------------ | ------------------------------------ |
| `update:modelValue`  | `(value: Record<string, any>)` | 表单数据变化时触发（v-model）        |
| **...ElForm Events** | -                              | 继承 Element Plus 的所有 ElForm 事件 |

**注意：** 如果需要监听表单项的值变化，推荐使用 `onChange` prop 而不是 watch。

---

### 类型定义

```typescript
import type { Component, VNode } from 'vue'
import type { FormItemRule } from 'element-plus'

// 表单验证规则
export interface FormRule extends FormItemRule {
  // 异步验证函数
  asyncValidator?: (rule: any, value: any) => Promise<void>
  // 依赖的其他字段
  dependencies?: string[]
}

// 数据转换配置
export interface FormTransform {
  // 输入转换：外部数据 -> 表单显示值
  input?: (value: any, formData: Record<string, any>) => any
  // 输出转换：表单值 -> 提交数据
  output?: (value: any, formData: Record<string, any>) => any
}

// 动态数组字段配置
export interface FormArrayConfig {
  // 数组项的类型
  itemType?: string | Component
  // 数组项的配置
  itemProps?: Record<string, any>
  // 最小项数
  min?: number
  // 最大项数
  max?: number
  // 添加按钮文本
  addText?: string
  // 删除按钮文本
  removeText?: string
  // 是否显示操作按钮
  showActions?: boolean
}

// 表单分组配置
export interface FormGroupConfig {
  // 分组标题
  title?: string
  // 是否可折叠
  collapsible?: boolean
  // 默认是否展开
  defaultExpanded?: boolean
  // 子表单项
  children: FormItem[]
}

// 表单项配置
export interface FormItem {
  key: string
  label?: string
  type?: string | Component | 'array' | 'group'
  span?: number
  labelWidth?: string
  hidden?: boolean | ((formData: Record<string, any>) => boolean)
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  defaultValue?: any
  required?: boolean
  requiredMessage?: string
  rules?: FormRule[]
  props?: Record<string, any>
  slots?: Record<string, () => VNode>
  // 新增属性
  tooltip?: string
  help?: string
  transform?: FormTransform
  dependencies?: string[]
  arrayConfig?: FormArrayConfig
  groupConfig?: FormGroupConfig
  [key: string]: any // 允许其他自定义属性
}

// 组件 Props
export interface FormProps {
  items: FormItem[]
  span?: number
  gutter?: number
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string
  disabled?: boolean
  readonly?: boolean
  rules?: Record<string, FormRule[]>
  onChange?: (key: string, value: any, formData: Record<string, any>) => void
  initialValues?: Record<string, any>
}
```

---

## 向后兼容性

所有新增功能都是**可选的**，不会影响现有代码：

- ✅ 如果不使用新功能，组件行为与之前完全一致
- ✅ 所有新属性都有合理的默认值
- ✅ 类型定义完整，TypeScript 友好

---

## 最佳实践

### 1. 表单设计原则

```vue
<script setup lang="ts">
  // ✅ 推荐：清晰的类型定义
  import type { FormItem } from '@/types/component/form'

  const formItems: FormItem[] = [
    // 使用 TypeScript 获得完整的类型提示
  ]

  // ✅ 推荐：分离表单配置和业务逻辑
  const userFormItems = ref<FormItem[]>([...])
  const handleFormChange = (key: string, value: any) => {
    // 业务逻辑
  }
</script>
```

---

### 2. 性能优化

```vue
<script setup lang="ts">
  // ✅ 推荐：使用 computed 处理动态配置
  const formItems = computed(() => [
    {
      key: 'city',
      label: '城市',
      type: 'select',
      props: {
        options: getCityOptions(formData.value.province) // 动态 options
      }
    }
  ])

  // ❌ 不推荐：在 hidden 中执行复杂计算
  const badFormItems = [
    {
      key: 'field',
      hidden: (formData) => {
        // 复杂的同步计算会影响性能
        return someComplexCalculation(formData)
      }
    }
  ]

  // ✅ 推荐：使用 computed 缓存计算结果
  const shouldHideField = computed(() => someComplexCalculation(formData.value))
  const goodFormItems = computed(() => [
    {
      key: 'field',
      hidden: shouldHideField.value
    }
  ])
</script>
```

---

### 3. 验证策略

```vue
<script setup lang="ts">
  // ✅ 推荐：简单场景使用快捷配置
  const simpleItems = [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      required: true, // 简洁
      requiredMessage: '用户名不能为空'
    }
  ]

  // ✅ 推荐：复杂场景使用详细规则
  const complexItems = [
    {
      key: 'password',
      label: '密码',
      type: 'input',
      rules: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码不能少于6位', trigger: 'blur' },
        {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          message: '密码必须包含大小写字母和数字',
          trigger: 'blur'
        }
      ]
    }
  ]
</script>
```

---

### 4. 表单联动

```vue
<script setup lang="ts">
  const formData = ref({
    province: '',
    city: '',
    needsInvoice: false,
    invoiceTitle: ''
  })

  const formItems = computed(() => [
    {
      key: 'province',
      label: '省份',
      type: 'select',
      props: {
        options: provinceOptions.value
      }
    },
    {
      key: 'city',
      label: '城市',
      type: 'select',
      props: {
        options: getCityOptions(formData.value.province), // 根据省份动态获取城市
        disabled: !formData.value.province // 未选择省份时禁用
      }
    },
    {
      key: 'needsInvoice',
      label: '需要发票',
      type: 'switch'
    },
    {
      key: 'invoiceTitle',
      label: '发票抬头',
      type: 'input',
      hidden: !formData.value.needsInvoice, // 根据开关动态显示
      required: formData.value.needsInvoice // 动态必填
    }
  ])

  // 监听省份变化，清空城市
  const handleFormChange = (key: string, value: any) => {
    if (key === 'province') {
      formData.value.city = '' // 重置城市
    }
  }
</script>
```

---

### 5. 表单复用

```vue
<!-- UserForm.vue -->
<script setup lang="ts">
  // 可复用的表单组件
  defineProps<{
    mode: 'add' | 'edit'
  }>()

  const formRef = ref()
  const formData = defineModel<Record<string, any>>()

  const formItems = computed(() => [
    {
      key: 'id',
      label: 'ID',
      type: 'input',
      readonly: props.mode === 'edit', // 编辑模式只读
      hidden: props.mode === 'add' // 新增模式隐藏
    },
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      required: true
    }
  ])

  defineExpose({
    validate: () => formRef.value?.validate()
  })
</script>

<template>
  <ArtForm ref="formRef" v-model="formData" :items="formItems" />
</template>

<!-- 使用 -->
<script setup lang="ts">
  import UserForm from './UserForm.vue'

  const userFormRef = ref()
  const userData = ref({})

  const handleSubmit = async () => {
    await userFormRef.value?.validate()
    // 提交数据
  }
</script>

<template>
  <UserForm ref="userFormRef" v-model="userData" mode="add" />
</template>
```

---

## 总结

### 核心功能一览

| 分类     | 功能             | 说明                          | 优先级     |
| -------- | ---------------- | ----------------------------- | ---------- |
| **基础** | 多组件支持       | 支持 17+ 种 Element Plus 组件 | ⭐⭐⭐⭐⭐ |
| **基础** | v-model 双向绑定 | 响应式数据绑定                | ⭐⭐⭐⭐⭐ |
| **基础** | Options 配置     | 下拉、单选、复选的选项配置    | ⭐⭐⭐⭐⭐ |
| **验证** | 快捷必填         | required + requiredMessage    | ⭐⭐⭐⭐⭐ |
| **验证** | 详细规则         | rules 数组配置                | ⭐⭐⭐⭐⭐ |
| **验证** | 验证方法         | validate、validateField 等    | ⭐⭐⭐⭐⭐ |
| **布局** | 栅格系统         | 24 格响应式布局               | ⭐⭐⭐⭐⭐ |
| **布局** | 标签配置         | labelPosition、labelWidth     | ⭐⭐⭐⭐   |
| **布局** | 响应式断点       | 自动适配不同屏幕              | ⭐⭐⭐⭐   |
| **高级** | 插槽扩展         | 表单项插槽 + 动态插槽         | ⭐⭐⭐⭐⭐ |
| **高级** | 自定义组件       | type 支持 Vue 组件            | ⭐⭐⭐⭐   |
| **高级** | 禁用状态         | 全局/单项禁用                 | ⭐⭐⭐⭐   |
| **高级** | Placeholder      | 自动处理占位符                | ⭐⭐⭐⭐   |
| **高级** | onChange         | 监听值变化回调                | ⭐⭐⭐⭐   |
| **高级** | 动态隐藏         | hidden 支持函数               | ⭐⭐⭐⭐   |
| **高级** | 只读模式         | 全局/单项只读                 | ⭐⭐⭐     |
| **高级** | 默认值           | defaultValue 自动初始化       | ⭐⭐⭐     |
| **高级** | ElForm 透传      | 继承所有 ElForm 属性          | ⭐⭐⭐⭐   |
| **高级** | 表单方法         | resetFields、scrollToField 等 | ⭐⭐⭐⭐   |
| **新增** | 提示/帮助        | tooltip + help 文本           | ⭐⭐⭐⭐⭐ |
| **新增** | 数据转换         | transform 输入/输出转换       | ⭐⭐⭐⭐⭐ |
| **新增** | 条件验证         | dependencies 依赖字段验证     | ⭐⭐⭐⭐⭐ |
| **新增** | 动态数组         | type='array' 动态增删         | ⭐⭐⭐⭐⭐ |
| **新增** | 表单分组         | type='group' 折叠/展开        | ⭐⭐⭐⭐⭐ |
| **新增** | 表单重置/清空    | clear/reset 方法              | ⭐⭐⭐⭐   |

---

### 适用场景

| 场景          | 推荐功能组合                               |
| ------------- | ------------------------------------------ |
| 🆕 新增表单   | defaultValue + required + validate + clear |
| ✏️ 编辑表单   | v-model + readonly（部分字段） + reset     |
| 👁️ 详情展示   | readonly（全局） + disabled                |
| 🔗 表单联动   | computed items + onChange + hidden（函数） |
| 📱 响应式表单 | span + 响应式断点 + gutter                 |
| 🎨 自定义渲染 | 插槽 + 自定义组件                          |
| ⚡ 动态表单   | computed items + hidden（函数） + onChange |
| 🔒 权限控制   | disabled + readonly + hidden               |
| 📋 动态列表   | type='array' + arrayConfig + min/max       |
| 📂 长表单分组 | type='group' + groupConfig + collapsible   |
| 🔄 数据转换   | transform + getSubmitData                  |
| 🔗 关联验证   | dependencies + rules                       |
| 💡 用户提示   | tooltip + help + placeholder               |
| ↩️ 取消编辑   | initialValues + reset（恢复原值）          |

---

### 与其他表单组件对比

| 特性            | ArtForm            | Element Plus Form | Ant Design Form |
| --------------- | ------------------ | ----------------- | --------------- |
| 配置化开发      | ✅                 | ❌                | ✅（部分）      |
| 栅格布局        | ✅                 | 需手动配置        | ✅              |
| 插槽支持        | ✅✅（双层插槽）   | ✅                | ✅              |
| 动态隐藏        | ✅（函数支持）     | ❌                | ✅              |
| 默认值          | ✅                 | ❌                | ✅              |
| onChange        | ✅                 | ❌                | ✅              |
| 动态数组字段    | ✅                 | 需手动实现        | ✅（List）      |
| 表单分组        | ✅                 | 需手动实现        | ❌              |
| 数据转换        | ✅（transform）    | 需手动处理        | ✅（normalize） |
| 条件验证        | ✅（dependencies） | ❌                | ✅              |
| 提示/帮助       | ✅（tooltip/help） | 需手动实现        | ✅              |
| 学习成本        | ⭐⭐               | ⭐⭐⭐            | ⭐⭐⭐⭐        |
| TypeScript 支持 | ✅                 | ✅                | ✅              |

**ArtForm 的优势：**

- 🚀 **配置化开发**：减少模板代码，提高开发效率
- 🎯 **开箱即用**：内置常用功能，无需额外封装
- 🔧 **灵活扩展**：插槽、自定义组件、ElForm 透传
- 📦 **轻量简洁**：基于 Element Plus，无额外依赖
- 💡 **渐进式使用**：简单场景简单用，复杂场景有高级功能

---

## 结语

ArtForm 是一个**功能完善、易于使用、高度灵活**的表单组件，适合各种业务场景：

- ✅ 简单表单：快速配置，开箱即用
- ✅ 复杂表单：联动、验证、条件渲染
- ✅ 动态表单：运行时生成配置
- ✅ 自定义扩展：插槽、自定义组件
- ✅ **动态列表**：数组字段动态增删
- ✅ **表单分组**：长表单折叠展示
- ✅ **数据转换**：输入输出自动转换
- ✅ **关联验证**：依赖字段联动验证
- ✅ **用户提示**：tooltip 和 help 文本
- ✅ **智能重置**：清空（clear）和重置（reset）双重保障

**v2.0 新增 6 大核心功能，让表单开发更简单、更强大！** 🎉

**开始使用 ArtForm，让表单开发更简单！** 🚀
