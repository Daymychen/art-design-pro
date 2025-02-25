<template>
  <div class="page-content">
    <ExcelImport @import-success="handleImportSuccess" @import-error="handleImportError">
      <template #import-text> 上传 Excel </template>
    </ExcelImport>

    <ExcelExport
      style="margin-left: 10px"
      :data="tableData"
      filename="用户数据"
      sheetName="用户列表"
      type="success"
      :headers="headers"
      @export-success="handleExportSuccess"
      @export-error="handleExportError"
    >
      导出 Excel
    </ExcelExport>

    <el-button type="danger" @click="handleClear" v-ripple>清除数据</el-button>

    <art-table :data="tableData" style="margin-top: 10px">
      <el-table-column
        v-for="key in Object.keys(headers)"
        :key="key"
        :prop="key"
        :label="headers[key as keyof typeof headers]"
      />
    </art-table>
  </div>
</template>

<script setup lang="ts">
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

  const handleExportSuccess = () => {
    ElMessage.success('导出成功')
  }

  const handleExportError = (error: Error) => {
    ElMessage.error(`导出失败: ${error.message}`)
  }

  const handleClear = () => {
    tableData.value = []
  }
</script>
