<template>
  <div class="page-content">
    <h3 class="table-title"><i class="iconfont-sys">&#xe74d;</i>更新日志</h3>

    <ArtTable :data="upgradeLogList" :pagination="false">
      <ElTableColumn label="版本号" prop="version" width="200" />
      <ElTableColumn label="内容">
        <template #default="scope">
          <div class="title">{{ scope.row.title }}</div>
          <div v-if="scope.row.detail" style="margin-top: 10px">
            <div class="detail-item" v-for="(item, index) in scope.row.detail" :key="index">
              {{ index + 1 }}. {{ item }}
            </div>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="时间" prop="date" />
    </ArtTable>
  </div>
</template>

<script setup lang="ts">
  import ArtTable from '@/components/core/tables/ArtTable.vue'
  import { upgradeLogList } from '@/mock/upgrade/changeLog'

  defineOptions({ name: 'ChangeLog' })
</script>

<style lang="scss" scoped>
  .page-content {
    .table-title {
      display: flex;
      align-items: center;
      padding: 10px 0 0;
      font-size: 18px;
      font-weight: 500;

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
