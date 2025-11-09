/**
 * 表格状态管理模块
 *
 * 提供表格显示配置的状态管理
 *
 * ## 主要功能
 *
 * - 表格尺寸配置（紧凑、默认、宽松）
 * - 斑马纹显示开关
 * - 边框显示开关
 * - 表头背景显示开关
 * - 全屏模式开关
 *
 * ## 使用场景
 * - 表格组件样式配置
 * - 用户表格偏好设置
 * - 表格工具栏功能控制
 *
 * ## 持久化
 *
 * - 使用 localStorage 存储
 * - 存储键：sys-v{version}-table
 * - 用户配置跨页面保持
 *
 * @module store/modules/table
 * @author Art Design Pro Team
 */
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

    // 是否全屏
    const isFullScreen = ref(false)

    /**
     * 设置表格大小
     * @param size 表格大小枚举值
     */
    const setTableSize = (size: TableSizeEnum) => (tableSize.value = size)

    /**
     * 设置斑马纹显示状态
     * @param value 是否显示斑马纹
     */
    const setIsZebra = (value: boolean) => (isZebra.value = value)

    /**
     * 设置表格边框显示状态
     * @param value 是否显示边框
     */
    const setIsBorder = (value: boolean) => (isBorder.value = value)

    /**
     * 设置表头背景显示状态
     * @param value 是否显示表头背景
     */
    const setIsHeaderBackground = (value: boolean) => (isHeaderBackground.value = value)

    /**
     * 设置是否全屏
     * @param value 是否全屏
     */
    const setIsFullScreen = (value: boolean) => (isFullScreen.value = value)

    return {
      tableSize,
      isZebra,
      isBorder,
      isHeaderBackground,
      setTableSize,
      setIsZebra,
      setIsBorder,
      setIsHeaderBackground,
      isFullScreen,
      setIsFullScreen
    }
  },
  {
    persist: {
      key: 'table',
      storage: localStorage
    }
  }
)
