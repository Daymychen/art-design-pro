/**
 * 表格全局配置模块
 *
 * 提供表格与后端接口的字段映射配置
 *
 * ## 主要功能
 *
 * - 响应数据字段自动识别和映射
 * - 支持多种常见的后端响应格式
 * - 请求参数字段映射配置
 * - 可扩展的字段配置机制
 *
 * ## 使用场景
 *
 * - 适配不同后端的分页接口格式
 * - 统一前端表格组件的数据处理
 * - 减少重复的数据转换代码
 * - 支持多个后端服务的接口对接
 *
 * ## 配置说明
 *
 * - recordFields: 列表数据字段名（按优先级顺序查找）
 * - totalFields: 总条数字段名
 * - currentFields: 当前页码字段名
 * - sizeFields: 每页大小字段名
 * - paginationKey: 前端发送请求时使用的分页参数名
 *
 * ## 扩展方式
 *
 * 如果后端使用其他字段名，可以在对应数组中添加新的字段名
 * 例如：recordFields: ['list', 'data', 'records', 'items', 'yourCustomField']
 *
 * @module utils/table/tableConfig
 * @author Art Design Pro Team
 */
export const tableConfig = {
  // 响应数据字段映射配置，系统会从接口返回数据中按顺序查找这些字段
  // 列表数据
  recordFields: ['list', 'data', 'records', 'items', 'result', 'rows'],
  // 总条数
  totalFields: ['total', 'count'],
  // 当前页码
  currentFields: ['current', 'page', 'pageNum'],
  // 每页大小
  sizeFields: ['size', 'pageSize', 'limit'],

  // 请求参数映射配置，前端发送请求时使用的分页参数名
  // useTable 组合式函数传递分页参数的时候 用 current 跟 size
  paginationKey: {
    // 当前页码
    current: 'current',
    // 每页大小
    size: 'size'
  }
}
