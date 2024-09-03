export const getMessage = (status: number) => {
  let msg = ''
  switch (status) {
    case 400:
      msg = '请求错误(400)'
      break
    case 401:
      msg = '未授权，请重新登录(401)'
      break
    case 403:
      msg = '拒绝访问(403)'
      break
    case 404:
      msg = '请求出错(404)'
      break
    case 408:
      msg = '请求超时(408)'
      break
    case 500:
      msg = '服务器错误(500)'
      break
    case 501:
      msg = '服务未实现(501)'
      break
    case 502:
      msg = '网络错误(502)'
      break
    case 503:
      msg = '服务不可用(503)'
      break
    case 504:
      msg = '网络超时(504)'
      break
    case 505:
      msg = 'HTTP版本不受支持(505)'
      break
    default:
      msg = `连接出错(${status})!`
  }
  return `${msg}，请检查网络或联系管理员！`
}
