<template>
  <div>
    <div class="toolbar">
      <el-space wrap>
        <el-button @click="toggleFilter">
          {{ filterVisible ? '隐藏筛选' : '显示筛选' }}
        </el-button>
      </el-space>
    </div>

    <vxe-grid v-bind="gridOptions"></vxe-grid>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'

  // 筛选器显示状态
  const filterVisible = ref(true)

  // 基础列配置（不包含 filterRender）
  const baseColumns = [
    { field: 'name', title: 'Name' },
    { field: 'sex', title: 'Sex' },
    { field: 'age', title: 'Age' },
    { field: 'date', title: 'Date' }
  ]

  // 筛选器配置
  const filterRenderConfig = { name: 'VxeInput', props: { clearable: true } }

  /**
   * 生成带筛选的列配置
   */
  const getColumnsWithFilter = () => {
    return baseColumns.map((col) => ({
      ...col,
      filterRender: filterRenderConfig
    }))
  }

  // 表格配置
  const gridOptions = reactive({
    border: true,
    height: 400,
    floatingFilterConfig: {
      enabled: true
    },
    columns: getColumnsWithFilter(),
    data: [
      { id: 10001, name: 'Test1', role: 'Develop', sex: 'Woman', age: 28, date: '2025-10-01' },
      { id: 10002, name: 'Test2', role: 'Test', sex: 'Man', age: 22, date: '2025-10-02' },
      { id: 10003, name: 'Test3', role: 'PM', sex: 'Woman', age: 32, date: '2025-10-05' },
      { id: 10004, name: 'Test4', role: 'Designer', sex: 'Man', age: 54, date: '2025-10-14' },
      { id: 10005, name: 'Test5', role: 'Develop', sex: 'Man', age: 44, date: '2025-09-01' },
      { id: 10006, name: 'Test6', role: 'Develop', sex: 'Woman', age: 24, date: '2025-08-15' },
      { id: 10007, name: 'Test7', role: 'Test', sex: 'Man', age: 52, date: '2025-11-12' },
      { id: 10008, name: 'Test8', role: 'PM', sex: 'Woman', age: 34, date: '2025-11-27' },
      { id: 10009, name: 'Test9', role: 'PM', sex: 'Man', age: 24, date: '2025-10-18' },
      { id: 100010, name: 'Test10', role: 'Develop', sex: 'Woman', age: 24, date: '2025-10-25' }
    ]
  })

  /**
   * 切换筛选器显示/隐藏
   */
  const toggleFilter = () => {
    filterVisible.value = !filterVisible.value
    gridOptions.floatingFilterConfig.enabled = filterVisible.value

    // 动态切换列配置
    if (filterVisible.value) {
      // 显示筛选：添加 filterRender
      gridOptions.columns = getColumnsWithFilter() as any
    } else {
      // 隐藏筛选：移除 filterRender
      gridOptions.columns = baseColumns.map((col) => ({ ...col })) as any
    }
  }
</script>
