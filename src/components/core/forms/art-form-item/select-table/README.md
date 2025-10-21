# TableSelect 组件

表格下拉选择器组件，类似于 `el-select`，但下拉部分是一个完整的 `el-table`，支持单选和多选模式。

## 功能特性

- ✅ 外观与交互类似于 el-select 的可搜索下拉选择框
- ✅ 下拉部分是完整的 el-table，支持自定义列配置
- ✅ 支持单选和多选模式
- ✅ 单选模式显示单选框，多选模式显示复选框
- ✅ 输入框 focus 时不自动展开，输入内容触发搜索后自动展开
- ✅ 点击右侧箭头按钮切换下拉展开状态
- ✅ 选择表格行后赋值到输入框，输入框内容可修改
- ✅ 下拉框未显示时输入内容同样可以搜索
- ✅ 支持 v-model:value 双向绑定
- ✅ 防抖搜索逻辑
- ✅ 清空功能
- ✅ 样式与 el-select 保持一致

## 基础用法

### 单选模式

```vue
<template>
  <TableSelect
    v-model="userId"
    :columns="userColumns"
    :request="fetchUserList"
    value-key="id"
    label-key="name"
    placeholder="请选择用户"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import TableSelect from '@/components/core/forms/art-form-item/select-table/index.vue'

  const userId = ref('')

  const userColumns = [
    { label: '姓名', prop: 'name', width: 120 },
    { label: '部门', prop: 'dept', width: 150 },
    { label: '职位', prop: 'position' }
  ]

  const fetchUserList = async (query: string) => {
    // 模拟 API 请求
    const response = await fetch(`/api/users?search=${query}`)
    return response.json()
  }
</script>
```

### 多选模式

```vue
<template>
  <TableSelect
    v-model="userIds"
    :columns="userColumns"
    :request="fetchUserList"
    value-key="id"
    label-key="name"
    placeholder="请选择用户"
    multiple
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import TableSelect from '@/components/core/forms/art-form-item/select-table/index.vue'

  const userIds = ref([])

  const userColumns = [
    { label: '姓名', prop: 'name', width: 120 },
    { label: '部门', prop: 'dept', width: 150 },
    { label: '职位', prop: 'position' }
  ]

  const fetchUserList = async (query: string) => {
    const response = await fetch(`/api/users?search=${query}`)
    return response.json()
  }
</script>
```

### 在表单中使用（formSchema 配置）

```vue
<template>
  <BasicForm :schemas="formSchemas" />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import BasicForm from '@/components/core/forms/BasicForm.vue'

  const formSchemas = [
    {
      field: 'userId',
      label: '用户',
      component: 'TableSelect',
      componentProps: {
        columns: [
          { label: '姓名', prop: 'name', width: 120 },
          { label: '部门', prop: 'dept', width: 150 },
          { label: '邮箱', prop: 'email' }
        ],
        request: async (query: string) => {
          const response = await fetch(`/api/users?search=${query}`)
          return response.json()
        },
        valueKey: 'id',
        labelKey: 'name',
        placeholder: '请选择用户',
        multiple: false
      },
      rules: [{ required: true, message: '请选择用户' }]
    },
    {
      field: 'departmentIds',
      label: '部门',
      component: 'TableSelect',
      componentProps: {
        columns: [
          { label: '部门名称', prop: 'name' },
          { label: '部门编码', prop: 'code' },
          { label: '负责人', prop: 'manager' }
        ],
        request: async (query: string) => {
          const response = await fetch(`/api/departments?search=${query}`)
          return response.json()
        },
        valueKey: 'id',
        labelKey: 'name',
        placeholder: '请选择部门',
        multiple: true,
        tableHeight: 400
      }
    }
  ]
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值 | `any \| any[]` | - |
| columns | 表格列配置 | `TableColumn[]` | - |
| request | 异步请求函数 | `(query: string) => Promise<any[]>` | - |
| multiple | 是否多选 | `boolean` | `false` |
| valueKey | 数据的唯一标识字段 | `string` | `'id'` |
| labelKey | 数据的显示标签字段 | `string` | `'name'` |
| placeholder | 占位符 | `string` | `'请输入搜索'` |
| debounce | 搜索防抖延迟（毫秒） | `number` | `300` |
| minSearchLength | 最小搜索字符数 | `number` | `0` |
| tableProps | 透传给 el-table 的属性 | `object` | `{}` |
| tableHeight | 表格高度 | `string \| number` | `300` |
| pageSize | 每页显示条数 | `number` | `50` |
| emptyText | 空数据提示文本 | `string` | `'暂无数据'` |
| errorText | 加载失败提示文本 | `string` | `'加载失败'` |
| disabled | 是否禁用 | `boolean` | `false` |
| readonly | 是否只读 | `boolean` | `false` |
| clearable | 是否可清空 | `boolean` | `true` |
| size | 输入框尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
| popperWidth | 下拉框宽度 | `string \| number` | 同输入框宽度 |
| popperClass | popper 类名 | `string` | - |
| autoExpandOnInput | 是否在输入时自动展开下拉 | `boolean` | `true` |

## TableColumn 配置

| 参数      | 说明           | 类型                                     | 默认值   |
| --------- | -------------- | ---------------------------------------- | -------- |
| label     | 列标签         | `string`                                 | -        |
| prop      | 列属性名       | `string`                                 | -        |
| width     | 列宽度         | `string \| number`                       | -        |
| minWidth  | 最小宽度       | `string \| number`                       | -        |
| align     | 对齐方式       | `'left' \| 'center' \| 'right'`          | `'left'` |
| show      | 是否显示       | `boolean`                                | `true`   |
| formatter | 自定义渲染函数 | `(row, column, cellValue, index) => any` | -        |

## Events

| 事件名         | 说明             | 回调参数                |
| -------------- | ---------------- | ----------------------- |
| change         | 选中项变化       | `(value, selectedRows)` |
| search         | 搜索             | `(query)`               |
| load-success   | 加载成功         | `(data)`                |
| load-error     | 加载失败         | `(error)`               |
| clear          | 清空             | -                       |
| visible-change | 下拉显示状态变化 | `(visible)`             |

## Methods

通过 ref 可以访问以下方法：

| 方法名          | 说明                 | 参数              |
| --------------- | -------------------- | ----------------- |
| search          | 手动搜索             | `(query: string)` |
| refresh         | 刷新数据             | -                 |
| clear           | 清空选择             | -                 |
| getSelectedRows | 获取当前选中的行数据 | -                 |
| getValue        | 获取当前选中的值     | -                 |
| open            | 打开下拉             | -                 |
| close           | 关闭下拉             | -                 |
| toggle          | 切换下拉             | -                 |

## 高级用法

### 自定义列格式化

```vue
<template>
  <TableSelect v-model="userId" :columns="columns" :request="fetchUserList" />
</template>

<script setup lang="ts">
  const columns = [
    {
      label: '姓名',
      prop: 'name'
    },
    {
      label: '状态',
      prop: 'status',
      formatter: (row) => {
        return row.status === 1 ? '在职' : '离职'
      }
    },
    {
      label: '入职时间',
      prop: 'joinDate',
      formatter: (row) => {
        return new Date(row.joinDate).toLocaleDateString()
      }
    }
  ]
</script>
```

### 自定义表格高度和样式

```vue
<template>
  <TableSelect
    v-model="userId"
    :columns="columns"
    :request="fetchUserList"
    :table-height="500"
    popper-class="custom-table-select"
    :table-props="{
      stripe: true,
      border: true,
      showHeader: true
    }"
  />
</template>
```

### 自定义下拉框宽度

```vue
<template>
  <TableSelect
    v-model="userId"
    :columns="columns"
    :request="fetchUserList"
    :popper-width="600"
    placeholder="请选择用户"
  />

  <!-- 也支持字符串格式 -->
  <TableSelect
    v-model="userId"
    :columns="columns"
    :request="fetchUserList"
    popper-width="80%"
    placeholder="请选择用户"
  />
</template>

<script setup lang="ts">
  // popperWidth 默认值是输入框的宽度
  // 可以设置为：
  // 1. 数字：如 600，会被转换为 '600px'
  // 2. 字符串：如 '80%'、'500px'、'50vw' 等
</script>
```

### 使用 ref 调用方法

```vue
<template>
  <div>
    <TableSelect
      ref="tableSelectRef"
      v-model="userId"
      :columns="columns"
      :request="fetchUserList"
    />
    <el-button @click="handleRefresh">刷新</el-button>
    <el-button @click="handleClear">清空</el-button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const tableSelectRef = ref()

  const handleRefresh = () => {
    tableSelectRef.value?.refresh()
  }

  const handleClear = () => {
    tableSelectRef.value?.clear()
  }
</script>
```

## 注意事项

1. `request` 函数必须返回一个 Promise，resolve 的值应该是数组
2. `valueKey` 和 `labelKey` 必须是数据项中存在的字段
3. 多选模式下，v-model 绑定的值应该是数组
4. 输入框 focus 时不会自动展开下拉，只有在输入内容或点击箭头时才会展开
5. 下拉框使用 Teleport 渲染到 body，确保不会被父容器的 overflow 隐藏
