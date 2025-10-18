# Element Plus CSS 变量速查表

## 🎨 主题色系

### 基础颜色

```css
--el-color-primary          /* 主色 */
--el-color-success          /* 成功色 */
--el-color-warning          /* 警告色 */
--el-color-danger           /* 危险色 */
--el-color-error            /* 错误色 */
--el-color-info             /* 信息色 */
```

### 颜色渐变（light-1 到 light-9，越大越浅）

```css
--el-color-primary-light-3
--el-color-primary-light-5
--el-color-primary-light-7
--el-color-primary-light-9
--el-color-primary-dark-2   /* 深色变体 */
```

### 所有颜色都有对应的深浅变体

```css
--el-color-success-light-3
--el-color-success-light-5
--el-color-success-light-7
--el-color-success-light-9
--el-color-success-dark-2
```

## 📝 文字颜色

```css
--el-text-color-primary      /* 主要文字 */
--el-text-color-regular      /* 常规文字 */
--el-text-color-secondary    /* 次要文字 */
--el-text-color-placeholder  /* 占位文字 */
--el-text-color-disabled     /* 禁用文字 */
```

## 🎭 边框颜色

```css
--el-border-color             /* 基础边框 */
--el-border-color-light       /* 浅色边框 */
--el-border-color-lighter     /* 更浅边框 */
--el-border-color-extra-light /* 极浅边框 */
--el-border-color-dark        /* 深色边框 */
--el-border-color-darker      /* 更深边框 */
```

## 🎪 背景颜色

```css
--el-bg-color                 /* 基础背景 */
--el-bg-color-page            /* 页面背景 */
--el-bg-color-overlay         /* 遮罩背景 */
--el-fill-color               /* 填充色 */
--el-fill-color-light         /* 浅填充色 */
--el-fill-color-lighter       /* 更浅填充色 */
--el-fill-color-extra-light   /* 极浅填充色 */
--el-fill-color-dark          /* 深填充色 */
--el-fill-color-darker        /* 更深填充色 */
--el-fill-color-blank         /* 空白填充色 */
```

## 🔲 组件特定变量

### Button

```css
--el-button-text-color
--el-button-bg-color
--el-button-border-color
--el-button-hover-text-color
--el-button-hover-bg-color
--el-button-hover-border-color
--el-button-active-color
--el-button-disabled-text-color
--el-button-disabled-bg-color
--el-button-disabled-border-color
```

### Input

```css
--el-input-text-color
--el-input-border-color
--el-input-hover-border-color
--el-input-focus-border-color
--el-input-bg-color
--el-input-placeholder-color
--el-input-disabled-bg-color
--el-input-disabled-border-color
```

### Select / Dropdown

```css
--el-select-border-color-hover
--el-select-disabled-border
--el-select-input-focus-border-color
--el-dropdown-menu-box-shadow
```

### Dialog / Popup

```css
--el-dialog-bg-color
--el-popup-modal-bg-color
--el-mask-color
--el-mask-color-extra-light
```

## 🌈 常用场景示例

### 表单验证状态

```css
/* 成功状态 */
color: var(--el-color-success);
border-color: var(--el-color-success);
background-color: var(--el-color-success-light-9);

/* 错误状态 */
color: var(--el-color-danger);
border-color: var(--el-color-danger);
background-color: var(--el-color-danger-light-9);

/* 警告状态 */
color: var(--el-color-warning);
border-color: var(--el-color-warning);
background-color: var(--el-color-warning-light-9);

/* 信息状态 */
color: var(--el-color-info);
border-color: var(--el-color-info);
background-color: var(--el-color-info-light-9);
```

### 悬停效果

```css
.my-element {
  color: var(--el-text-color-regular);
  background-color: var(--el-fill-color-blank);

  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-fill-color-light);
  }
}
```

### 卡片样式

```css
.my-card {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  box-shadow: var(--el-box-shadow-light);
}
```

## 💡 快速查找技巧

### 1. 浏览器开发者工具

```
F12 → Elements → Styles → 查看 :root 变量
```

### 2. VS Code 智能提示

安装 CSS Variable Autocomplete 插件后，输入 `--el-` 会自动提示

### 3. 控制台查看所有变量

```javascript
// 在浏览器控制台执行
const styles = getComputedStyle(document.documentElement)
const elVars = Array.from(document.styleSheets)
  .flatMap((sheet) => Array.from(sheet.cssRules || []))
  .filter((rule) => rule.selectorText === ':root')
  .flatMap((rule) => Array.from(rule.style))
  .filter((prop) => prop.startsWith('--el-'))
console.log(elVars)
```

### 4. 查看本地文件

```bash
# 查看 Element Plus 源码中的变量定义
cat node_modules/element-plus/theme-chalk/src/common/var.scss
```

## 🎯 项目自定义变量

本项目还定义了自己的变量系统（在 `src/assets/styles/variables.scss`）：

### Art Design 自定义颜色

```css
/* 主题色 */
--art-primary: 93, 135, 255;
--art-secondary: 73, 190, 255;
--art-error: 250, 137, 107;
--art-info: 107, 125, 155;
--art-success: 19, 222, 185;
--art-warning: 255, 174, 31;
--art-danger: 255, 77, 79;

/* 使用方式（RGB 格式） */
color: rgb(var(--art-primary));
background-color: rgba(var(--art-primary), 0.1);

/* 背景色 */
--art-bg-primary: 236, 242, 255;
--art-bg-secondary: 232, 247, 255;
--art-bg-success: 230, 255, 250;
/* ... 更多见 variables.scss */

/* 灰度色 */
--art-gray-100 到 --art-gray-900
--art-text-gray-100 到 --art-text-gray-900

/* 边框 */
--art-border-color
--art-border-dashed-color
--art-root-card-border-color

/* 阴影 */
--art-box-shadow-xs
--art-box-shadow-sm
--art-box-shadow
--art-box-shadow-lg
```

## 📚 参考资源

- [Element Plus 官方主题文档](https://element-plus.org/zh-CN/guide/theming.html)
- [Element Plus Design Tokens](https://element-plus.org/zh-CN/guide/design.html)
- [CSS Variables MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)

---

**提示**: 使用浏览器开发者工具是最直观的方法，可以实时看到每个变量的实际效果！
