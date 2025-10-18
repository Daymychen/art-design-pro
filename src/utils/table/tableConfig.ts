/**
 * 表格全局配置
 * 用于自动匹配后端接口的请求参数和响应字段，用户可以自行扩展或修改
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
