<!-- 左树右表示例页面 -->
<template>
  <div class="art-full-height">
    <div class="box-border flex gap-4 h-full max-md:block max-md:gap-0 max-md:h-auto">
      <div class="flex-shrink-0 w-58 h-full max-md:w-full max-md:h-auto max-md:mb-5">
        <ElCard class="tree-card flex flex-col h-full mt-0" shadow="never">
          <template #header>
            <b>分类树</b>
          </template>
          <ElScrollbar>
            <ElTree
              :data="treeData"
              :props="treeProps"
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            />
          </ElScrollbar>
        </ElCard>
      </div>

      <div class="flex flex-col flex-grow">
        <UserSearch v-model="defaultFilter" />

        <ElCard class="flex flex-col flex-1 min-h-0 art-table-card" shadow="never">
          <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
            <template #left>
              <ElSpace wrap>
                <ElButton @click="showButtons = !showButtons" v-ripple type="primary" plain
                  >{{ showButtons ? '收起' : '展开' }}按钮组</ElButton
                >
                <ElButton v-show="showButtons" v-ripple v-for="value in 12" :key="value"
                  >表格自适应</ElButton
                >
              </ElSpace>
            </template>
          </ArtTableHeader>

          <ArtTable
            rowKey="id"
            :loading="loading"
            :data="data"
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
  import { fetchGetUserList } from '@/api/system-manage'
  import UserSearch from '@/views/system/user/modules/user-search.vue'

  defineOptions({ name: 'TreeTable' })

  const showButtons = ref(false)

  // 树形数据 - 组织架构示例
  const treeData = ref([
    {
      id: 1,
      label: '技术部',
      children: [
        {
          id: 11,
          label: '前端开发组',
          children: [
            { id: 111, label: 'React 团队' },
            { id: 112, label: 'Vue 团队' },
            { id: 113, label: '移动端团队' }
          ]
        },
        {
          id: 12,
          label: '后端开发组',
          children: [
            { id: 121, label: 'Java 团队' },
            { id: 122, label: 'Node.js 团队' },
            { id: 123, label: 'Python 团队' }
          ]
        },
        {
          id: 13,
          label: '测试组',
          children: [
            { id: 131, label: '功能测试' },
            { id: 132, label: '自动化测试' },
            { id: 133, label: '性能测试' }
          ]
        },
        {
          id: 14,
          label: '运维组',
          children: [
            { id: 141, label: '系统运维' },
            { id: 142, label: 'DevOps' }
          ]
        }
      ]
    },
    {
      id: 2,
      label: '产品部',
      children: [
        {
          id: 21,
          label: '产品设计组',
          children: [
            { id: 211, label: 'UI 设计' },
            { id: 212, label: 'UX 设计' },
            { id: 213, label: '交互设计' }
          ]
        },
        {
          id: 22,
          label: '产品运营组',
          children: [
            { id: 221, label: '用户运营' },
            { id: 222, label: '内容运营' },
            { id: 223, label: '活动运营' }
          ]
        },
        { id: 23, label: '数据分析组' }
      ]
    },
    {
      id: 3,
      label: '市场部',
      children: [
        { id: 31, label: '品牌推广组' },
        { id: 32, label: '渠道拓展组' },
        {
          id: 33,
          label: '销售组',
          children: [
            { id: 331, label: '企业客户' },
            { id: 332, label: '个人客户' }
          ]
        }
      ]
    },
    {
      id: 4,
      label: '行政部',
      children: [
        { id: 41, label: '人力资源组' },
        { id: 42, label: '财务组' },
        { id: 43, label: '行政后勤组' }
      ]
    },
    {
      id: 5,
      label: '客服部',
      children: [
        { id: 51, label: '售前咨询' },
        { id: 52, label: '售后支持' },
        { id: 53, label: '客户成功' }
      ]
    }
  ])

  const treeProps = {
    children: 'children',
    label: 'label'
  }

  const handleNodeClick = (data: any) => {
    console.log('选中节点:', data)
    // 可以根据选中的节点更新右侧表格数据
  }

  // 表单搜索初始值
  const defaultFilter = ref({
    name: undefined
  })

  const {
    data,
    columns,
    columnChecks,
    loading,
    pagination,
    refreshData,
    handleSizeChange,
    handleCurrentChange
  } = useTable({
    core: {
      apiFn: fetchGetUserList,
      apiParams: {
        current: 1,
        size: 20,
        userName: '',
        userPhone: '',
        userEmail: ''
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

<style scoped>
  .tree-card :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    padding: 10px 2px 10px 10px;
  }
</style>
