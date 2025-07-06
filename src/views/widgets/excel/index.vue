<template>
  <div class="page-content">
    <ArtExcelImport @import-success="handleImportSuccess" @import-error="handleImportError">
      <template #import-text> 上传 Excel </template>
    </ArtExcelImport>

    <ArtExcelExport
      style="margin-left: 10px"
      :data="tableData"
      filename="用户数据-1"
      sheetName="用户列表"
      type="success"
      :headers="headers"
      auto-index
      :columns="columnConfig"
      @export-success="handleExportSuccess"
      @export-error="handleExportError"
      @export-progress="handleProgress"
    >
      导出 Excel
    </ArtExcelExport>

    <ElButton type="danger" @click="handleClear" v-ripple>清除数据</ElButton>

    <ArtTable :data="tableData" style="margin-top: 10px">
      <ElTableColumn
        v-for="key in Object.keys(headers)"
        :key="key"
        :prop="key"
        :label="headers[key as keyof typeof headers]"
      />
    </ArtTable>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  interface TableData {
    name: string
    age: number
    city: string
  }

  const handleImportSuccess = (data: any[]) => {
    // 将导入的数据转换为正确的格式
    const formattedData = data.map((item) => ({
      name: item['姓名'],
      age: Number(item['年龄']),
      city: item['城市']
    }))
    tableData.value = formattedData

    // tableData.value = data
  }

  const handleImportError = (error: Error) => {
    // 处理导入错误
    console.error('导入失败:', error)
  }

  // 使用类型化的ref
  const tableData = ref<TableData[]>([
    { name: '李四', age: 20, city: '上海' },
    { name: '张三', age: 25, city: '北京' },
    { name: '王五', age: 30, city: '广州' },
    { name: '赵六', age: 35, city: '深圳' },
    { name: '孙七', age: 28, city: '杭州' },
    { name: '周八', age: 32, city: '成都' },
    { name: '吴九', age: 27, city: '武汉' },
    { name: '郑十', age: 40, city: '南京' },
    { name: '刘一', age: 22, city: '重庆' },
    { name: '陈二', age: 33, city: '西安' }
  ])

  // 自定义表头映射
  const headers = {
    name: '姓名',
    age: '年龄',
    city: '城市'
  }

  const columnConfig = {
    name: {
      title: '姓名',
      width: 20,
      formatter: (value: any) => value || '未知'
    },
    age: {
      title: '年龄',
      width: 10,
      formatter: (value: any) => `${value}岁`
    },
    city: {
      title: '城市',
      width: 12,
      formatter: (value: any) => `${value}市`
    }
  }

  const handleExportSuccess = () => {
    console.log('导出成功')
  }

  const handleExportError = (error: Error) => {
    ElMessage.error(`导出失败: ${error.message}`)
  }

  const handleProgress = (progress: number) => {
    console.log('导出进度:', progress)
  }

  const handleClear = () => {
    tableData.value = []
  }
</script>
