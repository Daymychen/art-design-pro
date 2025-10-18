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
  defineOptions({ name: 'WidgetsExcel' })

  /**
   * 表格数据类型定义
   */
  interface TableData {
    name: string
    age: number
    city: string
  }

  /**
   * 表格数据
   */
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

  /**
   * 表头映射配置
   * 用于 Excel 导入导出时的字段映射
   */
  const headers = {
    name: '姓名',
    age: '年龄',
    city: '城市'
  }

  /**
   * 列配置
   * 用于 Excel 导出时的列宽和格式化
   */
  const columnConfig = {
    name: {
      title: '姓名',
      width: 20,
      formatter: (value: unknown) => (value ? String(value) : '未知')
    },
    age: {
      title: '年龄',
      width: 10,
      formatter: (value: unknown) => (value ? `${value}岁` : '0岁')
    },
    city: {
      title: '城市',
      width: 12,
      formatter: (value: unknown) => (value ? `${value}市` : '未知')
    }
  }

  /**
   * 处理 Excel 导入成功
   * 将导入的数据转换为表格数据格式
   * @param data 导入的原始数据
   */
  const handleImportSuccess = (data: Array<Record<string, unknown>>) => {
    const formattedData: TableData[] = data.map((item) => ({
      name: String(item['姓名'] || ''),
      age: Number(item['年龄']) || 0,
      city: String(item['城市'] || '')
    }))
    tableData.value = formattedData
    ElMessage.success(`成功导入 ${formattedData.length} 条数据`)
  }

  /**
   * 处理 Excel 导入错误
   * @param error 错误对象
   */
  const handleImportError = (error: Error) => {
    console.error('导入失败:', error)
    ElMessage.error(`导入失败: ${error.message}`)
  }

  /**
   * 处理 Excel 导出成功
   */
  const handleExportSuccess = () => {
    console.log('导出成功')
    ElMessage.success('Excel 导出成功')
  }

  /**
   * 处理 Excel 导出错误
   * @param error 错误对象
   */
  const handleExportError = (error: Error) => {
    ElMessage.error(`导出失败: ${error.message}`)
  }

  /**
   * 处理导出进度
   * @param progress 导出进度百分比
   */
  const handleProgress = (progress: number) => {
    console.log('导出进度:', progress)
  }

  /**
   * 清空表格数据
   */
  const handleClear = () => {
    tableData.value = []
    ElMessage.info('已清空数据')
  }
</script>
