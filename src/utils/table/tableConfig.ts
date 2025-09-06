/**
 * 表格响应数据配置
 * 用于自动匹配后端返回的数据响应字段，用户可以自行扩展
 */
export const tableConfig = {
  // 列表字段
  recordFields: ['list', 'data', 'records', 'items', 'result', 'rows'],
  // 总数字段
  totalFields: ['total', 'count'],
  // 当前页码字段
  currentFields: ['current', 'page', 'pageNum'],
  // 每页大小字段
  sizeFields: ['size', 'pageSize', 'limit']
}
