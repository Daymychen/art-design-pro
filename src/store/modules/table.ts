import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TableSizeEnum } from '@/enums/formEnum'
import { getSysStorage } from '@/utils/storage'

// 表格
export const useTableStore = defineStore('tableStore', () => {
  // 表格大小
  const tableSize = ref(TableSizeEnum.DEFAULT)
  // 斑马纹
  const isZebra = ref(false)
  // 边框
  const isBorder = ref(false)
  // 表头背景
  const isHeaderBackground = ref(false)

  const setTableSize = (size: TableSizeEnum) => (tableSize.value = size)
  const setIsZebra = (value: boolean) => (isZebra.value = value)
  const setIsBorder = (value: boolean) => (isBorder.value = value)
  const setIsHeaderBackground = (value: boolean) => (isHeaderBackground.value = value)

  const initState = () => {
    const sysStorage = getSysStorage()
    if (sysStorage) {
      const sys = JSON.parse(sysStorage)
      const { table } = sys.user
      tableSize.value = table.tableSize || TableSizeEnum.DEFAULT
      isZebra.value = table.isZebra || false
      isBorder.value = table.isBorder || false
      isHeaderBackground.value = table.isHeaderBackground || false
    }
  }

  return {
    tableSize,
    isZebra,
    isBorder,
    isHeaderBackground,
    setTableSize,
    initState,
    setIsZebra,
    setIsBorder,
    setIsHeaderBackground
  }
})
