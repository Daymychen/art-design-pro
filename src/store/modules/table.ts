import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TableSizeEnum } from '@/enums/formEnum'
import { getSysStorage } from '@/utils/storage'

// 表格
export const useTableStore = defineStore('tableStore', () => {
  const tableSize = ref(TableSizeEnum.DEFAULT)

  const setTableSize = (size: TableSizeEnum) => (tableSize.value = size)

  const initState = () => {
    const sysStorage = getSysStorage()
    if (sysStorage) {
      const sys = JSON.parse(sysStorage)
      const { table } = sys.user
      tableSize.value = table.tableSize || TableSizeEnum.DEFAULT
    }
  }

  return {
    tableSize,
    setTableSize,
    initState
  }
})
