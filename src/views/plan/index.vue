<template>
  <div class="page-content">
    <h3 class="table-title"><i class="iconfont-sys">&#xe74d;</i>更新计划</h3>

    <art-table :data="apiList">
      <el-table-column label="版本号" prop="version" />
      <el-table-column label="内容" prop="title" />
      <el-table-column label="时间" prop="date" />
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.status)">{{ scope.row.statusText }}</el-tag>
        </template>
      </el-table-column>
    </art-table>
  </div>
</template>

<script setup lang="ts">
  const apiList = ref([
    {
      version: 'v1.0.3',
      title: '新增页面切换动画',
      date: '2024-9-17',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.27',
      title: '菜单标题多语言封装',
      date: '2024-9-13',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.26',
      title: 'windows下全局搜索图标优化',
      date: '2024-9-13',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.25',
      title: '新增网络异常提示组件',
      date: '2024-9-12',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.24',
      title: 'CSS主题变量重构',
      date: '2024-9-11',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.23',
      title: '全局搜索新增历史记录',
      date: '2024-9-9',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.22',
      title: '头像菜单升级',
      date: '2024-9-9',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.21',
      title: '搜索升级为全局弹窗',
      date: '2024-9-7',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.2',
      title: '搜索支持键盘上下选择、回车搜索',
      date: '2024-9-5',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.1',
      title: '留言板块开发',
      date: '2024-9-4',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.0（正式版）',
      title: '基础功能开发完成',
      date: '2024-9-3',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.0',
      title: 'cz-git 实现 git 可视化提交',
      date: '2024-8-27',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.0',
      title: 'Husky + CommitLint 代码提交自动格式化',
      date: '2024-8-26',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.0',
      title: 'Perttier、StyleLint 代码格式化&验证',
      date: '2024-8-25',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.0',
      title: 'Eslint 代码校验',
      date: '2024-8-25',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.0',
      title: 'LocalStorage 系统数据校验',
      date: '2024-8-24',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.0',
      title: '多语言支持',
      date: '2024-8-23',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.0',
      title: '主题跟随系统切换',
      date: '2024-8-22',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.0',
      title: '多标签支持左右滚动',
      date: '2024-8-21',
      status: 'complete',
      statusText: '完成'
    },
    {
      version: 'v1.0.0',
      title: '项目依赖版本升级',
      date: '2024-8-20',
      status: 'complete',
      statusText: '完成'
    }
  ])

  // 写一个 <el-tag type 根据 status 的值来判断
  const getTagType = (status: string) => {
    switch (status) {
      case 'complete':
        return 'primary'
      case 'progress':
        return 'warning'
      case 'not-start':
        return 'info'
      case 'PUT':
        return 'warning'
      default:
        return 'danger'
    }
  }
</script>

<style lang="scss" scoped>
  .page-content {
    .table-title {
      font-size: 18px;
      font-weight: 500;
      padding: 10px 0 15px 0;
      display: flex;
      align-items: center;
      padding-bottom: 30px;
      border-bottom: 1px solid var(--art-border-color);

      i {
        font-size: 24px;
        margin-right: 10px;
      }
    }
  }
</style>
