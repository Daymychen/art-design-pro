declare namespace Http {
  /** 基础响应 */
  interface BaseResponse<T = any> {
    // 状态码
    code: number
    // 消息
    msg: string
    // 数据
    data: T
  }
}
