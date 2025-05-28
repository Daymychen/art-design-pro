# ArtSearchDate 日期选择器组件

一个功能丰富的日期选择器组件，支持多种日期选择类型。

## 功能特性

- ✅ **单日期选择** - 选择单个日期
- ✅ **日期时间选择** - 选择日期和时间
- ✅ **日期范围选择** - 选择日期范围
- ✅ **日期时间范围选择** - 选择日期时间范围
- ✅ **月份选择** - 选择月份
- ✅ **月份范围选择** - 选择月份范围
- ✅ **年份选择** - 选择年份
- ✅ **年份范围选择** - 选择年份范围
- ✅ **周选择** - 选择周
- ✅ **快捷选项** - 内置常用快捷选项
- ✅ **自定义配置** - 支持全面的自定义配置

## 使用示例

### 1. 单日期选择

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'date',
    label: '日期',
    type: 'date',
    config: {
      type: 'date',
      placeholder: '请选择日期'
    }
  }
]
```

### 2. 日期时间选择

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'datetime',
    label: '日期时间',
    type: 'datetime',
    config: {
      type: 'datetime',
      placeholder: '请选择日期时间'
    }
  }
]
```

### 3. 日期范围选择

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'daterange',
    label: '日期范围',
    type: 'daterange',
    config: {
      type: 'daterange',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      rangeSeparator: '至'
    }
  }
]
```

### 4. 日期时间范围选择

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'datetimerange',
    label: '日期时间范围',
    type: 'datetimerange',
    config: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间'
    }
  }
]
```

### 5. 月份选择

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'month',
    label: '月份',
    type: 'month',
    config: {
      type: 'month',
      placeholder: '请选择月份'
    }
  }
]
```

### 6. 月份范围选择

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'monthrange',
    label: '月份范围',
    type: 'monthrange',
    config: {
      type: 'monthrange',
      startPlaceholder: '开始月份',
      endPlaceholder: '结束月份'
    }
  }
]
```

### 7. 年份选择

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'year',
    label: '年份',
    type: 'year',
    config: {
      type: 'year',
      placeholder: '请选择年份'
    }
  }
]
```

### 8. 年份范围选择

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'yearrange',
    label: '年份范围',
    type: 'yearrange',
    config: {
      type: 'yearrange',
      startPlaceholder: '开始年份',
      endPlaceholder: '结束年份'
    }
  }
]
```

### 9. 周选择

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'week',
    label: '周',
    type: 'week',
    config: {
      type: 'week',
      placeholder: '请选择周'
    }
  }
]
```

## 高级配置

### 自定义快捷选项

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'daterange',
    label: '日期范围',
    type: 'daterange',
    config: {
      type: 'daterange',
      shortcuts: [
        {
          text: '今天',
          value: () => {
            const today = new Date()
            return [today, today]
          }
        },
        {
          text: '最近一周',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 6)
            return [start, end]
          }
        },
        {
          text: '最近一个月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            return [start, end]
          }
        }
      ]
    }
  }
]
```

### 禁用特定日期

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'date',
    label: '日期',
    type: 'date',
    config: {
      type: 'date',
      disabledDate: (time: Date) => {
        // 禁用今天之前的日期
        return time.getTime() < Date.now() - 8.64e7
      }
    }
  }
]
```

### 自定义格式

```typescript
const searchItems: SearchFormItem[] = [
  {
    prop: 'date',
    label: '日期',
    type: 'date',
    config: {
      type: 'date',
      format: 'DD/MM/YYYY',
      valueFormat: 'YYYY-MM-DD',
      placeholder: '请选择日期 (DD/MM/YYYY)'
    }
  }
]
```

## 配置选项

| 参数             | 说明           | 类型                              | 默认值           |
| ---------------- | -------------- | --------------------------------- | ---------------- |
| type             | 日期选择器类型 | `DatePickerType`                  | `'date'`         |
| format           | 显示格式       | `string`                          | 根据类型自动设置 |
| valueFormat      | 值格式         | `string`                          | 根据类型自动设置 |
| placeholder      | 占位符         | `string`                          | 自动生成         |
| startPlaceholder | 开始日期占位符 | `string`                          | 根据类型自动设置 |
| endPlaceholder   | 结束日期占位符 | `string`                          | 根据类型自动设置 |
| rangeSeparator   | 范围分隔符     | `string`                          | `'至'`           |
| clearable        | 是否可清空     | `boolean`                         | `true`           |
| disabled         | 是否禁用       | `boolean`                         | `false`          |
| readonly         | 是否只读       | `boolean`                         | `false`          |
| size             | 尺寸           | `'large' \| 'default' \| 'small'` | `'default'`      |
| shortcuts        | 快捷选项       | `Array`                           | 范围类型自动添加 |
| disabledDate     | 禁用日期函数   | `(time: Date) => boolean`         | -                |

## 内置快捷选项

对于日期范围和日期时间范围选择，组件会自动添加以下快捷选项：

- 今天
- 昨天
- 最近7天
- 最近30天
- 本月
- 上月

## 返回值类型

根据不同的选择器类型，组件会返回不同格式的值：

- **单日期/时间类型**: `string | Date | null`
- **范围类型**: `[string, string] | [Date, Date] | null`
- **周类型**: `string` (格式: YYYY-MM-DD，表示该周的第一天)
