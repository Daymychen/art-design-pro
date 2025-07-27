<!-- 基础表格 -->
<template>
  <div class="user-page art-full-height">
    <ElCard class="art-table-card" shadow="never" style="margin-top: 0">
      <!-- 表格 -->
      <ArtTable
        rowKey="id"
        :show-table-header="false"
        :loading="loading"
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { useTable } from '@/composables/useTable'
  import { UserService } from '@/api/usersApi'

  defineOptions({ name: 'UserMixedUsageExample' })

  const {
    tableData,
    columns,
    isLoading: loading,
    paginationState: pagination,
    onPageSizeChange: handleSizeChange,
    onCurrentPageChange: handleCurrentChange
  } = useTable<Api.User.UserListItem>({
    core: {
      apiFn: UserService.getUserList,
      apiParams: {
        current: 1,
        size: 20,
        name: '',
        phone: '',
        address: undefined
      },
      columnsFactory: () => [
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'nickName',
          label: '昵称'
        },
        {
          prop: 'userGender',
          label: '性别',
          sortable: true,
          formatter: (row) => row.userGender || '未知'
        },
        {
          prop: 'userPhone',
          label: '手机号'
        },
        {
          prop: 'userEmail',
          label: '邮箱'
        }
      ]
    }
  })
</script>
