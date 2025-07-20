<template>
  <div class="art-full-height">
    <div class="tree-container">
      <div class="left-sidebar">
        <ElCard class="art-table-card" shadow="never" style="margin-top: 0">
          <b>左右布局示例：</b>
          <p style="margin-top: 20px">例如：分类、树形结构等</p>
        </ElCard>
      </div>

      <div class="right-content art-full-height">
        <UserSearch v-model:filter="defaultFilter" />

        <ElCard class="art-table-card" shadow="never">
          <ArtTableHeader v-model:columns="columnChecks" @refresh="refresh">
            <template #left>
              <ElButton v-ripple>新增用户</ElButton>
            </template>
          </ArtTableHeader>

          <ArtTable
            rowKey="id"
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTable } from '@/composables/useTable'
  import { UserService } from '@/api/usersApi'
  import { ElButton, ElCard } from 'element-plus'
  import UserSearch from '@/views/system/user/modules/user-search.vue'

  defineOptions({ name: 'TreeTable' })

  // 表单搜索初始值
  const defaultFilter = ref({
    name: undefined
  })

  const {
    tableData,
    columns,
    columnChecks,
    isLoading: loading,
    paginationState: pagination,
    refreshAll: refresh,
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

<style lang="scss" scoped>
  .tree-container {
    box-sizing: border-box;
    display: flex;
    gap: 16px;
    height: 100%;

    .left-sidebar {
      flex-shrink: 0;
      width: 230px;
      height: 100%;
    }

    .right-content {
      flex-grow: 1;
      min-width: 0;
      height: 100%;
    }

    .art-table-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }

  @media screen and (max-width: $device-ipad) {
    .tree-container {
      display: block;
      gap: 0;
      height: auto;

      .left-sidebar {
        width: 100%;
        height: auto;
        margin-bottom: 20px;
      }
    }
  }
</style>
