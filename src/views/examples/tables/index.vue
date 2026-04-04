<!-- 高级表格能力展示 -->
<!-- 实际开发中根据需求选择使用哪些功能，可参考功能示例下面的最小化示例进行开发 -->
<template>
  <div class="flex flex-col gap-4 pb-5">
    <!-- 功能介绍卡片 -->
    <ElCard class="art-card-xs">
      <template #header>
        <div class="flex-wrap gap-3 flex-cb">
          <h3 class="m-0">高级表格完整能力展示</h3>
          <div class="flex flex-wrap gap-2">
            <ElTag type="success" effect="light">智能缓存</ElTag>
            <ElTag type="primary" effect="light">防抖搜索</ElTag>
            <ElTag type="warning" effect="light">多种刷新</ElTag>
            <ElTag type="info" effect="light">错误处理</ElTag>
          </div>
        </div>
      </template>
      <div>
        <p class="m-0 mb-4 leading-[1.6] text-g-700">
          集成搜索、刷新、全屏、大小控制、列显示隐藏、拖拽排序、表格样式控制、并内置 useTable
          组合式函数，提供强大的组合式 API，集成数据获取、智能缓存（LRU算法）、
          多种刷新策略等核心功能，全面提升表格开发效率。
        </p>

        <!-- 调试面板 -->
        <div class="my-4" v-if="showDebugPanel">
          <ElCollapse v-model="debugActiveNames">
            <ElCollapseItem name="cache" title="缓存统计与演示">
              <div class="flex flex-col gap-2">
                <div class="flex-cb">
                  <span class="font-medium text-g-700">缓存状态：</span>
                  <ElTag type="success">已启用</ElTag>
                </div>
                <div class="flex-cb">
                  <span class="font-medium text-g-700">缓存条数：</span>
                  <span class="font-semibold text-theme">{{ cacheInfo.total }}</span>
                </div>
                <div class="flex-cb">
                  <span class="font-medium text-g-700">缓存大小：</span>
                  <span class="font-semibold text-theme">{{ cacheInfo.size }}</span>
                </div>
                <div class="flex-cb">
                  <span class="font-medium text-g-700">命中信息：</span>
                  <span class="font-semibold text-theme">{{ cacheInfo.hitRate }}</span>
                </div>

                <div class="flex gap-2 mt-2">
                  <ElButton size="small" @click="handleClearCache">清空缓存</ElButton>
                  <ElButton size="small" @click="handleCleanExpiredCache">清理过期缓存</ElButton>
                  <ElButton size="small" @click="handleTestCache">测试缓存</ElButton>
                  <ElButton size="small" @click="forceRefreshCacheInfo">刷新缓存信息</ElButton>
                </div>
              </div>
            </ElCollapseItem>
            <ElCollapseItem name="logs" title="缓存日志">
              <div class="flex flex-col gap-2">
                <div class="max-h-50 overflow-y-auto">
                  <div v-if="cacheDebugLogs.length === 0" class="p-5 text-center">
                    <ElEmpty description="暂无缓存日志" :image-size="60" />
                  </div>
                  <div v-else class="flex flex-col gap-1">
                    <div
                      v-for="(log, index) in cacheDebugLogs"
                      :key="index"
                      class="p-1.5 px-2 text-xs leading-[1.4] bg-g-200 border-l-1 border-g-400 rounded"
                      :class="{
                        'bg-[rgba(103,194,58,0.1)] !border-l-success': log.includes('✅'),
                        'bg-[rgba(64,158,255,0.1)] !border-l-theme': log.includes('🎯'),
                        'bg-[rgba(245,108,108,0.1)] !border-l-danger': log.includes('❌')
                      }"
                    >
                      {{ log }}
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 mt-2">
                  <ElButton size="small" @click="cacheDebugLogs = []">清空日志</ElButton>
                </div>
              </div>
            </ElCollapseItem>
            <ElCollapseItem name="request" title="请求状态">
              <div class="flex flex-col gap-2">
                <div class="flex-cb">
                  <span class="font-medium text-g-700">加载状态：</span>
                  <ElTag :type="loading ? 'warning' : 'success'">
                    {{ loading ? '加载中' : '空闲' }}
                  </ElTag>
                </div>
                <div class="flex-cb">
                  <span class="font-medium text-g-700">数据状态：</span>
                  <ElTag :type="hasData ? 'success' : 'info'">
                    {{ hasData ? `${data.length} 条数据` : '无数据' }}
                  </ElTag>
                </div>
                <div class="flex-cb">
                  <span class="font-medium text-g-700">错误状态：</span>
                  <ElTag :type="error ? 'danger' : 'success'">
                    {{ error ? '有错误' : '正常' }}
                  </ElTag>
                </div>
                <div class="flex flex-col gap-2">
                  <span class="font-medium text-g-700">当前请求参数：</span>
                  <ElText
                    tag="pre"
                    class="max-h-50 p-2 overflow-y-auto text-xs bg-g-200 border border-g-400 rounded-md"
                    >{{ JSON.stringify(requestParams, null, 2) }}</ElText
                  >
                </div>
                <div class="flex gap-2 mt-2">
                  <ElButton size="small" @click="handleCancelRequest">取消请求</ElButton>
                  <ElButton size="small" @click="handleClearData">清空数据</ElButton>
                </div>
              </div>
            </ElCollapseItem>
          </ElCollapse>
        </div>

        <!-- 功能开关 -->
        <div class="flex flex-wrap gap-4 mt-4">
          <ElSwitch v-model="showDebugPanel" active-text="调试面板" />
          <ElText type="info" size="small"> 💡 缓存功能已启用，可通过调试面板查看详细信息 </ElText>
        </div>
      </div>
    </ElCard>

    <!-- 搜索区域 -->
    <ArtSearchBar
      ref="searchBarRef"
      v-model="searchFormState"
      :items="searchItems"
      :rules="rules"
      :is-expand="false"
      :show-expand="true"
      :show-reset-button="true"
      :show-search-button="true"
      :disabled-search-button="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 表格区域 -->
    <ElCard class="flex-1 art-table-card" style="margin-top: 0">
      <template #header>
        <div class="flex-cb">
          <h4 class="m-0">用户数据表格</h4>
          <div class="flex gap-2">
            <ElTag v-if="error" type="danger">{{ error.message }}</ElTag>
            <ElTag v-else-if="loading" type="warning">加载中...</ElTag>
            <ElTag v-else type="success">{{ data.length }} 条数据</ElTag>
          </div>
        </div>
      </template>

      <!-- 表格工具栏 -->
      <!-- fullClass 属性用于设置全屏区域，如果需要设置全屏区域，请使用此属性 -->
      <ArtTableHeader
        v-model:columns="columnChecks"
        :loading="loading"
        @refresh="handleRefresh"
        layout="refresh,size,fullscreen,columns,settings"
        fullClass="art-table-card"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton type="primary" @click="handleAdd" v-ripple>
              <ElIcon>
                <Plus />
              </ElIcon>
              新增用户
            </ElButton>

            <!-- 导出导入功能 -->
            <ArtExcelExport
              :data="data as any"
              :columns="exportColumns as any"
              filename="用户数据"
              :auto-index="true"
              button-text="导出"
              @export-success="handleExportSuccess"
            />
            <ArtExcelImport
              @import-success="handleImportSuccess"
              @import-error="handleImportError"
              style="margin: 0 12px"
            />

            <ElButton @click="handleClearData" plain v-ripple> 清空数据 </ElButton>

            <ElButton @click="handleBatchDelete" :disabled="selectedRows.length === 0" v-ripple>
              <ElIcon>
                <Delete />
              </ElIcon>
              批量删除 ({{ selectedRows.length }})
            </ElButton>
            <!-- 动态列配置演示按钮 -->
            <ElDropdown @command="handleColumnCommand" style="margin-left: 10px">
              <ElButton type="primary" plain>
                动态更新表格列
                <ElIcon class="el-icon--right">
                  <ArrowDown />
                </ElIcon>
              </ElButton>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem command="addColumn">新增列（备注列）</ElDropdownItem>
                  <ElDropdownItem command="batchAddColumns">批量新增（备注、标签）</ElDropdownItem>
                  <ElDropdownItem command="toggleColumn">切换列（手机号）</ElDropdownItem>
                  <ElDropdownItem command="batchToggleColumns"
                    >批量切换（性别、手机号）</ElDropdownItem
                  >
                  <ElDropdownItem command="removeColumn">删除列（状态列）</ElDropdownItem>
                  <ElDropdownItem command="batchRemoveColumns"
                    >批量删除（状态、评分）</ElDropdownItem
                  >
                  <ElDropdownItem command="updateColumn">更新列（手机号）</ElDropdownItem>
                  <ElDropdownItem command="batchUpdateColumns"
                    >批量更新（性别、手机号）</ElDropdownItem
                  >
                  <ElDropdownItem command="reorderColumns"
                    >交换列位置（性别、手机号）</ElDropdownItem
                  >
                  <ElDropdownItem command="resetColumns" divided>重置所有列配置</ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        :loading="loading"
        :pagination="pagination"
        :data="data"
        :columns="columns"
        :height="computedTableHeight"
        empty-height="360px"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        @header-click="handleHeaderClick"
        @sort-change="handleSortChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <!-- 用户信息列 -->
        <template #avatar="{ row }">
          <div class="flex gap-3 user-info">
            <ElAvatar :src="row.avatar" :size="40" />
            <div class="flex-1 min-w-0">
              <p class="m-0 overflow-hidden font-medium text-ellipsis whitespace-nowrap">{{
                row.userName
              }}</p>
              <p
                class="m-0 mt-1 overflow-hidden text-xs text-g-700 text-ellipsis whitespace-nowrap"
                >{{ row.userEmail }}</p
              >
            </div>
          </div>
        </template>

        <!-- 自定义用户信息表头 -->
        <template #avatar-header="{ column }">
          <div class="flex-c gap-1">
            <span>{{ column.label }}</span>
            <ElTooltip content="包含头像、姓名和邮箱" placement="top">
              <ElIcon>
                <QuestionFilled />
              </ElIcon>
            </ElTooltip>
          </div>
        </template>

        <!-- 状态列 -->
        <template #status="{ row }">
          <ElTag :type="getUserStatusConfig(row.status).type" effect="light">
            {{ getUserStatusConfig(row.status).text }}
          </ElTag>
        </template>

        <!-- 评分列 -->
        <template #score="{ row }">
          <ElRate v-model="row.score" disabled size="small" />
        </template>

        <!-- 操作列 -->
        <template #operation="{ row }">
          <div class="flex">
            <ArtButtonTable type="view" :row="row" @click="handleView(row)" />
            <ArtButtonTable type="add" :row="row" @click="handleAdd()" />
            <ArtButtonTable type="edit" :row="row" @click="handleEdit(row)" />
            <ArtButtonTable type="delete" :row="row" @click="handleDelete(row)" />
          </div>
        </template>

        <!-- 自定义手机号表头 -->
        <template #userPhone-header="{ column }">
          <ElPopover placement="bottom" :width="200" trigger="hover">
            <template #reference>
              <div class="inline-block gap-1 text-theme c-p custom-header">
                <span>{{ column.label }}</span>
                <ElIcon>
                  <Search />
                </ElIcon>
              </div>
            </template>
            <ElInput
              v-model="phoneSearch"
              placeholder="搜索手机号"
              size="small"
              @input="handlePhoneSearch"
            >
              <template #prefix>
                <ElIcon>
                  <Search />
                </ElIcon>
              </template>
            </ElInput>
          </ElPopover>
        </template>
      </ArtTable>
    </ElCard>

    <!-- 高级功能演示 -->
    <ElCard class="art-card-xs">
      <template #header>
        <h4 class="m-0">高级功能演示</h4>
      </template>
      <div class="flex flex-col gap-6">
        <!-- 事件监听演示 -->
        <div class="p-4 bg-g-200 border-full-d rounded-lg">
          <h5 class="m-0 mb-4 text-sm font-semibold">事件监听演示</h5>
          <div class="flex flex-wrap gap-2 mb-3 last:mb-0">
            <ElButton @click="toggleEventDemo" :type="eventDemoEnabled ? 'success' : 'primary'">
              {{ eventDemoEnabled ? '关闭' : '开启' }}事件监听
            </ElButton>
            <ElButton @click="clearEventLogs" v-if="eventDemoEnabled">清空日志</ElButton>
          </div>
          <div
            v-if="eventDemoEnabled && eventLogs.length > 0"
            class="p-3 mt-3 bg-g-200 border border-g-400 rounded-md"
          >
            <div class="flex-cb mb-2 font-medium text-g-700">
              <span>最近事件日志：</span>
              <ElTag size="small">{{ eventLogs.length }} 条</ElTag>
            </div>
            <div class="flex flex-col gap-1 max-h-50 overflow-y-auto">
              <div
                v-for="(log, index) in eventLogs.slice(0, 20)"
                :key="index"
                class="flex-c gap-2 p-1.5 px-2 text-xs bg-g-300 border-l-1 border-g-400 rounded"
              >
                <ElTag :type="getEventType(log.type)" size="small">{{ log.type }}</ElTag>
                <span class="flex-1 text-g-700">{{ log.message }}</span>
                <span class="text-xs text-g-600">{{ log.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 表格配置演示 -->
        <div class="p-4 bg-g-200 border-full-d rounded-lg">
          <h5 class="m-0 mb-4 text-sm font-semibold">表格配置演示</h5>
          <div class="flex flex-wrap gap-2 mb-3 last:mb-0">
            <ElSwitch
              v-model="tableConfig.fixedHeight"
              active-text="固定高度 (500px)"
              inactive-text="自适应高度"
              class="ml-2"
            />
          </div>
        </div>

        <!-- 自定义功能演示 -->
        <div class="p-4 bg-g-200 border-full-d rounded-lg">
          <h5 class="m-0 mb-4 text-sm font-semibold">自定义功能</h5>
          <div class="flex flex-wrap gap-2 mb-3 last:mb-0">
            <ElButton @click="handleScrollToTop">滚动到顶部</ElButton>
            <ElButton @click="handleScrollToPosition">滚动到指定位置</ElButton>
            <ElButton @click="handleToggleSelection">切换全选</ElButton>
            <ElButton @click="handleGetTableInfo">获取表格信息</ElButton>
          </div>
        </div>
      </div>
    </ElCard>

    <!-- 缓存刷新策略演示 -->
    <ElCard class="art-card-xs">
      <template #header>
        <h4 class="m-0">缓存刷新策略演示</h4>
      </template>
      <div class="flex flex-wrap gap-2 max-md:flex-col">
        <ElButton @click="refreshData" v-ripple>
          <ElIcon>
            <Refresh />
          </ElIcon>
          通用刷新
        </ElButton>
        <ElButton @click="refreshSoft" v-ripple>
          <ElIcon>
            <Refresh />
          </ElIcon>
          软刷新
        </ElButton>
        <ElButton @click="refreshCreate" v-ripple>
          <ElIcon>
            <Plus />
          </ElIcon>
          新增后刷新
        </ElButton>
        <ElButton @click="refreshUpdate" v-ripple>
          <ElIcon>
            <Edit />
          </ElIcon>
          编辑后刷新
        </ElButton>
        <ElButton @click="refreshRemove" v-ripple>
          <ElIcon>
            <Delete />
          </ElIcon>
          删除后刷新
        </ElButton>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue'
  import {
    Plus,
    Delete,
    Edit,
    Search,
    Refresh,
    QuestionFilled,
    ArrowDown
  } from '@element-plus/icons-vue'
  import { ElMessageBox } from 'element-plus'
  import { useTable, CacheInvalidationStrategy } from '@/hooks/core/useTable'
  import { fetchGetUserList } from '@/api/system-manage'
  import { ACCOUNT_TABLE_DATA } from '@/mock/temp/formData'
  import { getColumnKey } from '@/hooks/core/useTableColumns'

  defineOptions({ name: 'AdvancedTableDemo' })

  type UserListItem = Api.SystemManage.UserListItem

  // 选中的行
  const selectedRows = ref<UserListItem[]>([])

  // 表格实例引用
  const tableRef = ref()

  // 调试面板状态
  const showDebugPanel = ref(false)
  const debugActiveNames = ref(['cache', 'request', 'logs'])

  // 缓存调试状态
  const cacheDebugLogs = ref<string[]>([])
  const requestParams = ref<any>({
    current: 1,
    size: 20,
    name: '',
    phone: '',
    status: '',
    department: '',
    daterange: undefined
  })

  // 缓存键信息
  const cacheKeys = ref<string[]>([])

  // 手机号搜索
  const phoneSearch = ref('')

  // 事件演示相关
  const eventDemoEnabled = ref(false)
  const eventLogs = ref<Array<{ type: string; message: string; time: string }>>([])

  // 表格配置演示
  const tableConfig = ref({
    height: '100%',
    fixedHeight: false // 新增：是否固定高度的开关
  })

  // 计算实际的表格高度
  const computedTableHeight = computed(() => {
    return tableConfig.value.fixedHeight ? '500px' : ''
  })

  // 搜索表单 ref
  const searchBarRef = ref()

  // 校验规则
  const rules = {
    name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ]
  }

  // 表单搜索初始值
  const searchFormState = ref({
    name: '',
    phone: '',
    status: '1',
    department: '',
    daterange: ['2025-01-01', '2025-02-10']
  })

  // 搜索表单状态
  // const searchFormState = ref({ ...defaultFilter.value })

  // 用户状态配置
  const USER_STATUS_CONFIG = {
    '1': { type: 'success' as const, text: '在线' },
    '2': { type: 'info' as const, text: '离线' },
    '3': { type: 'warning' as const, text: '异常' },
    '4': { type: 'danger' as const, text: '注销' }
  } as const

  // 搜索表单配置
  // 日期选择器有多种类型，具体可以查看 src/components/core/forms/art-search-bar/widget/art-search-date/README.md 文档
  const searchItems = computed(() => [
    {
      key: 'name',
      label: '用户名',
      type: 'input',
      props: {
        placeholder: '请输入用户名'
      }
    },
    {
      key: 'phone',
      label: '手机号',
      type: 'input',
      props: {
        placeholder: '请输入手机号',
        maxlength: '11'
      }
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '全部', value: '' },
        { label: '在线', value: '1' },
        { label: '离线', value: '2' },
        { label: '异常', value: '3' },
        { label: '注销', value: '4' }
      ]
    },
    {
      key: 'department',
      label: '部门',
      type: 'select',
      options: [
        { label: '全部', value: '' },
        { label: '技术部', value: '技术部' },
        { label: '产品部', value: '产品部' },
        { label: '运营部', value: '运营部' },
        { label: '市场部', value: '市场部' },
        { label: '设计部', value: '设计部' }
      ]
    },
    {
      key: 'daterange',
      label: '日期范围',
      type: 'daterange',
      props: {
        type: 'daterange',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  ])

  // 导出列配置
  const exportColumns = computed(() => ({
    userName: { title: '用户名', width: 15 },
    userEmail: { title: '邮箱', width: 20 },
    userPhone: { title: '手机号', width: 15 },
    userGender: { title: '性别', width: 10 },
    department: { title: '部门', width: 15 },
    status: {
      title: '状态',
      width: 10,
      formatter: (value: string) => getUserStatusConfig(value).text
    }
  }))

  // 获取用户状态配置
  const getUserStatusConfig = (status: string) => {
    return (
      USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG] || {
        type: 'info' as const,
        text: '未知'
      }
    )
  }

  const buildSearchParams = (params: typeof searchFormState.value) => {
    const { daterange, ...filtersParams } = params
    const [startTime, endTime] = Array.isArray(daterange) ? daterange : [null, null]

    return {
      ...filtersParams,
      startTime,
      endTime
    }
  }

  // 模拟网络请求
  // const simulateNetworkRequest = (): Promise<void> => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve()
  //     }, 500)
  //   })
  // }

  // 模拟网络请求完成后加载数据
  // onMounted(async () => {
  //   // 等待模拟的网络请求完成
  //   await simulateNetworkRequest()
  //   await fetchData({ name: 'ricky', phone: 19388828388 })
  // })

  /**
   * 使用 useTable Hook 管理表格数据
   * 提供完整的表格解决方案，包括数据获取、缓存、分页、搜索等功能
   */
  const {
    // 数据相关
    data, // 表格数据
    loading, // 加载中状态
    error, // 数据加载错误状态
    hasData, // 是否有数据
    // isEmpty, // 数据是否为空

    // 分页相关
    pagination, // 分页信息
    // paginationMobile, // 移动端分页配置
    handleSizeChange, // 分页大小变化处理
    handleCurrentChange, // 当前页变化处理

    // 搜索相关
    searchParams, // 搜索参数
    replaceSearchParams, // 替换搜索参数
    resetSearchParams, // 重置搜索参数

    // 数据操作
    // fetchData, // 手动加载数据的方法，可用于等待其他请求完成后调用，immediate 为 false 时使用
    getData, // 获取数据
    getDataDebounced, // 获取数据（防抖）
    clearData, // 清空数据

    // 刷新策略
    refreshData, // 全量刷新：清空所有缓存，重新获取数据（适用于手动刷新按钮）
    refreshSoft, // 轻量刷新：仅清空当前搜索条件的缓存，保持分页状态（适用于定时刷新）
    refreshCreate, // 新增后刷新：回到第一页并清空分页缓存（适用于新增数据后）
    refreshUpdate, // 更新后刷新：保持当前页，仅清空当前搜索缓存（适用于更新数据后）
    refreshRemove, // 删除后刷新：智能处理页码，避免空页面（适用于删除数据后）

    // 缓存控制
    cacheInfo, // 缓存统计信息
    clearCache, // 清除缓存，根据不同的业务场景选择性地清理缓存
    // 支持4种清理策略
    // clearCache(CacheInvalidationStrategy.CLEAR_ALL, '手动刷新')     // 清空所有缓存
    // clearCache(CacheInvalidationStrategy.CLEAR_CURRENT, '搜索数据') // 只清空当前搜索条件的缓存
    // clearCache(CacheInvalidationStrategy.CLEAR_PAGINATION, '新增数据') // 清空分页相关缓存
    // clearCache(CacheInvalidationStrategy.KEEP_ALL, '保持缓存')      // 不清理任何缓存
    clearExpiredCache, // 清理已过期的缓存，释放内存空间

    // 请求控制
    cancelRequest, // 取消当前请求

    // 动态列配置方法
    columns, // 表格列配置
    columnChecks, // 列显示、拖拽配置
    addColumn, // 新增列（支持单个或批量）
    removeColumn, // 删除列（支持单个或批量）
    updateColumn, // 更新列（支持单个或批量）
    toggleColumn, // 切换列显示状态（支持单个或批量）
    resetColumns, // 重置列配置
    reorderColumns, // 重新排序列
    getColumnConfig, // 获取列配置
    getAllColumns // 获取所有列配置
  } = useTable({
    // 核心配置
    core: {
      apiFn: (params) => {
        // 在API调用前添加调试信息
        const requestKey = JSON.stringify(params)
        console.log('🚀 API 请求参数:', params)
        addCacheLog(`🚀 API 请求: current=${params.current}, size=${params.size}`)
        addCacheLog(`🔑 请求键: ${requestKey.substring(0, 100)}...`)

        // 记录缓存键（这里假设会被缓存）
        updateCacheKeys(requestKey)

        return fetchGetUserList(params)
      },
      apiParams: {
        current: 1,
        size: 20,
        ...searchFormState.value
      },
      // 排除 apiParams 中的属性
      excludeParams: ['daterange'],
      // 自定义分页字段映射，未设置时将使用全局配置 tableConfig.ts 中的 paginationKey
      // paginationKey: {
      //   current: 'pageNum',
      //   size: 'pageSize'
      // },
      immediate: true, // 是否立即加载数据
      columnsFactory: () => [
        // {
        //   type: 'expand',
        //   label: '展开行',
        //   width: 80,
        //   formatter: (row) =>
        //     h('div', { style: 'padding: 10px 30px' }, [
        //       h('p', {}, '用户ID: ' + row.id),
        //       h('p', {}, '用户名: ' + row.userName),
        //       h('p', {}, '手机号: ' + row.userPhone),
        //       h('p', {}, '邮箱: ' + row.userEmail),
        //       h('p', {}, '性别: ' + row.userGender),
        //       h('p', {}, '状态: ' + row.status),
        //       h('p', {}, '创建日期: ' + row.createTime)
        //     ])
        // },
        { type: 'selection', width: 50 },
        // { type: 'index', width: 60, label: '序号' }, // 本地序号列
        { type: 'globalIndex', width: 60, label: '序号' }, // 全局序号列
        {
          prop: 'avatar',
          label: '用户信息',
          minWidth: 200,
          useSlot: true,
          useHeaderSlot: true,
          sortable: false
          // visible: false, // 隐藏列
        },
        {
          prop: 'userGender',
          label: '性别',
          sortable: true,
          formatter: (row) => row.userGender || '未知'
        },
        {
          prop: 'userPhone',
          label: '手机号',
          useHeaderSlot: true,
          sortable: true
        },
        {
          prop: 'department',
          label: '部门',
          sortable: true
        },
        {
          prop: 'score',
          label: '评分',
          useSlot: true,
          sortable: true
        },
        {
          prop: 'status',
          label: '状态',
          useSlot: true,
          sortable: true
        },
        {
          prop: 'operation',
          label: '操作',
          width: 190,
          useSlot: true,
          fixed: 'right'
        }
      ]
    },

    // 数据处理
    transform: {
      dataTransformer: (records) => {
        if (!Array.isArray(records)) return []

        return records.map((item, index: number) => ({
          ...item,
          avatar: ACCOUNT_TABLE_DATA[index % ACCOUNT_TABLE_DATA.length].avatar,
          department: ['技术部', '产品部', '运营部', '市场部', '设计部'][
            Math.floor(Math.random() * 5)
          ],
          score: Math.floor(Math.random() * 5) + 1,
          status: ['1', '2', '3', '4'][Math.floor(Math.random() * 4)]
        }))
      }
      // 自定义响应适配器，处理后端特殊的返回格式
      // responseAdapter: (data) => {
      //   const { list, total, pageNum, pageSize } = data
      //   return {
      //     records: list,
      //     total: total,
      //     current: pageNum,
      //     size: pageSize
      //   }
      // }
    },

    // 性能优化
    performance: {
      enableCache: true, // 开启缓存
      cacheTime: 5 * 60 * 1000, // 5分钟
      debounceTime: 300,
      maxCacheSize: 100
    },

    // 生命周期钩子
    hooks: {
      onSuccess: (data, response) => {
        console.log('📊 响应详情:', response)
        addCacheLog(`✅ 网络请求成功: ${data.length} 条数据`)
        addCacheLog(
          `📝 响应信息: total=${response.total}, current=${response.current}, size=${response.size}`
        )
      },
      onError: (error) => {
        console.error('❌ 数据加载失败:', error)
        addCacheLog(`❌ 请求失败: ${error.message}`)
        ElMessage.error(error.message)
      },
      onCacheHit: (data, response) => {
        console.log('🎯 缓存命中:', data.length, '条')
        console.log('🔑 缓存来源:', response)
        addCacheLog(
          `🎯 缓存命中: ${data.length} 条数据 (current=${response.current}, size=${response.size})`
        )
        ElMessage.info('数据来自缓存')
      },
      resetFormCallback: () => {
        console.log('🔄 表单已重置')
        addCacheLog('🔄 表单已重置')
      }
    },

    // 调试配置
    debug: {
      enableLog: true,
      logLevel: 'info'
    }
  })

  // 事件处理函数
  const handleSelectionChange = (selection: UserListItem[]) => {
    selectedRows.value = selection
    console.log('选择变更:', selection)
  }

  const handleRowClick = (row: UserListItem) => {
    console.log('行点击:', row)
    logEvent('行点击', `点击了用户: ${row.userName}`)
  }

  /**
   * 表头点击事件处理
   * @param column 列信息
   */
  const handleHeaderClick = (column: { label: string; property: string }) => {
    console.log('表头点击:', column)
    logEvent('表头点击', `点击了 ${column.label} 列表头`)
  }

  /**
   * 排序信息类型
   */
  interface SortInfo {
    prop: string
    order: 'ascending' | 'descending' | null
  }

  /**
   * 排序变更事件处理
   * @param sortInfo 排序信息
   */
  const handleSortChange = (sortInfo: SortInfo) => {
    console.log('排序事件:', sortInfo)
    console.log('排序字段:', sortInfo.prop)
    console.log('排序方向:', sortInfo.order)
    logEvent('排序变更', `字段: ${sortInfo.prop}, 方向: ${sortInfo.order}`)
  }

  // 事件日志记录
  const logEvent = (type: string, message: string) => {
    if (!eventDemoEnabled.value) return

    const time = new Date().toLocaleTimeString()
    eventLogs.value.unshift({ type, message, time })

    // 限制日志数量
    if (eventLogs.value.length > 20) {
      eventLogs.value = eventLogs.value.slice(0, 20)
    }
  }

  // 获取事件类型样式
  const getEventType = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
    const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
      行点击: 'primary',
      行双击: 'success',
      行右键: 'warning',
      单元格点击: 'info',
      单元格双击: 'success',
      表头点击: 'primary',
      选择变更: 'warning',
      排序变更: 'success'
    }
    return typeMap[type] || 'info'
  }

  // 演示功能方法
  const toggleEventDemo = () => {
    eventDemoEnabled.value = !eventDemoEnabled.value
    if (eventDemoEnabled.value) {
      ElMessage.success('事件监听已开启，请与表格交互查看效果')
    } else {
      ElMessage.info('事件监听已关闭')
    }
  }

  const clearEventLogs = () => {
    eventLogs.value = []
    ElMessage.info('事件日志已清空')
  }

  const handleScrollToTop = () => {
    tableRef.value?.scrollToTop()
  }

  const handleScrollToPosition = () => {
    tableRef.value?.elTableRef.setScrollTop(200)
  }

  const handleToggleSelection = () => {
    if (selectedRows.value.length === 0) {
      tableRef.value?.elTableRef.toggleAllSelection()
      ElMessage.info('已全选')
    } else {
      tableRef.value?.elTableRef.clearSelection()
      ElMessage.info('已取消全选')
    }
  }

  const handleGetTableInfo = () => {
    const info = {
      数据条数: data.value.length,
      选中条数: selectedRows.value.length,
      列数: columns?.value?.length ?? 0,
      当前页: pagination.current,
      每页大小: pagination.size,
      总条数: pagination.total
    }

    console.log('表格信息:', info)
    ElMessage.info(`表格信息已输出到控制台，当前 ${info.数据条数} 条数据`)
  }

  const handleSearch = async () => {
    await searchBarRef.value.validate()

    console.log('搜索参数:', searchFormState.value)
    replaceSearchParams(buildSearchParams(searchFormState.value))
    getData()
  }

  const handleReset = () => {
    addCacheLog('🔄 重置搜索')
    // 重置搜索表单状态
    // searchFormState.value = { ...defaultFilter.value }
    resetSearchParams()
  }

  const handlePhoneSearch = (value: string) => {
    searchFormState.value.phone = value
    replaceSearchParams(buildSearchParams(searchFormState.value))
    requestParams.value = { ...searchParams }
    addCacheLog(`📱 手机号搜索: ${value}`)
    getDataDebounced()
  }

  const handleRefresh = () => {
    addCacheLog('🔄 手动刷新')
    refreshData()
  }

  // CRUD 操作
  const handleAdd = () => {
    ElMessage.success('新增用户成功')
    refreshCreate()
  }

  const handleEdit = (row: UserListItem) => {
    ElMessage.success(`编辑用户 ${row.userName} 成功`)
    setTimeout(() => {
      refreshUpdate()
    }, 1000)
  }

  const handleDelete = async (row: UserListItem) => {
    try {
      await ElMessageBox.confirm(`确定要删除用户 ${row.userName} 吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      ElMessage.success('删除成功')
      setTimeout(() => {
        refreshRemove()
      }, 1000)
    } catch {
      ElMessage.info('已取消删除')
    }
  }

  const handleView = (row: UserListItem) => {
    ElMessage.info(`查看用户 ${row.userName}`)
  }

  const handleBatchDelete = async () => {
    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRows.value.length} 个用户吗？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      ElMessage.success(`批量删除 ${selectedRows.value.length} 个用户成功`)
      selectedRows.value = []
      setTimeout(() => {
        refreshRemove()
      }, 1000)
    } catch {
      ElMessage.info('已取消删除')
    }
  }

  // 导入导出
  const handleExportSuccess = (filename: string, count: number) => {
    ElMessage.success(`导出 ${count} 条数据成功`)
  }

  /**
   * Excel 导入成功处理
   * @param data 导入的数据数组
   */
  const handleImportSuccess = (data: Record<string, any>[]) => {
    ElMessage.success(`导入 ${data.length} 条数据成功`)
    refreshCreate()
  }

  const handleImportError = (error: Error) => {
    ElMessage.error(`导入失败：${error.message}`)
  }

  // 调试功能
  const handleClearCache = () => {
    clearCache(CacheInvalidationStrategy.CLEAR_ALL, '手动清空')
    cacheKeys.value = [] // 清空缓存键列表
    addCacheLog('🗑️ 手动清空所有缓存')
    ElMessage.success('缓存已清空')
  }

  const handleCleanExpiredCache = () => {
    const count = clearExpiredCache()
    addCacheLog(`🧹 清理了 ${count} 条过期缓存`)
    ElMessage.info(`清理了 ${count} 条过期缓存`)
  }

  const handleCancelRequest = () => {
    cancelRequest()
    addCacheLog('❌ 取消当前请求')
    ElMessage.info('请求已取消')
  }

  const handleClearData = () => {
    clearData()
    addCacheLog('🗑️ 清空所有数据')
    ElMessage.info('数据已清空')
  }

  const handleTestCache = () => {
    // 模拟快速切换页面来测试缓存
    const testPages = [1, 2, 3, 2, 1] // 测试页面序列

    ElMessage.info('开始缓存测试...')
    addCacheLog('🧪 开始缓存测试')

    let index = 0
    const testInterval = setInterval(() => {
      if (index >= testPages.length) {
        clearInterval(testInterval)
        addCacheLog('✅ 缓存测试完成')
        ElMessage.success('缓存测试完成！观察缓存统计的变化')
        return
      }

      const page = testPages[index]
      addCacheLog(`📄 测试切换到第 ${page} 页`)
      // 更新请求参数
      requestParams.value = { ...requestParams.value, current: page }

      // 切换到测试页面
      handleCurrentChange(page)
      index++
    }, 1000)
  }

  /**
   * 添加缓存调试日志
   * @param message 日志消息
   */
  const addCacheLog = (message: string): void => {
    const timestamp = new Date().toLocaleTimeString()
    cacheDebugLogs.value.unshift(`[${timestamp}] ${message}`)
    if (cacheDebugLogs.value.length > 20) {
      cacheDebugLogs.value = cacheDebugLogs.value.slice(0, 20)
    }
  }

  /**
   * 更新缓存键列表
   * @param key 缓存键
   * @param operation 操作类型
   */
  const updateCacheKeys = (key: string, operation: 'add' | 'remove' = 'add'): void => {
    if (operation === 'add' && !cacheKeys.value.includes(key)) {
      cacheKeys.value.push(key)
      addCacheLog(`新增缓存键: ${getCacheKeySummary(key)}`)
    } else if (operation === 'remove') {
      const index = cacheKeys.value.indexOf(key)
      if (index > -1) {
        cacheKeys.value.splice(index, 1)
        addCacheLog(`移除缓存键: ${getCacheKeySummary(key)}`)
      }
    }
  }

  /**
   * 获取缓存键摘要信息
   * @param key 缓存键
   * @returns 缓存键摘要
   */
  const getCacheKeySummary = (key: string): string => {
    try {
      const params = JSON.parse(key)
      return `页码: ${params.current || 1}, 大小: ${params.size || 20}${params.name ? ', 名称: ' + params.name : ''}${params.status ? ', 状态: ' + params.status : ''}`
    } catch {
      return '无效的缓存键'
    }
  }

  /**
   * 强制刷新缓存信息
   */
  const forceRefreshCacheInfo = (): void => {
    const currentStats = cacheInfo.value
    addCacheLog(`缓存信息刷新: ${currentStats.total} 条缓存`)

    if (currentStats.total === 0) {
      cacheKeys.value = []
    }

    nextTick(() => {
      console.log('当前缓存统计:', cacheInfo.value)
    })
  }

  // 监听分页和搜索状态变化
  watch(
    () => [pagination.current, pagination.size, searchFormState.value],
    ([current, size, search]) => {
      requestParams.value = {
        ...(search as any),
        current,
        size
      }
    },
    { deep: true, immediate: true }
  )

  /**
   * 处理动态列配置命令
   */
  const handleColumnCommand = (command: string): void => {
    switch (command) {
      case 'addColumn': {
        // 新增单个列
        addColumn?.({
          prop: 'remark',
          label: '备注',
          width: 150,
          formatter: () => h('span', { style: 'color: #999' }, '暂无备注')
        })
        ElMessage.success('已新增"备注"列')
        break
      }

      case 'batchAddColumns': {
        // 批量新增多个列
        addColumn?.(
          [
            {
              prop: 'remark',
              label: '备注',
              width: 150,
              formatter: () => h('span', { style: 'color: #999' }, '暂无备注')
            },
            {
              prop: 'tags',
              label: '标签',
              width: 120,
              formatter: () => h('span', { style: 'color: #67c23a' }, '新用户')
            }
          ],
          5
        ) // 在第5个位置插入
        ElMessage.success('已批量新增"备注"和"标签"列')
        break
      }

      case 'toggleColumn': {
        // 切换单个列显示/隐藏
        if (getColumnConfig?.('userPhone')) {
          toggleColumn?.('userPhone')
          ElMessage.success('已切换手机号列显示状态')
        }
        break
      }

      case 'batchToggleColumns': {
        // 批量切换多个列显示/隐藏
        toggleColumn?.(['userGender', 'userPhone'])
        ElMessage.success('已批量切换性别和手机号列显示状态')
        break
      }

      case 'removeColumn': {
        // 删除单个列
        removeColumn?.('status')
        ElMessage.success('已删除状态列')
        break
      }

      case 'batchRemoveColumns': {
        // 批量删除多个列
        removeColumn?.(['status', 'score'])
        ElMessage.success('已批量删除状态和评分列')
        break
      }

      case 'updateColumn': {
        // 更新单个列
        updateColumn?.('userPhone', {
          label: '联系电话',
          width: 140
        })
        ElMessage.success('手机号列已更新为"联系电话"')
        break
      }

      case 'batchUpdateColumns': {
        // 批量更新多个列（新语法）
        updateColumn?.([
          { prop: 'userGender', updates: { width: 200, label: '性别-已更新', sortable: false } },
          { prop: 'userPhone', updates: { width: 200, label: '手机号-已更新', sortable: false } }
        ])
        ElMessage.success('已批量更新性别和手机号列')
        break
      }

      case 'reorderColumns': {
        // 交换列位置
        const allCols = getAllColumns?.()
        if (allCols) {
          const genderIndex = allCols.findIndex((col) => getColumnKey(col) === 'userGender')
          const phoneIndex = allCols.findIndex((col) => getColumnKey(col) === 'userPhone')

          if (genderIndex !== -1 && phoneIndex !== -1) {
            reorderColumns?.(genderIndex, phoneIndex)
            ElMessage.success('已交换性别和手机号列位置')
          }
        }
        break
      }

      case 'resetColumns': {
        // 重置所有列配置
        resetColumns?.()
        ElMessage.success('已重置所有列配置')
        break
      }

      default:
        console.warn('未知的列配置命令:', command)
    }
  }
</script>

<style scoped>
  .user-info .el-avatar {
    flex-shrink: 0;
    width: 40px !important;
    height: 40px !important;
  }

  .user-info .el-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .custom-header:hover {
    color: var(--el-color-primary-light-3);
  }

  .demo-group .config-toggles .el-switch {
    --el-switch-on-color: var(--el-color-primary);
  }

  .demo-group .performance-info .el-alert {
    --el-alert-padding: 12px;
  }
</style>
