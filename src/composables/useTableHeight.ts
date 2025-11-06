import { computed, type Ref } from 'vue'

/**
 * 表格高度计算器配置接口
 */
interface TableHeightOptions {
  /** 是否显示表格头部 */
  showTableHeader: Ref<boolean>
  /** 分页器高度 */
  paginationHeight: Ref<number>
  /** 表格头部高度 */
  tableHeaderHeight: Ref<number>
  /** 分页器间距 */
  paginationSpacing: Ref<number>
}

/**
 * 表格高度计算器类
 */
class TableHeightCalculator {
  // 常量配置
  private static readonly DEFAULT_TABLE_HEADER_HEIGHT = 44
  private static readonly TABLE_HEADER_SPACING = 12

  constructor(private options: TableHeightOptions) {}

  /**
   * 计算容器高度
   */
  calculate(): { height: string } {
    const offset = this.calculateOffset()
    return {
      height: offset === 0 ? '100%' : `calc(100% - ${offset}px)`
    }
  }

  /**
   * 计算偏移量
   */
  private calculateOffset(): number {
    if (!this.options.showTableHeader.value) {
      return this.calculatePaginationOffset()
    }

    const headerHeight = this.getHeaderHeight()
    const paginationOffset = this.calculatePaginationOffset()

    return headerHeight + paginationOffset + TableHeightCalculator.TABLE_HEADER_SPACING
  }

  /**
   * 获取表格头部高度
   */
  private getHeaderHeight(): number {
    return this.options.tableHeaderHeight.value || TableHeightCalculator.DEFAULT_TABLE_HEADER_HEIGHT
  }

  /**
   * 计算分页器偏移量
   */
  private calculatePaginationOffset(): number {
    const { paginationHeight, paginationSpacing } = this.options
    return paginationHeight.value === 0 ? 0 : paginationHeight.value + paginationSpacing.value
  }
}

/**
 * 表格高度计算 Hook
 *
 * 提供表格容器高度的自动计算功能，支持：
 * - 表格头部高度
 * - 分页器高度
 * - 动态间距计算
 *
 * @param options 配置选项
 * @returns 容器高度计算结果
 */
export function useTableHeight(options: TableHeightOptions) {
  const containerHeight = computed(() => {
    const calculator = new TableHeightCalculator(options)
    return calculator.calculate()
  })

  return {
    /** 容器高度样式对象 */
    containerHeight
  }
}
