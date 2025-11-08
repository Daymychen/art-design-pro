/**
 * 表单相关枚举定义模块
 *
 * ## 主要功能
 *
 * - 页面模式枚举（新增、编辑）
 * - 表格尺寸枚举（默认、紧凑、宽松）
 *
 * @module enums/formEnum
 * @author Art Design Pro Team
 */

// 页面类型
export enum PageModeEnum {
  Add, // 新增
  Edit // 编辑
}

// 表格大小
export enum TableSizeEnum {
  DEFAULT = 'default',
  SMALL = 'small',
  LARGE = 'large'
}
