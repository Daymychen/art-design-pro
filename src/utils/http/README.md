# HTTP 请求使用说明

## 🚀 基础用法

```typescript
import request from '@/utils/http'
import type { BaseResponse } from '@/types/api'

// 基础GET请求
const response = await request.get<BaseResponse<User[]>>({
  url: '/api/users'
})

// 基础POST请求
const result = await request.post<BaseResponse<User>>({
  url: '/api/users',
  data: { name: 'John', email: 'john@example.com' }
})
```

## ⚙️ 使用自定义请求选项

```typescript
// 不显示错误消息
await request.get({
  url: '/api/data',
  requestOptions: {
    errorMessageMode: 'none'
  }
})

// 不携带token的请求
await request.get({
  url: '/api/public/data',
  requestOptions: {
    withToken: false
  }
})

// 添加时间戳防止缓存
await request.get({
  url: '/api/data',
  requestOptions: {
    joinTime: true // 会在URL后添加 ?_t=timestamp
  }
})

// 使用不同的API地址
await request.post({
  url: '/upload',
  data: formData,
  requestOptions: {
    apiUrl: 'https://upload.example.com'
  }
})

// 组合使用
await request.get({
  url: '/api/sensitive-data',
  requestOptions: {
    withToken: true,
    errorMessageMode: 'modal',
    joinTime: true
  }
})
```

## 📋 RequestOptions 配置项

| 配置项                   | 类型                             | 默认值      | 说明                |
| ------------------------ | -------------------------------- | ----------- | ------------------- |
| `errorMessageMode`       | `'none' \| 'modal' \| 'message'` | `'message'` | 错误消息显示方式    |
| `withToken`              | `boolean`                        | `true`      | 是否携带认证token   |
| `joinTime`               | `boolean`                        | `false`     | 是否添加时间戳      |
| `apiUrl`                 | `string`                         | -           | 自定义API基础地址   |
| `joinParamsToUrl`        | `boolean`                        | `false`     | 是否将参数拼接到URL |
| `formatDate`             | `boolean`                        | `false`     | 是否格式化日期      |
| `isTransformResponse`    | `boolean`                        | `true`      | 是否转换响应数据    |
| `isReturnNativeResponse` | `boolean`                        | `false`     | 是否返回原生响应    |
| `joinPrefix`             | `boolean`                        | `true`      | 是否添加前缀        |
| `ignoreCancelToken`      | `boolean`                        | `false`     | 是否忽略取消令牌    |

## 🔄 迁移指南

### 从旧版本迁移

```typescript
// 旧写法 ❌
await request.get({
  url: '/api/data'
})

// 新写法 ✅ (向后兼容)
await request.get({
  url: '/api/data',
  requestOptions: {
    errorMessageMode: 'message' // 可选配置
  }
})
```

### 错误处理方式对比

```typescript
// 默认错误处理 (ElMessage)
await request.get({ url: '/api/data' })

// 静默请求 (不显示错误消息)
await request.get({
  url: '/api/data',
  requestOptions: { errorMessageMode: 'none' }
})

// 模态框错误 (TODO: 需要实现ElMessageBox)
await request.get({
  url: '/api/data',
  requestOptions: { errorMessageMode: 'modal' }
})
```

## 📝 最佳实践

1. **API服务类中的使用**

```typescript
export class UserService {
  // 公开接口，不需要token
  static getPublicInfo() {
    return request.get<BaseResponse<PublicInfo>>({
      url: '/api/public/info',
      requestOptions: {
        withToken: false,
        errorMessageMode: 'none' // 静默失败
      }
    })
  }

  // 需要认证的接口
  static getUserProfile() {
    return request.get<BaseResponse<UserProfile>>({
      url: '/api/user/profile',
      requestOptions: {
        withToken: true,
        joinTime: true // 防止缓存
      }
    })
  }
}
```

2. **文件上传场景**

```typescript
const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return request.post({
    url: '/api/upload',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    requestOptions: {
      withToken: true,
      errorMessageMode: 'modal' // 上传失败用模态框提示
    }
  })
}
```

3. **批量请求优化**

```typescript
// 并发请求，但其中一个失败不影响其他
const fetchDashboardData = async () => {
  const requests = [
    request.get({
      url: '/api/stats',
      requestOptions: { errorMessageMode: 'none' }
    }),
    request.get({
      url: '/api/charts',
      requestOptions: { errorMessageMode: 'none' }
    }),
    request.get({
      url: '/api/notifications',
      requestOptions: { errorMessageMode: 'none' }
    })
  ]

  const results = await Promise.allSettled(requests)
  return results
}
```
