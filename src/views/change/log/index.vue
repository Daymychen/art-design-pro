<template>
  <div class="page-content">
    <h3 class="table-title"><i class="iconfont-sys">&#xe74d;</i>更新日志</h3>

    <art-table :data="upgradeLogList" :pagination="false">
      <el-table-column label="版本号" prop="version" width="200" />
      <el-table-column label="内容" width="400">
        <template #default="scope">
          <div class="title">{{ scope.row.title }}</div>
          <div v-if="scope.row.detail" style="margin-top: 10px">
            <div class="detail-item" v-for="(item, index) in scope.row.detail" :key="index">
              {{ index + 1 }}. {{ item }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="date" />
    </art-table>
  </div>
</template>

<script setup lang="ts">
  import { upgradeLogList } from '@/mock/upgradeLog'
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

    .title {
      color: var(--art-gray-800);
    }

    .detail-item {
      color: var(--art-gray-600);
    }
  }
</style>
