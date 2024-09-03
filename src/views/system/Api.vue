<template>
  <div class="page-content">
    <el-row :gutter="15">
      <el-col :xs="19" :sm="12" :lg="6">
        <el-input placeholder="路径搜索"></el-input>
      </el-col>
      <el-col :xs="4" :sm="12" :lg="4">
        <el-button>搜索</el-button>
      </el-col>
    </el-row>

    <art-table :data="apiList">
      <el-table-column label="ID" prop="id" width="100" />
      <el-table-column label="路径" prop="endpoint" />
      <el-table-column label="分组" prop="group" />
      <el-table-column label="描述" prop="description" />
      <el-table-column label="请求类型" prop="method">
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.method)">{{ scope.row.method }}</el-tag>
        </template>
      </el-table-column>
    </art-table>

    <!-- 路径 分组 描述 请求 -->
  </div>
</template>

<script setup lang="ts">
  const apiList = ref([
    {
      id: '1',
      endpoint: '/api/v1/users',
      group: '用户管理',
      description: '获取用户列表',
      method: 'GET'
    },
    {
      id: '2',
      endpoint: '/api/v1/users',
      group: '用户管理',
      description: '创建新用户',
      method: 'POST'
    },
    {
      id: '3',
      endpoint: '/api/v1/users/:id',
      group: '用户管理',
      description: '获取单个用户信息',
      method: 'GET'
    },
    {
      id: '4',
      endpoint: '/api/v1/users/:id',
      group: '用户管理',
      description: '更新用户信息',
      method: 'PUT'
    },
    {
      id: '5',
      endpoint: '/api/v1/users/:id',
      group: '用户管理',
      description: '删除用户',
      method: 'DELETE'
    },
    {
      id: '6',
      endpoint: '/api/v1/products',
      group: '产品管理',
      description: '获取产品列表',
      method: 'GET'
    },
    {
      id: '7',
      endpoint: '/api/v1/products',
      group: '产品管理',
      description: '创建新产品',
      method: 'POST'
    },
    {
      id: '8',
      endpoint: '/api/v1/products/:id',
      group: '产品管理',
      description: '获取单个产品信息',
      method: 'GET'
    },
    {
      id: '9',
      endpoint: '/api/v1/products/:id',
      group: '产品管理',
      description: '更新产品信息',
      method: 'PUT'
    },
    {
      id: '10',
      endpoint: '/api/v1/products/:id',
      group: '产品管理',
      description: '删除产品',
      method: 'DELETE'
    },
    {
      id: '11',
      endpoint: '/api/v1/orders',
      group: '订单管理',
      description: '获取订单列表',
      method: 'GET'
    },
    {
      id: '12',
      endpoint: '/api/v1/orders',
      group: '订单管理',
      description: '创建新订单',
      method: 'POST'
    },
    {
      id: '13',
      endpoint: '/api/v1/orders/:id',
      group: '订单管理',
      description: '获取单个订单信息',
      method: 'GET'
    },
    {
      id: '14',
      endpoint: '/api/v1/orders/:id',
      group: '订单管理',
      description: '更新订单信息',
      method: 'PUT'
    },
    {
      id: '15',
      endpoint: '/api/v1/orders/:id',
      group: '订单管理',
      description: '删除订单',
      method: 'DELETE'
    },
    {
      id: '16',
      endpoint: '/api/v1/auth/login',
      group: '认证管理',
      description: '用户登录',
      method: 'POST'
    },
    {
      id: '17',
      endpoint: '/api/v1/auth/logout',
      group: '认证管理',
      description: '用户登出',
      method: 'POST'
    },
    {
      id: '18',
      endpoint: '/api/v1/auth/register',
      group: '认证管理',
      description: '用户注册',
      method: 'POST'
    },
    {
      id: '19',
      endpoint: '/api/v1/auth/password-reset',
      group: '认证管理',
      description: '密码重置',
      method: 'POST'
    },
    {
      id: '20',
      endpoint: '/api/v1/auth/verify-email',
      group: '认证管理',
      description: '验证邮箱',
      method: 'POST'
    }
  ])

  // 写一个 <el-tag type 根据 method 的值来判断
  const getTagType = (method: string) => {
    switch (method) {
      case 'GET':
        return 'success'
      case 'POST':
        return 'primary'
      case 'PUT':
        return 'warning'
      case 'DELETE':
        return 'danger'
      default:
        return 'info'
    }
  }
</script>

<style lang="scss" scoped></style>
