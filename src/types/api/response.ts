/**
 * 响应相关类型定义
 */

// 基础接口返回的数据结构
export interface BaseResponse<T = any> {
  // 状态码
  code: number
  // 消息
  msg: string
  // 数据
  data: T
  // 可选字段，用于返回 token
  token?: string
}

// 分页查询参数
export interface PaginationParams {
  // 当前页码
  page: number
  // 每页数量
  pageSize: number
  // 其他查询参数
  [key: string]: any
}

// 分页响应数据结构
export interface PaginationResponse<T> extends BaseResponse {
  // 当前页
  currentPage: number
  // 每页条数
  pageSize: number
  // 总页数
  lastPage: number
  // 总条数
  total: number
  // 数据列表
  data: T[]
}

// 列表响应数据结构
export interface ListResponse<T> extends BaseResponse {
  data: T[]
}

// 详情响应数据结构
export interface DetailResponse<T> extends BaseResponse {
  data: T
}

// 操作响应数据结构（增删改）
export interface OperationResponse extends BaseResponse {
  data: boolean | null
}
