<template>
  <div class="page-content">
    <h3 class="table-title"><i class="iconfont-sys">&#xe74d;</i>更新计划</h3>

    <art-table :data="upgradeLogList">
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
  import { upgradeLogList } from '@/mock/upgradeLog'

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
      display: flex;
      align-items: center;
      padding: 10px 0 15px;
      padding-bottom: 30px;
      font-size: 18px;
      font-weight: 500;
      border-bottom: 1px solid var(--art-border-color);

      i {
        margin-right: 10px;
        font-size: 24px;
      }
    }
  }
</style>
