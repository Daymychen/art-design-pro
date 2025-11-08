# 路由核心模块

路由系统的核心模块，提供清晰、可维护的路由注册和管理功能。

## 快速使用

```typescript
import { RouteRegistry, MenuProcessor } from '@/router/core'

// 创建路由注册器
const registry = new RouteRegistry(router)

// 获取并注册菜单
const menuProcessor = new MenuProcessor()
const menuList = await menuProcessor.getMenuList()
registry.register(menuList)
```

## 核心类说明

### RouteRegistry - 路由注册器

负责动态路由的注册和管理。

```typescript
const registry = new RouteRegistry(router)

registry.register(menuList) // 注册路由
registry.isRegistered() // 检查是否已注册
registry.unregister() // 移除所有动态路由
```

### MenuProcessor - 菜单处理器

负责菜单数据的获取、过滤和路径规范化。

```typescript
const processor = new MenuProcessor()

const menuList = await processor.getMenuList() // 获取菜单（自动识别前端/后端模式）
processor.validateMenuList(menuList) // 验证菜单数据
```

### IframeRouteManager - Iframe 管理器

管理 iframe 类型的路由（单例模式）。

```typescript
const manager = IframeRouteManager.getInstance()

manager.add(iframeRoute) // 添加 iframe 路由
manager.findByPath('/iframe/example') // 查找路由
manager.getAll() // 获取所有 iframe 路由
manager.save() // 保存到 sessionStorage
```

### ComponentLoader - 组件加载器

动态加载 Vue 组件。

```typescript
const loader = new ComponentLoader()

loader.load('/dashboard/index') // 加载普通组件
loader.loadLayout() // 加载布局组件
loader.loadIframe() // 加载 iframe 组件
```

### RouteValidator - 路由验证器

验证路由配置的合法性。

```typescript
const validator = new RouteValidator()
const result = validator.validate(routes)

if (!result.valid) {
  console.error('错误:', result.errors)
  console.warn('警告:', result.warnings)
}
```

### RouteTransformer - 路由转换器

将菜单数据转换为 Vue Router 路由配置。

```typescript
const transformer = new RouteTransformer(componentLoader)
const routeConfig = transformer.transform(menuRoute)
```

## 架构设计

```
RouteRegistry (路由注册器)
    ├── RouteValidator (验证器)
    ├── RouteTransformer (转换器)
    │   ├── ComponentLoader (组件加载器)
    │   └── IframeRouteManager (Iframe管理器)
    └── MenuProcessor (菜单处理器)
```

## 主要特性

- ✅ **面向对象设计** - 清晰的职责划分
- ✅ **完善的错误处理** - 区分不同类型的错误
- ✅ **路径自动规范化** - 自动处理相对路径和绝对路径
- ✅ **懒加载组件** - 按需加载，提升性能
- ✅ **单例模式** - Iframe 管理器避免重复实例化
- ✅ **完全向后兼容** - 不影响现有代码

## 常见问题

**Q: 旧的 API 还能用吗？**  
A: 可以，但已标记为 `@deprecated`，建议使用新 API。

**Q: 如何迁移？**  
A: 查看 `docs/router-refactoring.md` 中的迁移指南。

**Q: 性能如何？**  
A: 采用懒加载、单例模式等优化，性能更好。

## 相关文档

- [路由重构详细文档](../../../docs/router-refactoring.md)
- [变更日志](../../../CHANGELOG-ROUTER.md)
