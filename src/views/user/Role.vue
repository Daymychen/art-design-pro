<template>
  <div class="page-content">
    <el-row>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-input placeholder="部门名称"></el-input>
      </el-col>
      <div style="width: 12px"></div>
      <el-col :xs="24" :sm="12" :lg="6" class="el-col2">
        <el-button>搜索</el-button>
        <el-button @click="showDialog('add')">新增角色</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData">
      <template #default>
        <el-table-column label="角色名称" prop="name" />
        <el-table-column label="拥有权限" prop="allow" />
        <el-table-column label="描述" prop="des" />
        <el-table-column label="创建时间" prop="date" />

        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'primary' : 'info'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <el-button link :icon="EditPen" type="primary" @click="showDialog('edit')">
            编辑
          </el-button>
          <el-button link :icon="Delete" style="color: #fa6962"> 删除 </el-button>
        </el-table-column>
      </template>
    </art-table>
  </div>
</template>

<script setup lang="ts">
  import { Delete, EditPen } from '@element-plus/icons-vue'

  const tableData = reactive([
    {
      name: '超级管理员',
      allow: '全部权限',
      des: '拥有系统全部权限',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '董事会部',
      allow: '自定义',
      des: '负责董事会部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '监事会部',
      allow: '自定义',
      des: '负责监事会部相关工作的管理者',
      date: '2021-01-08',
      status: 0
    },
    {
      name: '市场部',
      allow: '自定义',
      des: '负责市场部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '人力资源部',
      allow: '自定义',
      des: '负责人力资源部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '财务部',
      allow: '自定义',
      des: '负责财务部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '公关部',
      allow: '自定义',
      des: '负责公关部相关工作的管理者',
      date: '2021-01-08',
      status: 0
    },
    {
      name: '广告部',
      allow: '自定义',
      des: '负责广告部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '营销',
      allow: '自定义',
      des: '负责营销相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '设计部',
      allow: '自定义',
      des: '负责设计部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '开发部',
      allow: '自定义',
      des: '负责开发部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '测试部',
      allow: '自定义',
      des: '负责测试部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '安保部',
      allow: '自定义',
      des: '负责安保部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    }
  ])

  const showDialog = (type: string) => {
    console.log(type)
  }
</script>

<style lang="scss" scoped>
  .page-content {
    .svg-icon {
      width: 1.8em;
      height: 1.8em;
      overflow: hidden;
      vertical-align: -8px;
      fill: currentcolor;
    }
  }
</style>
