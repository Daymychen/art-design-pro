# API Select 组件

简洁高效的异步数据选择器组件。

## 🚀 核心功能

| #   | 功能              | 说明                                                     |
| --- | ----------------- | -------------------------------------------------------- |
| 1   | **防抖支持**      | 使用 VueUse `useDebounceFn` 实现真正的防抖，避免频繁请求 |
| 2   | **选项显示优化**  | 完善的空状态、加载状态、错误状态UI                       |
| 3   | **远程搜索**      | 支持防抖搜索，适用于大数据量场景                         |
| 4   | **依赖其他字段**  | 参数变化自动刷新（带防抖），完美支持级联选择             |
| 5   | **选项前置/后置** | 灵活插入固定选项（如"全部"、"请选择"等）                 |

## 📦 文件结构

```
api-select/
├── index.vue          # 主组件（184 行）
├── types.ts           # 类型定义（121 行）
├── useRemote.ts       # 远程搜索（75 行）
├── useOptions.ts      # 选项处理（115 行）
├── useApiSelect.ts    # 核心逻辑（217 行）
├── presets.ts         # 配置预设（63 行）
└── README.md          # 文档

总计：约 775 行代码
```

## 🎯 快速开始

### 基础用法

```vue
<template>
  <ApiSelect v-model="userId" :api="fetchUserList" placeholder="请选择用户" />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { fetchUserList } from '@/api/user'

  const userId = ref('')
</script>
```

### 在 ArtForm 中使用

```typescript
import { fetchGetGenderOptions } from '@/api/system-manage'

const formItems: FormItem[] = [
  {
    key: 'gender',
    label: '性别',
    type: 'api-select',
    span: 12,
    props: {
      placeholder: '请选择性别',
      api: fetchGetGenderOptions,
      labelField: 'label',
      valueField: 'value',
      dataPath: 'data'
    }
  }
]
```

## 🔧 Props 配置

### 基础配置

| 参数         | 说明         | 类型                               | 默认值    |
| ------------ | ------------ | ---------------------------------- | --------- |
| `api`        | 异步请求函数 | `(...args: any[]) => Promise<any>` | -         |
| `params`     | 请求参数     | `Record<string, any> \| any[]`     | `{}`      |
| `labelField` | label 字段名 | `string`                           | `'label'` |
| `valueField` | value 字段名 | `string`                           | `'value'` |
| `dataPath`   | 响应数据路径 | `string`                           | `'data'`  |

### 加载控制

| 参数        | 说明             | 类型                               | 默认值      |
| ----------- | ---------------- | ---------------------------------- | ----------- |
| `immediate` | 是否立即加载     | `boolean`                          | `true`      |
| `loadOn`    | 加载时机         | `'mounted' \| 'focus' \| 'manual'` | `'mounted'` |
| `debounce`  | 防抖延迟（毫秒） | `number`                           | `300`       |

### 数据处理

| 参数        | 说明         | 类型                          | 默认值 |
| ----------- | ------------ | ----------------------------- | ------ |
| `transform` | 数据转换函数 | `(data: any) => OptionItem[]` | -      |

### 选项配置

| 参数             | 说明     | 类型           | 默认值 |
| ---------------- | -------- | -------------- | ------ |
| `prependOptions` | 前置选项 | `OptionItem[]` | -      |
| `appendOptions`  | 后置选项 | `OptionItem[]` | -      |

### 远程搜索

| 参数              | 说明                 | 类型      | 默认值      |
| ----------------- | -------------------- | --------- | ----------- |
| `remote`          | 是否支持远程搜索     | `boolean` | `false`     |
| `remoteQueryKey`  | 搜索参数 key         | `string`  | `'keyword'` |
| `remoteDebounce`  | 搜索防抖延迟（毫秒） | `number`  | `300`       |
| `remoteMinLength` | 触发搜索的最小字符数 | `number`  | `0`         |

### 显示配置

| 参数          | 说明             | 类型     | 默认值       |
| ------------- | ---------------- | -------- | ------------ |
| `emptyText`   | 空数据提示文本   | `string` | `'暂无数据'` |
| `loadingText` | 加载中提示文本   | `string` | -            |
| `errorText`   | 加载失败提示文本 | `string` | `'加载失败'` |

## 📡 Events

| 事件名           | 说明         | 参数                      |
| ---------------- | ------------ | ------------------------- |
| `load-success`   | 数据加载成功 | `(data: OptionItem[])`    |
| `load-error`     | 数据加载失败 | `(error: any)`            |
| `load-start`     | 开始加载数据 | -                         |
| `load-end`       | 结束加载数据 | -                         |
| `remote-search`  | 远程搜索     | `(query: string)`         |
| `options-change` | 选项变化     | `(options: OptionItem[])` |

## 📋 Methods（通过 ref 调用）

| 方法名                        | 说明               | 参数            | 返回值                    |
| ----------------------------- | ------------------ | --------------- | ------------------------- |
| `refresh()`                   | 刷新数据           | -               | `Promise<void>`           |
| `loadData()`                  | 手动加载数据       | -               | `Promise<void>`           |
| `getOptions()`                | 获取当前选项列表   | -               | `OptionItem[]`            |
| `clearOptions()`              | 清空选项           | -               | `void`                    |
| `retry()`                     | 手动重试           | -               | `Promise<void>`           |
| `search(query)`               | 远程搜索           | `query: string` | `Promise<void>`           |
| `findOptionByValue(value)`    | 根据值查找选项     | `value: any`    | `OptionItem \| undefined` |
| `findOptionsByValues(values)` | 根据多个值查找选项 | `values: any[]` | `OptionItem[]`            |

## 🎨 使用场景

### 1. 基础选择器

```vue
<ApiSelect v-model="userId" :api="fetchUserList" placeholder="请选择用户" />
```

### 2. 远程搜索

```vue
<ApiSelect
  v-model="userId"
  :api="searchUsers"
  remote
  :remote-debounce="500"
  :remote-min-length="2"
  placeholder="请输入搜索关键词"
/>
```

### 3. 带前置选项

```vue
<ApiSelect
  v-model="status"
  :api="fetchStatusList"
  :prepend-options="[{ label: '全部', value: '' }]"
  placeholder="请选择状态"
/>
```

### 4. 自定义数据转换

```vue
<ApiSelect
  v-model="cityId"
  :api="fetchCityList"
  :transform="
    (data) =>
      data.map((city) => ({
        label: city.cityName,
        value: city.cityId,
        disabled: !city.available
      }))
  "
  placeholder="请选择城市"
/>
```

### 5. 级联选择（依赖其他字段）

```vue
<template>
  <div>
    <ElSelect v-model="provinceId" placeholder="请选择省份">
      <!-- 省份选项 -->
    </ElSelect>

    <ApiSelect
      v-model="cityId"
      :api="fetchCityList"
      :params="{ provinceId }"
      placeholder="请选择城市"
    />
  </div>
</template>

<script setup lang="ts">
  // provinceId 变化时，会自动刷新城市列表（带防抖）
  const provinceId = ref('')
  const cityId = ref('')
</script>
```

### 6. 手动触发加载

```vue
<template>
  <div>
    <ApiSelect
      ref="selectRef"
      v-model="deptId"
      :api="fetchDeptList"
      load-on="manual"
      placeholder="请选择部门"
    />

    <ElButton @click="handleLoad">加载数据</ElButton>
  </div>
</template>

<script setup lang="ts">
  const selectRef = ref()
  const deptId = ref('')

  const handleLoad = () => {
    selectRef.value?.loadData()
  }
</script>
```

### 7. 使用预设配置

```typescript
import { remotePreset } from '@/components/core/forms/art-form-item/api-select/presets'

const formItems: FormItem[] = [
  {
    key: 'userId',
    label: '用户',
    type: 'api-select',
    props: {
      ...remotePreset,
      api: searchUsers,
      placeholder: '请搜索用户'
    }
  }
]
```

## 🎁 预设配置

### 1. basicPreset - 基础预设

```typescript
{
  immediate: true,
  loadOn: 'mounted',
  labelField: 'label',
  valueField: 'value',
  dataPath: 'data',
  debounce: 300
}
```

### 2. remotePreset - 远程搜索预设

```typescript
{
  ...basicPreset,
  remote: true,
  remoteQueryKey: 'keyword',
  remoteDebounce: 300,
  remoteMinLength: 1
}
```

## 🔥 高级技巧

### 1. 响应数据结构处理

```vue
<ApiSelect
  v-model="id"
  :api="fetchData"
  data-path="result.list"
  label-field="name"
  value-field="id"
/>
```

支持的 `dataPath` 格式：

- `'data'` → `response.data`
- `'result.list'` → `response.result.list`
- `'data.items'` → `response.data.items`

### 2. 复杂数据转换

```vue
<ApiSelect
  v-model="id"
  :api="fetchData"
  :transform="
    (data) =>
      data.map((item) => ({
        label: `${item.name} (${item.code})`,
        value: item.id,
        disabled: item.status !== 'active'
      }))
  "
/>
```

### 3. 监听数据加载

```vue
<ApiSelect
  v-model="id"
  :api="fetchData"
  @load-start="handleLoadStart"
  @load-success="handleLoadSuccess"
  @load-error="handleLoadError"
  @options-change="handleOptionsChange"
/>
```

### 4. 多选模式

```vue
<ApiSelect
  v-model="ids"
  :api="fetchData"
  multiple
  collapse-tags
  :max-collapse-tags="3"
  placeholder="请选择（可多选）"
/>
```

## ⚠️ 注意事项

### 1. API 函数规范

API 函数必须返回 Promise：

```typescript
// ✅ 正确
const fetchData = async (params: any) => {
  return await request.get('/api/list', { params })
}

// ❌ 错误（不是 Promise）
const fetchData = (params: any) => {
  return { data: [] }
}
```

### 2. 参数变化自动刷新

当 `params` 发生变化时，组件会**自动刷新数据**（带防抖）：

```vue
<ApiSelect v-model="cityId" :api="fetchCityList" :params="{ provinceId }" />
```

### 3. dataPath 路径说明

- 支持点号分隔的路径：`'data'`、`'data.list'`、`'result.items'`
- 如果路径不存在，会返回空数组

## 🎯 性能优化建议

### 1. 合理使用防抖

```vue
<!-- 快速响应 -->
<ApiSelect remote :remote-debounce="200" />

<!-- 平衡性能 -->
<ApiSelect remote :remote-debounce="300" />

<!-- 减少请求 -->
<ApiSelect remote :remote-debounce="500" />
```

### 2. 限制搜索最小字符数

```vue
<ApiSelect remote :remote-min-length="2" placeholder="请输入至少2个字符" />
```

### 3. 使用 loadOn 控制加载时机

```vue
<ApiSelect :api="fetchData" load-on="focus" placeholder="点击后加载数据" />
```

## 📄 许可

MIT License
