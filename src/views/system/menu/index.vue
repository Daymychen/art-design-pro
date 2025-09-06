<template>
  <div class="menu-page art-full-height">
    <!-- 搜索栏 -->
    <ArtSearchBar
      v-model="formFilters"
      :items="formItems"
      :showExpand="false"
      @reset="handleReset"
      @search="handleSearch"
    />

    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader
        :showZebra="false"
        :loading="loading"
        v-model:columns="columnChecks"
        @refresh="handleRefresh"
      >
        <template #left>
          <ElButton v-auth="'add'" @click="handleAddMenu" v-ripple> 添加菜单 </ElButton>
          <ElButton @click="toggleExpand" v-ripple>
            {{ isExpanded ? '收起' : '展开' }}
          </ElButton>
          <ElButton v-if="hasAuth('add')" @click="handleAddMenu" v-ripple> 添加菜单 </ElButton>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        rowKey="path"
        :loading="loading"
        :columns="columns"
        :data="filteredTableData"
        :stripe="false"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :default-expand-all="false"
      />

      <!-- 菜单弹窗 -->
      <MenuDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :editData="editData"
        :lockType="lockMenuType"
        @submit="handleSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { useMenuStore } from '@/store/modules/menu'
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
  import { formatMenuTitle } from '@/router/utils/utils'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTableColumns } from '@/composables/useTableColumns'
  import type { AppRouteRecord } from '@/types/router'
  import { useAuth } from '@/composables/useAuth'
  import MenuDialog from './modules/menu-dialog.vue'

  defineOptions({ name: 'Menus' })

  const { hasAuth } = useAuth()
  const { menuList } = storeToRefs(useMenuStore())

  // 状态管理
  const loading = ref(false)
  const isExpanded = ref(false)
  const tableRef = ref()

  // 弹窗相关
  const dialogVisible = ref(false)
  const dialogType = ref<'menu' | 'button'>('menu')
  const editData = ref<AppRouteRecord | any>(null)
  const lockMenuType = ref(false)

  // 搜索相关
  const initialSearchState = {
    name: '',
    route: ''
  }

  const formFilters = reactive({ ...initialSearchState })
  const appliedFilters = reactive({ ...initialSearchState })

  const formItems = computed(() => [
    {
      label: '菜单名称',
      key: 'name',
      type: 'input',
      props: { clearable: true }
    },
    {
      label: '路由地址',
      key: 'route',
      type: 'input',
      props: { clearable: true }
    }
  ])

  // 菜单类型工具函数
  const getMenuTypeTag = (row: AppRouteRecord) => {
    if (row.meta?.isAuthButton) return 'danger'
    if (row.children?.length) return 'info'
    if (row.meta?.link && row.meta?.isIframe) return 'success'
    if (row.path) return 'primary'
    if (row.meta?.link) return 'warning'
    return 'info'
  }

  const getMenuTypeText = (row: AppRouteRecord) => {
    if (row.meta?.isAuthButton) return '按钮'
    if (row.children?.length) return '目录'
    if (row.meta?.link && row.meta?.isIframe) return '内嵌'
    if (row.path) return '菜单'
    if (row.meta?.link) return '外链'
    return '未知'
  }

  // 表格列配置
  const { columnChecks, columns } = useTableColumns(() => [
    {
      prop: 'meta.title',
      label: '菜单名称',
      minWidth: 120,
      formatter: (row: AppRouteRecord) => formatMenuTitle(row.meta?.title)
    },
    {
      prop: 'type',
      label: '菜单类型',
      formatter: (row: AppRouteRecord) => {
        return h(ElTag, { type: getMenuTypeTag(row) }, () => getMenuTypeText(row))
      }
    },
    {
      prop: 'path',
      label: '路由',
      formatter: (row: AppRouteRecord) => {
        if (row.meta?.isAuthButton) return ''
        return row.meta?.link || row.path || ''
      }
    },
    {
      prop: 'meta.authList',
      label: '权限标识',
      formatter: (row: AppRouteRecord) => {
        if (row.meta?.isAuthButton) {
          return row.meta?.authMark || ''
        }
        if (!row.meta?.authList?.length) return ''
        return `${row.meta.authList.length} 个权限标识`
      }
    },
    {
      prop: 'date',
      label: '编辑时间',
      formatter: () => '2022-3-12 12:00:00'
    },
    {
      prop: 'status',
      label: '状态',
      formatter: () => h(ElTag, { type: 'success' }, () => '启用')
    },
    {
      prop: 'operation',
      label: '操作',
      width: 180,
      align: 'right',
      formatter: (row: AppRouteRecord) => {
        const buttonStyle = { style: 'text-align: right' }

        if (row.meta?.isAuthButton) {
          return h('div', buttonStyle, [
            h(ArtButtonTable, {
              type: 'edit',
              onClick: () => handleEditAuth(row)
            }),
            h(ArtButtonTable, {
              type: 'delete',
              onClick: () => handleDeleteAuth()
            })
          ])
        }

        return h('div', buttonStyle, [
          h(ArtButtonTable, {
            type: 'add',
            onClick: () => handleAddAuth(),
            title: '新增权限'
          }),
          h(ArtButtonTable, {
            type: 'edit',
            onClick: () => handleEditMenu(row)
          }),
          h(ArtButtonTable, {
            type: 'delete',
            onClick: () => handleDeleteMenu()
          })
        ])
      }
    }
  ])

  // 数据相关
  const tableData = ref<AppRouteRecord[]>([])

  // 事件处理
  const handleReset = () => {
    Object.assign(formFilters, { ...initialSearchState })
    Object.assign(appliedFilters, { ...initialSearchState })
    getTableData()
  }

  const handleSearch = () => {
    Object.assign(appliedFilters, { ...formFilters })
    getTableData()
  }

  const handleRefresh = () => {
    getTableData()
  }

  const getTableData = () => {
    loading.value = true
    setTimeout(() => {
      tableData.value = menuList.value
      loading.value = false
    }, 500)
  }

  // 工具函数
  const deepClone = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj)
    if (Array.isArray(obj)) return obj.map((item) => deepClone(item))

    const cloned: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }

  const convertAuthListToChildren = (items: AppRouteRecord[]): AppRouteRecord[] => {
    return items.map((item) => {
      const clonedItem = deepClone(item)

      if (clonedItem.children?.length) {
        clonedItem.children = convertAuthListToChildren(clonedItem.children)
      }

      if (item.meta?.authList?.length) {
        const authChildren: AppRouteRecord[] = item.meta.authList.map(
          (auth: { title: string; authMark: string }) => ({
            path: `${item.path}_auth_${auth.authMark}`,
            name: `${String(item.name)}_auth_${auth.authMark}`,
            meta: {
              title: auth.title,
              authMark: auth.authMark,
              isAuthButton: true,
              parentPath: item.path
            }
          })
        )

        clonedItem.children = clonedItem.children?.length
          ? [...clonedItem.children, ...authChildren]
          : authChildren
      }

      return clonedItem
    })
  }

  const searchMenu = (items: AppRouteRecord[]): AppRouteRecord[] => {
    const results: AppRouteRecord[] = []

    for (const item of items) {
      const searchName = appliedFilters.name?.toLowerCase().trim() || ''
      const searchRoute = appliedFilters.route?.toLowerCase().trim() || ''
      const menuTitle = formatMenuTitle(item.meta?.title || '').toLowerCase()
      const menuPath = (item.path || '').toLowerCase()
      const nameMatch = !searchName || menuTitle.includes(searchName)
      const routeMatch = !searchRoute || menuPath.includes(searchRoute)

      if (item.children?.length) {
        const matchedChildren = searchMenu(item.children)
        if (matchedChildren.length > 0) {
          const clonedItem = deepClone(item)
          clonedItem.children = matchedChildren
          results.push(clonedItem)
          continue
        }
      }

      if (nameMatch && routeMatch) {
        results.push(deepClone(item))
      }
    }

    return results
  }

  // 过滤后的表格数据
  const filteredTableData = computed(() => {
    const searchedData = searchMenu(tableData.value)
    return convertAuthListToChildren(searchedData)
  })

  // 弹窗操作处理
  const handleAddMenu = () => {
    dialogType.value = 'menu'
    editData.value = null
    lockMenuType.value = true
    dialogVisible.value = true
  }

  const handleAddAuth = () => {
    dialogType.value = 'menu'
    editData.value = null
    lockMenuType.value = false
    dialogVisible.value = true
  }

  const handleEditMenu = (row: AppRouteRecord) => {
    dialogType.value = 'menu'
    editData.value = row
    lockMenuType.value = true
    dialogVisible.value = true
  }

  const handleEditAuth = (row: AppRouteRecord) => {
    dialogType.value = 'button'
    editData.value = {
      title: row.meta?.title,
      authMark: row.meta?.authMark
    }
    lockMenuType.value = false
    dialogVisible.value = true
  }

  const handleSubmit = (formData: any) => {
    console.log('提交数据:', formData)
    // 这里可以调用API保存数据
    getTableData()
  }

  const handleDeleteMenu = async () => {
    try {
      await ElMessageBox.confirm('确定要删除该菜单吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      ElMessage.success('删除成功')
      getTableData()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败')
      }
    }
  }

  const handleDeleteAuth = async () => {
    try {
      await ElMessageBox.confirm('确定要删除该权限吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      ElMessage.success('删除成功')
      getTableData()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败')
      }
    }
  }

  // 展开/收起功能
  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
    nextTick(() => {
      if (tableRef.value?.elTableRef && filteredTableData.value) {
        const processRows = (rows: AppRouteRecord[]) => {
          rows.forEach((row) => {
            if (row.children?.length) {
              tableRef.value.elTableRef.toggleRowExpansion(row, isExpanded.value)
              processRows(row.children)
            }
          })
        }
        processRows(filteredTableData.value)
      }
    })
  }

  // 生命周期
  onMounted(() => {
    getTableData()
  })
</script>

<style lang="scss" scoped>
  .menu-page {
    .svg-icon {
      width: 1.8em;
      height: 1.8em;
      overflow: hidden;
      vertical-align: -8px;
      fill: currentcolor;
    }

    :deep(.small-btn) {
      height: 30px !important;
      padding: 0 10px !important;
      font-size: 12px !important;
    }
  }
</style>
