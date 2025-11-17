# c-form 表单依赖功能使用指南

本指南介绍 c-form 组件的依赖联动功能，包括 `dependencies` 和 `onDepChange` 的使用方法。

---

## 📖 目录

- [功能概述](#功能概述)
- [功能 1: onDepChange 回调](#功能-1-ondependencychange-回调)
- [功能 2: API Select 依赖联动](#功能-2-api-select-依赖联动)
- [FormApi 参考](#formapi-参考)
- [完整示例](#完整示例)

---

## 功能概述

### 新增功能

1. **onDepChange 回调**
   - 当依赖字段变化时，自动触发回调函数
   - 回调函数接收 `formApi` 参数，可以操作表单
   - 适用于复杂的表单联动逻辑

2. **API Select 依赖联动**
   - api-select 组件支持依赖其他字段
   - 当依赖字段变化时，自动重新请求数据
   - 通过 `paramsMapping` 将依赖字段值映射到请求参数

---

## 功能 1: onDepChange 回调

### 基本用法

当依赖字段变化时，触发自定义逻辑。

```vue
<template>
  <ArtForm v-model="formData" :items="formItems" />
</template>

<script setup lang="ts">
  import type { FormItem, DepChangeParams } from '@/types/component/form'

  const formData = ref({
    age: 0,
    category: ''
  })

  const formItems: FormItem[] = [
    {
      key: 'age',
      label: '年龄',
      type: 'number'
    },
    {
      key: 'category',
      label: '分类',
      type: 'input',
      dependencies: ['age'], // 依赖 age 字段
      onDepChange: ({ formApi, changedKey, changedValue }: DepChangeParams) => {
        // 当 age 变化时，自动设置 category
        if (changedKey === 'age') {
          if (changedValue < 18) {
            formApi.setFieldValue('category', '未成年')
          } else if (changedValue < 60) {
            formApi.setFieldValue('category', '成年人')
          } else {
            formApi.setFieldValue('category', '老年人')
          }
        }
      }
    }
  ]
</script>
```

### 多字段依赖

一个字段可以依赖多个字段：

```typescript
{
  key: 'totalPrice',
  label: '总价',
  type: 'number',
  dependencies: ['quantity', 'unitPrice'], // 依赖多个字段
  onDepChange: ({ formApi, changedKey, changedValue }: DepChangeParams) => {
    // 当数量或单价变化时，自动计算总价
    const quantity = formApi.getFieldValue('quantity') || 0
    const unitPrice = formApi.getFieldValue('unitPrice') || 0
    formApi.setFieldValue('totalPrice', quantity * unitPrice)
  }
}
```

### 条件逻辑

根据依赖字段的值，执行不同的逻辑：

```typescript
{
  key: 'address',
  label: '详细地址',
  type: 'input',
  dependencies: ['needsShipping'],
  onDepChange: ({ formApi, changedKey, changedValue }: DepChangeParams) => {
    if (changedKey === 'needsShipping') {
      if (!changedValue) {
        // 如果不需要配送，清空地址
        formApi.setFieldValue('address', '')
      }
    }
  }
}
```

---

## 功能 2: API Select 依赖联动

### 基本用法

当 A 字段变化时，B 字段（api-select）自动重新请求数据。

```vue
<template>
  <ArtForm v-model="formData" :items="formItems" />
</template>

<script setup lang="ts">
  import type { FormItem } from '@/types/component/form'
  import { getCityList } from '@/api/region'

  const formData = ref({
    province: '',
    city: ''
  })

  const formItems: FormItem[] = [
    {
      key: 'province',
      label: '省份',
      type: 'api-select',
      props: {
        api: getProvinceList,
        labelField: 'name',
        valueField: 'code'
      }
    },
    {
      key: 'city',
      label: '城市',
      type: 'api-select',
      dependencies: ['province'], // 依赖省份字段
      props: {
        api: getCityList,
        labelField: 'name',
        valueField: 'code',
        // 将省份代码映射到请求参数
        paramsMapping: (formData: Record<string, any>) => ({
          provinceCode: formData.province
        })
      },
      onDepChange: ({ formApi, changedKey, changedValue }) => {
        // 省份变化时，清空城市选择
        if (changedKey === 'province') {
          formApi.setFieldValue('city', '')
          // 触发城市选择器重新加载
          const cityInstance = formApi.getFieldInstance('city')
          if (cityInstance?.refresh) {
            cityInstance.refresh()
          }
        }
      }
    }
  ]
</script>
```

### paramsMapping 详解

`paramsMapping` 函数接收整个表单数据，返回要传递给 API 的参数：

```typescript
{
  key: 'district',
  label: '区县',
  type: 'api-select',
  dependencies: ['province', 'city'], // 依赖省份和城市
  props: {
    api: getDistrictList,
    labelField: 'name',
    valueField: 'code',
    paramsMapping: (formData) => {
      // 可以访问整个表单数据
      return {
        provinceCode: formData.province,
        cityCode: formData.city,
        // 还可以添加其他参数
        includeStreets: true
      }
    }
  },
  onDepChange: ({ formApi, changedKey }) => {
    // 当省份或城市变化时，清空区县并重新加载
    formApi.setFieldValue('district', '')
    const instance = formApi.getFieldInstance('district')
    instance?.refresh()
  }
}
```

### 复杂场景：三级联动

省份 -> 城市 -> 区县 三级联动：

```typescript
const formItems: FormItem[] = [
  {
    key: 'province',
    label: '省份',
    type: 'api-select',
    props: {
      api: getProvinceList,
      labelField: 'name',
      valueField: 'code'
    }
  },
  {
    key: 'city',
    label: '城市',
    type: 'api-select',
    dependencies: ['province'],
    props: {
      api: getCityList,
      labelField: 'name',
      valueField: 'code',
      paramsMapping: (formData) => ({
        provinceCode: formData.province
      })
    },
    onDepChange: ({ formApi, changedKey }) => {
      if (changedKey === 'province') {
        // 省份变化时，清空城市和区县
        formApi.setFieldValue('city', '')
        formApi.setFieldValue('district', '')
        // 重新加载城市数据
        formApi.getFieldInstance('city')?.refresh()
      }
    }
  },
  {
    key: 'district',
    label: '区县',
    type: 'api-select',
    dependencies: ['city'],
    props: {
      api: getDistrictList,
      labelField: 'name',
      valueField: 'code',
      paramsMapping: (formData) => ({
        cityCode: formData.city
      })
    },
    onDepChange: ({ formApi, changedKey }) => {
      if (changedKey === 'city') {
        // 城市变化时，清空区县
        formApi.setFieldValue('district', '')
        // 重新加载区县数据
        formApi.getFieldInstance('district')?.refresh()
      }
    }
  }
]
```

### 多依赖联动

B 依赖于 A1 和 A2，当任一变化时都触发重新加载：

```typescript
{
  key: 'products',
  label: '产品列表',
  type: 'api-select',
  dependencies: ['category', 'brand'], // 依赖分类和品牌
  props: {
    api: getProductList,
    labelField: 'name',
    valueField: 'id',
    paramsMapping: (formData) => ({
      categoryId: formData.category,
      brandId: formData.brand
    })
  },
  onDepChange: ({ formApi, changedKey }) => {
    // 分类或品牌变化时，清空产品选择并重新加载
    formApi.setFieldValue('products', '')
    formApi.getFieldInstance('products')?.refresh()
  }
}
```

---

## FormApi 参考

`onDepChange` 回调函数的第一个参数是 `FormApi` 实例，提供以下方法：

### setFieldValue

设置字段值。

```typescript
formApi.setFieldValue('city', 'beijing')
```

### getFieldValue

获取字段值。

```typescript
const city = formApi.getFieldValue('city')
```

### getFormData

获取整个表单数据（返回副本）。

```typescript
const allData = formApi.getFormData()
console.log(allData) // { province: 'beijing', city: 'haidian', ... }
```

### validateField

验证指定字段。

```typescript
// 验证单个字段
await formApi.validateField('city')

// 验证多个字段
await formApi.validateField(['city', 'district'])
```

### clearValidate

清空字段验证。

```typescript
// 清空单个字段
formApi.clearValidate('city')

// 清空多个字段
formApi.clearValidate(['city', 'district'])

// 清空所有字段
formApi.clearValidate()
```

### resetFields

重置字段到初始值。

```typescript
// 重置单个字段
formApi.resetFields('city')

// 重置多个字段
formApi.resetFields(['city', 'district'])

// 重置所有字段
formApi.resetFields()
```

### getFieldInstance

获取字段组件实例，可以调用组件的方法（如 api-select 的 `refresh`）。

```typescript
const citySelectInstance = formApi.getFieldInstance('city')

// 调用 api-select 的方法
if (citySelectInstance) {
  citySelectInstance.refresh() // 刷新数据
  citySelectInstance.clearOptions() // 清空选项
  citySelectInstance.loadData() // 重新加载
}
```

---

## 完整示例

### 示例 1: 商品管理表单

```vue
<template>
  <ArtForm v-model="formData" :items="formItems" label-width="100px" />
</template>

<script setup lang="ts">
  import type { FormItem } from '@/types/component/form'
  import { getCategoryList, getBrandList, getProductList } from '@/api/product'

  const formData = ref({
    category: '',
    brand: '',
    product: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0
  })

  const formItems: FormItem[] = [
    {
      key: 'category',
      label: '分类',
      type: 'api-select',
      required: true,
      props: {
        api: getCategoryList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择分类'
      }
    },
    {
      key: 'brand',
      label: '品牌',
      type: 'api-select',
      required: true,
      dependencies: ['category'],
      props: {
        api: getBrandList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请先选择分类',
        paramsMapping: (formData) => ({
          categoryId: formData.category
        })
      },
      onDepChange: ({ formApi, changedKey }) => {
        if (changedKey === 'category') {
          // 分类变化时，清空品牌和产品
          formApi.setFieldValue('brand', '')
          formApi.setFieldValue('product', '')
          // 重新加载品牌数据
          formApi.getFieldInstance('brand')?.refresh()
        }
      }
    },
    {
      key: 'product',
      label: '产品',
      type: 'api-select',
      required: true,
      dependencies: ['category', 'brand'],
      props: {
        api: getProductList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请先选择分类和品牌',
        paramsMapping: (formData) => ({
          categoryId: formData.category,
          brandId: formData.brand
        })
      },
      onDepChange: ({ formApi, changedKey }) => {
        if (changedKey === 'category' || changedKey === 'brand') {
          // 分类或品牌变化时，清空产品并重新加载
          formApi.setFieldValue('product', '')
          formApi.getFieldInstance('product')?.refresh()
        }
      }
    },
    {
      key: 'quantity',
      label: '数量',
      type: 'number',
      required: true,
      props: {
        min: 1,
        max: 999
      }
    },
    {
      key: 'unitPrice',
      label: '单价',
      type: 'number',
      required: true,
      props: {
        min: 0,
        precision: 2
      }
    },
    {
      key: 'totalPrice',
      label: '总价',
      type: 'number',
      readonly: true,
      dependencies: ['quantity', 'unitPrice'],
      onDepChange: ({ formApi }) => {
        // 自动计算总价
        const quantity = formApi.getFieldValue('quantity') || 0
        const unitPrice = formApi.getFieldValue('unitPrice') || 0
        formApi.setFieldValue('totalPrice', quantity * unitPrice)
      }
    }
  ]
</script>
```

### 示例 2: 用户注册表单

```vue
<template>
  <ArtForm ref="formRef" v-model="formData" :items="formItems" label-width="120px" />
  <ElButton type="primary" @click="handleSubmit">提交</ElButton>
</template>

<script setup lang="ts">
  import type { FormItem } from '@/types/component/form'
  import { getProvinceList, getCityList } from '@/api/region'

  const formRef = ref()
  const formData = ref({
    userType: 'personal',
    companyName: '',
    province: '',
    city: '',
    age: 0,
    ageCategory: ''
  })

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
      hidden: (formData) => formData.userType !== 'company',
      dependencies: ['userType'],
      required: true,
      onDepChange: ({ formApi, changedKey, changedValue }) => {
        // 切换到个人用户时，清空企业名称
        if (changedKey === 'userType' && changedValue === 'personal') {
          formApi.setFieldValue('companyName', '')
        }
      }
    },
    {
      key: 'province',
      label: '省份',
      type: 'api-select',
      required: true,
      props: {
        api: getProvinceList,
        labelField: 'name',
        valueField: 'code'
      }
    },
    {
      key: 'city',
      label: '城市',
      type: 'api-select',
      required: true,
      dependencies: ['province'],
      props: {
        api: getCityList,
        labelField: 'name',
        valueField: 'code',
        paramsMapping: (formData) => ({
          provinceCode: formData.province
        })
      },
      onDepChange: ({ formApi, changedKey }) => {
        if (changedKey === 'province') {
          formApi.setFieldValue('city', '')
          formApi.getFieldInstance('city')?.refresh()
        }
      }
    },
    {
      key: 'age',
      label: '年龄',
      type: 'number',
      required: true,
      props: {
        min: 0,
        max: 120
      }
    },
    {
      key: 'ageCategory',
      label: '年龄段',
      type: 'input',
      readonly: true,
      dependencies: ['age'],
      onDepChange: ({ formApi, changedKey, changedValue }) => {
        if (changedKey === 'age') {
          let category = ''
          if (changedValue < 18) {
            category = '未成年'
          } else if (changedValue < 35) {
            category = '青年'
          } else if (changedValue < 60) {
            category = '中年'
          } else {
            category = '老年'
          }
          formApi.setFieldValue('ageCategory', category)
        }
      }
    }
  ]

  const handleSubmit = async () => {
    try {
      await formRef.value?.validate()
      console.log('表单数据:', formData.value)
      // 提交逻辑...
    } catch (error) {
      console.log('验证失败')
    }
  }
</script>
```

---

## 最佳实践

### 1. 依赖字段变化时清空当前字段

```typescript
onDepChange: ({ formApi, changedKey }) => {
  // 先清空当前字段值
  formApi.setFieldValue('currentField', '')

  // 再执行其他逻辑
  formApi.getFieldInstance('currentField')?.refresh()
}
```

### 2. 多依赖字段时判断具体变化的字段

```typescript
dependencies: ['field1', 'field2'],
onDepChange: ({ formApi, changedKey, changedValue }) => {
  if (changedKey === 'field1') {
    // field1 变化的逻辑
  } else if (changedKey === 'field2') {
    // field2 变化的逻辑
  }
}
```

### 3. 使用 paramsMapping 构建动态参数

```typescript
props: {
  paramsMapping: (formData) => {
    const params: any = {}

    // 只在有值时添加参数
    if (formData.province) {
      params.provinceCode = formData.province
    }
    if (formData.category) {
      params.categoryId = formData.category
    }

    return params
  }
}
```

### 4. 避免循环依赖

❌ **错误示例**（循环依赖）：

```typescript
// A 依赖 B
{
  key: 'fieldA',
  dependencies: ['fieldB'],
  onDepChange: ({ formApi }) => {
    formApi.setFieldValue('fieldB', 'xxx') // 错误！会导致无限循环
  }
}

// B 依赖 A
{
  key: 'fieldB',
  dependencies: ['fieldA'],
  onDepChange: ({ formApi }) => {
    formApi.setFieldValue('fieldA', 'xxx') // 错误！会导致无限循环
  }
}
```

✅ **正确示例**（单向依赖）：

```typescript
// A 是独立字段
{
  key: 'fieldA',
  type: 'select'
}

// B 依赖 A，但不修改 A
{
  key: 'fieldB',
  dependencies: ['fieldA'],
  onDepChange: ({ formApi, changedKey }) => {
    const valueA = formApi.getFieldValue('fieldA')
    // 根据 A 的值更新 B，但不修改 A
    formApi.setFieldValue('fieldB', `based on ${valueA}`)
  }
}
```

---

## 总结

### 功能对比

| 功能                         | 用途                      | 适用场景                   |
| ---------------------------- | ------------------------- | -------------------------- |
| `dependencies`               | 声明字段依赖关系          | 所有依赖场景               |
| `onDepChange`                | 依赖字段变化时的回调      | 复杂联动逻辑、计算字段     |
| `paramsMapping`              | 将表单数据映射到 API 参数 | api-select 依赖请求        |
| `formApi.getFieldInstance()` | 获取组件实例              | 调用组件方法（如 refresh） |

### 核心优势

✅ **声明式配置**：通过配置实现复杂的表单联动，无需手写 watch  
✅ **类型安全**：完整的 TypeScript 支持  
✅ **性能优化**：自动去抖，避免频繁请求  
✅ **灵活强大**：支持任意复杂的联动逻辑  
✅ **无需修改 api-select**：通过 c-form 的能力实现，保持组件独立性

---

## 参考

- [c-form README](./README.md)
- [api-select README](../art-form-item/api-select/README.md)
- [vben-admin 表单联动文档](https://doc.vben.pro/guide/components/form.html#%E5%AD%97%E6%AE%B5%E8%81%94%E5%8A%A8)
