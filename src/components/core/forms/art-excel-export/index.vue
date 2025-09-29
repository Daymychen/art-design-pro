<!-- 导出 Excel 文件 -->
<template>
  <ElButton
    :type="type"
    :size="size"
    :loading="isExporting"
    :disabled="disabled || !hasData"
    v-ripple
    @click="handleExport"
  >
    <template #loading>
      <ElIcon class="is-loading">
        <Loading />
      </ElIcon>
      {{ loadingText }}
    </template>
    <slot>{{ buttonText }}</slot>
  </ElButton>
</template>

<script setup lang="ts">
  import * as XLSX from 'xlsx'
  import FileSaver from 'file-saver'
  import { ref, computed, nextTick } from 'vue'
  import { Loading } from '@element-plus/icons-vue'
  import type { ButtonType } from 'element-plus'
  import { useThrottleFn } from '@vueuse/core'

  defineOptions({ name: 'ArtExcelExport' })

  /** 导出数据类型 */
  type ExportValue = string | number | boolean | null | undefined | Date

  interface ExportData {
    [key: string]: ExportValue
  }

  /** 列配置 */
  interface ColumnConfig {
    /** 列标题 */
    title: string
    /** 列宽度 */
    width?: number
    /** 数据格式化函数 */
    formatter?: (value: ExportValue, row: ExportData, index: number) => string
  }

  /** 导出配置选项 */
  interface ExportOptions {
    /** 数据源 */
    data: ExportData[]
    /** 文件名（不含扩展名） */
    filename?: string
    /** 工作表名称 */
    sheetName?: string
    /** 按钮类型 */
    type?: ButtonType
    /** 按钮尺寸 */
    size?: 'large' | 'default' | 'small'
    /** 是否禁用 */
    disabled?: boolean
    /** 按钮文本 */
    buttonText?: string
    /** 加载中文本 */
    loadingText?: string
    /** 是否自动添加序号列 */
    autoIndex?: boolean
    /** 序号列标题 */
    indexColumnTitle?: string
    /** 列配置映射 */
    columns?: Record<string, ColumnConfig>
    /** 表头映射（简化版本，向后兼容） */
    headers?: Record<string, string>
    /** 最大导出行数 */
    maxRows?: number
    /** 是否显示成功消息 */
    showSuccessMessage?: boolean
    /** 是否显示错误消息 */
    showErrorMessage?: boolean
    /** 工作簿配置 */
    workbookOptions?: {
      /** 创建者 */
      creator?: string
      /** 最后修改者 */
      lastModifiedBy?: string
      /** 创建时间 */
      created?: Date
      /** 修改时间 */
      modified?: Date
    }
  }

  const props = withDefaults(defineProps<ExportOptions>(), {
    filename: () => `export_${new Date().toISOString().slice(0, 10)}`,
    sheetName: 'Sheet1',
    type: 'primary',
    size: 'default',
    disabled: false,
    buttonText: '导出 Excel',
    loadingText: '导出中...',
    autoIndex: false,
    indexColumnTitle: '序号',
    columns: () => ({}),
    headers: () => ({}),
    maxRows: 100000,
    showSuccessMessage: true,
    showErrorMessage: true,
    workbookOptions: () => ({})
  })

  const emit = defineEmits<{
    'before-export': [data: ExportData[]]
    'export-success': [filename: string, rowCount: number]
    'export-error': [error: ExportError]
    'export-progress': [progress: number]
  }>()

  /** 导出错误类型 */
  class ExportError extends Error {
    constructor(
      message: string,
      public code: string,
      public details?: any
    ) {
      super(message)
      this.name = 'ExportError'
    }
  }

  const isExporting = ref(false)

  /** 是否有数据可导出 */
  const hasData = computed(() => Array.isArray(props.data) && props.data.length > 0)

  /** 验证导出数据 */
  const validateData = (data: ExportData[]): void => {
    if (!Array.isArray(data)) {
      throw new ExportError('数据必须是数组格式', 'INVALID_DATA_TYPE')
    }

    if (data.length === 0) {
      throw new ExportError('没有可导出的数据', 'NO_DATA')
    }

    if (data.length > props.maxRows) {
      throw new ExportError(`数据行数超过限制（${props.maxRows}行）`, 'EXCEED_MAX_ROWS', {
        currentRows: data.length,
        maxRows: props.maxRows
      })
    }
  }

  /** 格式化单元格值 */
  const formatCellValue = (
    value: ExportValue,
    key: string,
    row: ExportData,
    index: number
  ): string => {
    // 使用列配置的格式化函数
    const column = props.columns[key]
    if (column?.formatter) {
      return column.formatter(value, row, index)
    }

    // 处理特殊值
    if (value === null || value === undefined) {
      return ''
    }

    if (value instanceof Date) {
      return value.toLocaleDateString('zh-CN')
    }

    if (typeof value === 'boolean') {
      return value ? '是' : '否'
    }

    return String(value)
  }

  /** 处理数据 */
  const processData = (data: ExportData[]): Record<string, string>[] => {
    const processedData = data.map((item, index) => {
      const processedItem: Record<string, string> = {}

      // 添加序号列
      if (props.autoIndex) {
        processedItem[props.indexColumnTitle] = String(index + 1)
      }

      // 处理数据列
      Object.entries(item).forEach(([key, value]) => {
        // 获取列标题
        let columnTitle = key
        if (props.columns[key]?.title) {
          columnTitle = props.columns[key].title
        } else if (props.headers[key]) {
          columnTitle = props.headers[key]
        }

        // 格式化值
        processedItem[columnTitle] = formatCellValue(value, key, item, index)
      })

      return processedItem
    })

    return processedData
  }

  /** 计算列宽度 */
  const calculateColumnWidths = (data: Record<string, string>[]): XLSX.ColInfo[] => {
    if (data.length === 0) return []

    const sampleSize = Math.min(data.length, 100) // 只取前100行计算列宽
    const columns = Object.keys(data[0])

    return columns.map((column) => {
      // 使用配置的列宽度
      const configWidth = Object.values(props.columns).find((col) => col.title === column)?.width

      if (configWidth) {
        return { wch: configWidth }
      }

      // 自动计算列宽度
      const maxLength = Math.max(
        column.length, // 标题长度
        ...data.slice(0, sampleSize).map((row) => String(row[column] || '').length)
      )

      // 限制最小和最大宽度
      const width = Math.min(Math.max(maxLength + 2, 8), 50)
      return { wch: width }
    })
  }

  /** 导出到 Excel */
  const exportToExcel = async (
    data: ExportData[],
    filename: string,
    sheetName: string
  ): Promise<void> => {
    try {
      emit('export-progress', 10)

      // 处理数据
      const processedData = processData(data)
      emit('export-progress', 30)

      // 创建工作簿
      const workbook = XLSX.utils.book_new()

      // 设置工作簿属性
      if (props.workbookOptions) {
        workbook.Props = {
          Title: filename,
          Subject: '数据导出',
          Author: props.workbookOptions.creator || 'Art Design Pro',
          Manager: props.workbookOptions.lastModifiedBy || '',
          Company: '系统导出',
          Category: '数据',
          Keywords: 'excel,export,data',
          Comments: '由系统自动生成',
          CreatedDate: props.workbookOptions.created || new Date(),
          ModifiedDate: props.workbookOptions.modified || new Date()
        }
      }

      emit('export-progress', 50)

      // 创建工作表
      const worksheet = XLSX.utils.json_to_sheet(processedData)

      // 设置列宽度
      worksheet['!cols'] = calculateColumnWidths(processedData)

      emit('export-progress', 70)

      // 添加工作表到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

      emit('export-progress', 85)

      // 生成 Excel 文件
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        compression: true
      })

      // 创建 Blob 并下载
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      emit('export-progress', 95)

      // 使用时间戳确保文件名唯一
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const finalFilename = `${filename}_${timestamp}.xlsx`

      FileSaver.saveAs(blob, finalFilename)

      emit('export-progress', 100)

      // 等待下载开始
      await nextTick()

      return Promise.resolve()
    } catch (error) {
      throw new ExportError(`Excel 导出失败: ${(error as Error).message}`, 'EXPORT_FAILED', error)
    }
  }

  /** 处理导出 */
  const handleExport = useThrottleFn(async () => {
    if (isExporting.value) return

    isExporting.value = true

    try {
      // 验证数据
      validateData(props.data)

      // 触发导出前事件
      emit('before-export', props.data)

      // 执行导出
      await exportToExcel(props.data, props.filename, props.sheetName)

      // 触发成功事件
      emit('export-success', props.filename, props.data.length)

      // 显示成功消息
      if (props.showSuccessMessage) {
        ElMessage.success({
          message: `成功导出 ${props.data.length} 条数据`,
          duration: 3000
        })
      }
    } catch (error) {
      const exportError =
        error instanceof ExportError
          ? error
          : new ExportError(`导出失败: ${(error as Error).message}`, 'UNKNOWN_ERROR', error)

      // 触发错误事件
      emit('export-error', exportError)

      // 显示错误消息
      if (props.showErrorMessage) {
        ElMessage.error({
          message: exportError.message,
          duration: 5000
        })
      }

      console.error('Excel 导出错误:', exportError)
    } finally {
      isExporting.value = false
      emit('export-progress', 0)
    }
  }, 1000)

  // 暴露方法供父组件调用
  defineExpose({
    exportData: handleExport,
    isExporting: readonly(isExporting),
    hasData
  })
</script>

<style scoped>
  .is-loading {
    animation: rotating 2s linear infinite;
  }

  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
