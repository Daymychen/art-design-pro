<template>
  <div class="page-content">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-input placeholder="搜索标题或者发送人"></el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <el-button>搜索</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData">
      <template #default>
        <el-table-column prop="title" label="标题" show-overflow-tooltip />
        <el-table-column prop="level" label="等级" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" show-overflow-tooltip />
        <el-table-column prop="userName" label="发送人" show-overflow-tooltip />
        <el-table-column prop="sendTime" label="发送时间" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作">
          <el-button link :icon="View" type="primary"> 查看 </el-button>
        </el-table-column>
      </template>
    </art-table>
  </div>
</template>

<script setup lang="ts">
  import { View } from '@element-plus/icons-vue'

  const tableData = reactive([
    {
      title: '新增国际化',
      level: '普通',
      type: '公告',
      userName: '超级管理员',
      sendTime: '2021-3-13 0:10'
    },
    {
      title: '新增通知中心',
      level: '普通',
      type: '公告',
      userName: '超级管理员',
      sendTime: '2021-2-26 23:50'
    },
    {
      title: '移动端自适应',
      level: '普通',
      type: '公告',
      userName: '超级管理员',
      sendTime: '2021-2-21 8:05'
    },
    {
      title: '登录、API管理接入接口',
      level: '普通',
      type: '公告',
      userName: '超级管理员',
      sendTime: '2020-1-17 21:12'
    },
    {
      title: '新增使用文档',
      level: '普通',
      type: '公告',
      userName: '超级管理员',
      sendTime: '2021-01-14 0:20'
    },
    {
      title: '新增暗黑主题模式',
      level: '普通',
      type: '公告',
      userName: '超级管理员',
      sendTime: '2020-12-20 0:15'
    },
    {
      title: '菜单mock本地真实数据',
      level: '普通',
      type: '公告',
      userName: '超级管理员',
      sendTime: '2020-12-17 22:06'
    },
    {
      title: 'Tao Admin通用后台管理系统开源',
      level: '普通',
      type: '公告',
      userName: '超级管理员',
      sendTime: '2020-12-16 20:34'
    }
  ])
</script>
