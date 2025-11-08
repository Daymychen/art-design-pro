/**
 * 表单验证工具模块
 *
 * 提供全面的表单字段验证功能
 *
 * ## 主要功能
 *
 * - 手机号码验证（中国大陆格式）
 * - 固定电话验证（支持区号格式）
 * - 用户账号验证（字母开头，支持数字和下划线）
 * - 密码强度验证（普通密码、强密码）
 * - 密码强度评估（弱、中、强）
 * - IPv4 地址验证
 * - 邮箱地址验证（RFC 5322 标准）
 * - URL 地址验证
 * - 身份证号码验证（18位，含校验码验证）
 * - 银行卡号验证（Luhn 算法）
 * - 字符串空格处理
 *
 * ## 验证规则
 *
 * - 手机号：1开头，第二位3-9，共11位
 * - 账号：字母开头，5-20位，支持字母数字下划线
 * - 普通密码：6-20位，必须包含字母和数字
 * - 强密码：8-20位，必须包含大小写字母、数字和特殊字符
 * - 身份证：18位，含出生日期和校验码验证
 * - 银行卡：13-19位，通过 Luhn 算法验证
 *
 * @module utils/validation/formValidator
 * @author Art Design Pro Team
 */

/**
 * 密码强度级别枚举
 */
export enum PasswordStrength {
  WEAK = '弱',
  MEDIUM = '中',
  STRONG = '强'
}

/**
 * 去除字符串首尾空格
 * @param value 待处理的字符串
 * @returns 返回去除首尾空格后的字符串
 */
export function trimSpaces(value: string): string {
  if (typeof value !== 'string') {
    return ''
  }
  return value.trim()
}

/**
 * 验证手机号码（中国大陆）
 * @param value 手机号码字符串
 * @returns 返回验证结果，true表示格式正确
 */
export function validatePhone(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  // 中国大陆手机号码：1开头，第二位为3-9，共11位数字
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(value.trim())
}

/**
 * 验证固定电话号码（中国大陆）
 * @param value 电话号码字符串
 * @returns 返回验证结果，true表示格式正确
 */
export function validateTelPhone(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  // 支持格式：区号-号码，如：010-12345678、0755-1234567
  const telRegex = /^0\d{2,3}-?\d{7,8}$/
  return telRegex.test(value.trim().replace(/\s+/g, ''))
}

/**
 * 验证用户账号
 * @param value 账号字符串
 * @returns 返回验证结果，true表示格式正确
 * @description 规则：字母开头，5-20位，支持字母、数字、下划线
 */
export function validateAccount(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  // 字母开头，5-20位，支持字母、数字、下划线
  const accountRegex = /^[a-zA-Z][a-zA-Z0-9_]{4,19}$/
  return accountRegex.test(value.trim())
}

/**
 * 验证密码
 * @param value 密码字符串
 * @returns 返回验证结果，true表示格式正确
 * @description 规则：6-20位，必须包含字母和数字
 */
export function validatePassword(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim()

  // 长度检查
  if (trimmedValue.length < 6 || trimmedValue.length > 20) {
    return false
  }

  // 必须包含字母和数字
  const hasLetter = /[a-zA-Z]/.test(trimmedValue)
  const hasNumber = /\d/.test(trimmedValue)

  return hasLetter && hasNumber
}

/**
 * 验证强密码
 * @param value 密码字符串
 * @returns 返回验证结果，true表示格式正确
 * @description 规则：8-20位，必须包含大写字母、小写字母、数字和特殊字符
 */
export function validateStrongPassword(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim()

  // 长度检查
  if (trimmedValue.length < 8 || trimmedValue.length > 20) {
    return false
  }

  // 必须包含：大写字母、小写字母、数字、特殊字符
  const hasUpperCase = /[A-Z]/.test(trimmedValue)
  const hasLowerCase = /[a-z]/.test(trimmedValue)
  const hasNumber = /\d/.test(trimmedValue)
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(trimmedValue)

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
}

/**
 * 获取密码强度
 * @param value 密码字符串
 * @returns 返回密码强度：弱、中、强
 * @description 弱：纯数字/纯字母/纯特殊字符；中：两种组合；强：三种或以上组合
 */
export function getPasswordStrength(value: string): PasswordStrength {
  if (!value || typeof value !== 'string') {
    return PasswordStrength.WEAK
  }

  const trimmedValue = value.trim()

  if (trimmedValue.length < 6) {
    return PasswordStrength.WEAK
  }

  const hasUpperCase = /[A-Z]/.test(trimmedValue)
  const hasLowerCase = /[a-z]/.test(trimmedValue)
  const hasNumber = /\d/.test(trimmedValue)
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(trimmedValue)

  const typeCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length

  if (typeCount >= 3) {
    return PasswordStrength.STRONG
  } else if (typeCount >= 2) {
    return PasswordStrength.MEDIUM
  } else {
    return PasswordStrength.WEAK
  }
}

/**
 * 验证IPv4地址
 * @param value IP地址字符串
 * @returns 返回验证结果，true表示格式正确
 */
export function validateIPv4Address(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim()
  const ipRegex = /^((25[0-5]|2[0-4]\d|[01]?\d{1,2})\.){3}(25[0-5]|2[0-4]\d|[01]?\d{1,2})$/

  if (!ipRegex.test(trimmedValue)) {
    return false
  }

  // 额外检查每个段是否在有效范围内
  const segments = trimmedValue.split('.')
  return segments.every((segment) => {
    const num = parseInt(segment, 10)
    return num >= 0 && num <= 255
  })
}

/**
 * 验证邮箱地址
 * @param value 邮箱地址字符串
 * @returns 返回验证结果，true表示格式正确
 */
export function validateEmail(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim()

  // RFC 5322 标准的简化版邮箱正则
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  return emailRegex.test(trimmedValue) && trimmedValue.length <= 254
}

/**
 * 验证URL地址
 * @param value URL字符串
 * @returns 返回验证结果，true表示格式正确
 */
export function validateURL(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  try {
    new URL(value.trim())
    return true
  } catch {
    return false
  }
}

/**
 * 验证身份证号码（中国大陆）
 * @param value 身份证号码字符串
 * @returns 返回验证结果，true表示格式正确
 */
export function validateChineseIDCard(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim()

  // 18位身份证号码正则
  const idCardRegex =
    /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

  if (!idCardRegex.test(trimmedValue)) {
    return false
  }

  // 验证校验码
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(trimmedValue[i]) * weights[i]
  }

  const checkCode = checkCodes[sum % 11]
  return trimmedValue[17].toUpperCase() === checkCode
}

/**
 * 验证银行卡号
 * @param value 银行卡号字符串
 * @returns 返回验证结果，true表示格式正确
 */
export function validateBankCard(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim().replace(/\s+/g, '')

  // 银行卡号通常为13-19位数字
  if (!/^\d{13,19}$/.test(trimmedValue)) {
    return false
  }

  // Luhn算法验证
  let sum = 0
  let shouldDouble = false

  for (let i = trimmedValue.length - 1; i >= 0; i--) {
    let digit = parseInt(trimmedValue[i])

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit = (digit % 10) + 1
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}
