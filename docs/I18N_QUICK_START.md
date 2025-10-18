# 🌍 国际化自动扫描 - 快速开始指南

> 基于 `i18next-scanner` 和 `vue-i18n` 的自动化国际化方案

## ✨ 功能特性

- ✅ 自动扫描代码中的 `$t()` 和 `t()` 标记
- ✅ 自动生成嵌套的 JSON 翻译文件
- ✅ 智能保留现有翻译，不会覆盖
- ✅ 支持中文和英文两种语言
- ✅ 自动按字母顺序排序
- ✅ 支持 Vue 模板和 TypeScript/JavaScript 文件

## 🚀 使用方法

### 第一步：在代码中标记需要翻译的文本

在 Vue 模板中使用 `$t()`：

```vue
<template>
  <div>
    <h1>{{ $t('topBar.user.userCenter') }}</h1>
    <el-button>{{ $t('common.confirm') }}</el-button>
  </div>
</template>
```

在 TypeScript/JavaScript 中使用：

```typescript
import { $t } from '@/locales'

const message = $t('common.success')

// 或使用 Composition API
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const title = t('topBar.search.title')
```

### 第二步：运行扫描命令

```bash
pnpm i18n:scan
```

### 第三步：补充翻译

扫描后会自动生成/更新翻译文件：

**src/locales/langs/zh.json:**

```json
{
  "topBar": {
    "user": {
      "userCenter": "个人中心"
    }
  },
  "common": {
    "confirm": "确定"
  }
}
```

**src/locales/langs/en.json:**

```json
{
  "topBar": {
    "user": {
      "userCenter": "User Center"
    }
  },
  "common": {
    "confirm": "Confirm"
  }
}
```

如果是新增的 key，默认会使用 key 本身作为占位符，需要手动修改为实际的翻译文本。

## 📝 命名规范

推荐使用以下命名规范：

```typescript
// 格式：模块.功能.具体内容
$t('topBar.user.userCenter') // 顶部栏 - 用户 - 个人中心
$t('common.cancel') // 通用 - 取消
$t('login.title') // 登录 - 标题
$t('table.searchBar.search') // 表格 - 搜索栏 - 搜索
```

## 📁 项目结构

```
art-design-pro/
├── src/
│   └── locales/
│       ├── index.ts              # i18n 配置
│       └── langs/
│           ├── zh.json           # 中文翻译
│           └── en.json           # 英文翻译
├── scripts/
│   ├── i18n-scan.ts              # 扫描脚本
│   ├── i18n-README.md            # 详细文档
│   └── i18n-example.md           # 使用示例
└── i18next-scanner.config.cjs    # 扫描配置
```

## ⚙️ 配置文件

### i18next-scanner.config.cjs

主要配置项：

```javascript
{
  input: ['src/**/*.{vue,ts,js}'],  // 扫描文件
  options: {
    func: { list: ['$t', 't'] },    // 扫描的函数名
    lngs: ['zh', 'en'],              // 支持的语言
    defaultLng: 'zh',                // 默认语言
    keySeparator: '.',               // key 分隔符
    removeUnusedKeys: false,         // 保留未使用的 key
    sort: true                       // 按字母排序
  }
}
```

## 🔧 高级功能

### 1. 智能合并现有翻译

扫描器会保留你手动添加的翻译，只添加新发现的 key，不会覆盖现有内容。

### 2. 自动创建嵌套结构

使用点分隔符会自动创建嵌套对象：

```typescript
$t('user.profile.name') // → { user: { profile: { name: "..." } } }
```

### 3. 支持多文件类型

- Vue 单文件组件 (`.vue`)
- TypeScript 文件 (`.ts`)
- JavaScript 文件 (`.js`)

## 💡 最佳实践

### ✅ 推荐做法

```typescript
// 1. 使用有意义的命名
$t('user.profile.editButton')

// 2. 按模块组织
$t('dashboard.welcome.title')
$t('dashboard.statistics.users')

// 3. 复用通用翻译
$t('common.confirm')
$t('common.cancel')
```

### ❌ 避免的做法

```typescript
// 1. 不要使用动态 key（无法被扫描）
$t(`user.${field}`)

// 2. 不要使用无意义的命名
$t('text1')
$t('msg')

// 3. 不要嵌套过深
$t('a.b.c.d.e.f.g') // 太深了
```

## 🔄 开发工作流

```bash
# 1. 开发新功能，添加翻译标记
vim src/views/my-feature/index.vue

# 2. 运行扫描
pnpm i18n:scan

# 3. 查看生成的翻译文件
vim src/locales/langs/zh.json
vim src/locales/langs/en.json

# 4. 补充翻译（将 key 替换为实际翻译）

# 5. 测试不同语言

# 6. 提交代码
git add .
git commit -m "feat: add i18n for my-feature"
```

## 📚 更多文档

- **详细文档**：`scripts/i18n-README.md`
- **使用示例**：`scripts/i18n-example.md`
- **vue-i18n 官方文档**：https://vue-i18n.intlify.dev/
- **i18next-scanner 文档**：https://github.com/i18next/i18next-scanner

## 🐛 故障排查

### 问题：扫描后翻译文件没有更新

**解决方法**：

1. 检查文件路径是否在 `input` 配置中
2. 确认使用的函数名是 `$t` 或 `t`
3. 确保翻译 key 是静态字符串（不能是变量）

### 问题：某些翻译被覆盖了

**解决方法**：

1. 检查配置文件中的 `flush` 函数
2. 确认 `removeUnusedKeys` 设置为 `false`
3. 使用 git 恢复被覆盖的翻译

### 问题：扫描速度很慢

**解决方法**：

1. 检查 `input` 配置，确保排除了 `node_modules`
2. 减少扫描的文件范围
3. 使用更具体的文件匹配模式

## 📞 获取帮助

如果遇到问题，可以：

1. 查看 `scripts/i18n-README.md` 详细文档
2. 查看 `scripts/i18n-example.md` 使用示例
3. 检查配置文件 `i18next-scanner.config.cjs`

---

**祝你使用愉快！** 🎉
