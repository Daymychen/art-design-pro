<template>
  <el-button :type="type" :loading="isExporting" v-ripple @click="handleExport">
    <slot>导出 Excel</slot>
  </el-button>
</template>

<script setup lang="ts">
  import * as XLSX from 'xlsx'
  import FileSaver from 'file-saver'
  import { ref } from 'vue'
  import type { ButtonType } from 'element-plus'
  import { useThrottleFn } from '@vueuse/core'

  interface ExportData {
    [key: string]: string | number | boolean | null
  }

  interface ExportOptions {
    data: ExportData[]
    filename?: string
    sheetName?: string
    type?: ButtonType
    autoIndex?: boolean
    headers?: Record<string, string>
  }

  const props = withDefaults(defineProps<ExportOptions>(), {
    filename: 'export',
    sheetName: 'Sheet1',
    type: 'primary',
    autoIndex: false,
    headers: () => ({})
  })

  const emit = defineEmits<{
    'export-success': []
    'export-error': [error: Error]
  }>()

  const isExporting = ref(false)

  const processData = (data: ExportData[]): ExportData[] => {
    const processedData = [...data]

    if (props.autoIndex) {
      return processedData.map((item, index) => ({
        序号: index + 1,
        ...Object.entries(item).reduce(
          (acc: Record<string, any>, [key, value]) => {
            acc[props.headers[key] || key] = value
            return acc
          },
          {} as Record<string, any>
        )
      }))
    }

    if (Object.keys(props.headers).length > 0) {
      return processedData.map((item) =>
        Object.entries(item).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [props.headers[key] || key]: value
          }),
          {}
        )
      )
    }

    return processedData
  }

  const exportToExcel = async (
    data: ExportData[],
    filename: string,
    sheetName: string
  ): Promise<void> => {
    try {
      const processedData = processData(data)
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(processedData)

      const maxWidth = 50
      const minWidth = 10
      const columnWidths = Object.keys(processedData[0] || {}).map((key) => {
        const keyLength = key.length
        return { wch: Math.min(Math.max(keyLength, minWidth), maxWidth) }
      })
      worksheet['!cols'] = columnWidths

      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      })

      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      FileSaver.saveAs(blob, `${filename}.xlsx`)
    } catch (error) {
      throw new Error(`Excel 导出失败: ${(error as Error).message}`)
    }
  }

  const handleExport = useThrottleFn(async () => {
    if (isExporting.value) return

    isExporting.value = true
    try {
      if (!props.data?.length) {
        throw new Error('没有可导出的数据')
      }

      await exportToExcel(props.data, props.filename, props.sheetName)
      emit('export-success')
    } catch (error) {
      emit('export-error', error as Error)
      console.error('Excel 导出错误:', error)
    } finally {
      isExporting.value = false
    }
  }, 1000)
</script>
