/**
 * API Select 配置预设
 * 提供常用场景的预设配置
 */

import type { ApiSelectProps } from './types'

/**
 * 基础预设（默认配置）
 */
export const basicPreset: Partial<ApiSelectProps> = {
  immediate: true,
  loadOn: 'mounted',
  labelField: 'label',
  valueField: 'value',
  dataPath: 'data',
  debounce: 300
}

/**
 * 远程搜索预设
 * 适用于需要搜索的大数据量选择
 */
export const remotePreset: Partial<ApiSelectProps> = {
  ...basicPreset,
  remote: true,
  remoteQueryKey: 'keyword',
  remoteDebounce: 300,
  remoteMinLength: 1
}

/**
 * 所有预设集合
 */
export const presets = {
  basic: basicPreset,
  remote: remotePreset
}

/**
 * 预设类型
 */
export type PresetType = keyof typeof presets

/**
 * 应用预设
 */
export function applyPreset(
  preset: PresetType | Partial<ApiSelectProps>,
  customConfig?: Partial<ApiSelectProps>
): Partial<ApiSelectProps> {
  const baseConfig = typeof preset === 'string' ? presets[preset] : preset
  return {
    ...baseConfig,
    ...customConfig
  }
}

/**
 * 导出所有预设供使用
 */
export default presets
