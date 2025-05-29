import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TableSizeEnum } from '@/enums/formEnum'

// 表格
export const useTableStore = defineStore(
  'tableStore',
  () => {
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

    return {
      tableSize,
      isZebra,
      isBorder,
      isHeaderBackground,
      setTableSize,
      setIsZebra,
      setIsBorder,
      setIsHeaderBackground
    }
  },
  {
    persist: {
      key: 'table',
      storage: localStorage
    }
  }
)
