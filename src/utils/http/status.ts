/**
 * 接口状态码
 */
export enum ApiStatus {
  success = 200, // 成功
  error = 400, // 错误
  unauthorized = 401, // 未授权
  forbidden = 403, // 禁止访问
  notFound = 404, // 未找到
  methodNotAllowed = 405, // 方法不允许
  internalServerError = 500 // 服务器错误
}
