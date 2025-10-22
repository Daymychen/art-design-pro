# VXE Table 示例页面

本示例展示了如何在项目中使用 VXE Table 组件库。

## 功能特性

### 基础功能

- ✅ 表格数据展示
- ✅ 复选框选择
- ✅ 行内编辑
- ✅ 增删改查操作
- ✅ 自定义列渲染
- ✅ 固定列
- ✅ 分页功能

### 高级功能

- ✅ 排序功能（支持多列排序）
- ✅ 筛选功能
- ✅ 数据导出（CSV 格式）
- ✅ 打印功能
- ✅ 响应式列宽
- ✅ 自定义单元格样式

## 已安装的依赖

```json
{
  "vxe-table": "^4.17.0",
  "vxe-pc-ui": "^4.10.6",
  "xe-utils": "^3.7.9"
}
```

## 配置说明

### 1. 全局注册（已完成）

在 `src/main.ts` 中已经全局注册了 VXE Table：

```typescript
import 'vxe-table/lib/style.css'
import 'vxe-pc-ui/lib/style.css'
import VxeUI from 'vxe-pc-ui'
import VxeTable from 'vxe-table'

app.use(VxeUI)
app.use(VxeTable)
```

### 2. 路由配置（已完成）

在 `src/router/modules/examples.ts` 中添加了路由：

```typescript
{
  path: 'vxe-table',
  name: 'VxeTableDemo',
  component: '/examples/vxe-table',
  meta: {
    title: 'menus.examples.vxeTable',
    keepAlive: true
  }
}
```

### 3. 国际化配置（已完成）

在 `src/locales/langs/zh.json` 和 `en.json` 中添加了菜单标题：

```json
{
  "menus": {
    "examples": {
      "vxeTable": "VXE Table 示例" // 中文
      // "vxeTable": "VXE Table Demo" // 英文
    }
  }
}
```

## 访问路径

### 基础示例

- 访问路径：`/examples/vxe-table`
- 侧边栏菜单：`功能示例 > VXE Table 示例`
- 文件位置：`src/views/examples/vxe-table/index.vue`

### 高级示例

- 访问路径：`/examples/vxe-table/advanced`
- 侧边栏菜单：`功能示例 > VXE Table 高级示例`
- 文件位置：`src/views/examples/vxe-table/advanced.vue`

## 示例说明

### 基础表格示例（index.vue）

展示了基本的 CRUD 操作：

- ✅ **新增**：在表格顶部插入新行
- ✅ **删除选中**：批量删除选中的行
- ✅ **获取选中**：获取选中行的数据
- ✅ **行内编辑**：点击单元格直接编辑
- ✅ **单行操作**：编辑和删除单行数据
- ✅ **分页功能**：数据分页展示
- ✅ **排序和筛选**：支持多列排序和数据筛选

### 高级功能示例（advanced.vue）

展示了更多高级特性和完整的业务场景：

- ✅ **工具栏操作**：新增、保存、删除、导出、打印
- ✅ **实时搜索**：支持全表搜索过滤
- ✅ **复选框选择**：支持多选和全选，显示选中数量
- ✅ **行内编辑**：支持多种编辑器（输入框、下拉选择等）
- ✅ **自定义渲染**：
  - 价格显示（红色高亮）
  - 库存状态（颜色标签）
  - 分类标签（不同颜色）
  - 评分展示（星级评分）
- ✅ **操作按钮**：编辑、删除、查看详情
- ✅ **详情对话框**：查看完整商品信息
- ✅ **数据导出**：支持导出 CSV 文件
- ✅ **打印功能**：支持打印表格数据
- ✅ **固定列**：左右固定列，横向滚动
- ✅ **表格高度**：固定高度，纵向滚动
- ✅ **斑马纹**：隔行变色显示
- ✅ **边框样式**：全边框模式

## 更多资源

- [VXE Table 官方文档](https://vxetable.cn)
- [VXE Table GitHub](https://github.com/x-extends/vxe-table)
- [VXE Table API 文档](https://vxetable.cn/v4/#/table/api)

## 注意事项

1. VXE Table 4.x 版本需要配合 vxe-pc-ui 使用
2. 本示例使用的是完整引入方式，如需按需引入请参考官方文档
3. 样式文件已在 main.ts 中全局引入，无需在组件中重复引入
