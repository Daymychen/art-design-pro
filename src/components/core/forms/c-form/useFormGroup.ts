/**
 * 表单分组展开状态管理 Composable
 * 职责：
 * 1. 管理分组的展开/折叠状态
 * 2. 响应表单项配置的动态变化
 * 3. 智能同步：新增分组自动展开，删除分组自动清理
 * 4. 保留用户手动操作的状态
 */

import { ref, watch } from 'vue'
import type { FormItem } from '@/types/component/form'

export interface UseFormGroupOptions {
  /** 表单项配置（响应式） */
  items: () => FormItem[]
}

export function useFormGroup(options: UseFormGroupOptions) {
  const { items } = options

  /**
   * 分组展开状态
   * 存储当前展开的分组 key 列表
   */
  const groupExpandedKeys = ref<string[]>([])

  /**
   * 收集当前所有分组的配置
   * @param formItems - 表单项数组
   * @returns Map<key, config> 分组配置映射
   */
  const collectGroupConfigs = (formItems: FormItem[]) => {
    const groups = new Map<string, { defaultExpanded: boolean }>()
    formItems.forEach((item) => {
      if (item.type === 'group') {
        groups.set(item.key, {
          defaultExpanded: item.groupConfig?.defaultExpanded !== false
        })
      }
    })
    return groups
  }

  /**
   * 记录上一次的分组配置
   * 用于检测哪些分组是新增的、哪些是删除的
   */
  let previousGroupConfigs = new Map<string, { defaultExpanded: boolean }>()

  /**
   * 智能同步分组展开状态
   * 监听表单项变化，自动处理：
   * 1. 新增分组：根据 defaultExpanded 配置自动展开
   * 2. 删除分组：从 groupExpandedKeys 中移除（避免内存泄漏）
   * 3. 保留用户手动操作：已存在的分组保持用户选择的状态
   */
  const syncGroupExpandedKeys = () => {
    const currentItems = items()
    const currentGroupConfigs = collectGroupConfigs(currentItems)
    const currentExpandedSet = new Set(groupExpandedKeys.value)

    // 1. 处理新增的分组
    currentGroupConfigs.forEach((config, key) => {
      if (!previousGroupConfigs.has(key)) {
        // 新增的分组，根据 defaultExpanded 配置决定是否展开
        if (config.defaultExpanded && !currentExpandedSet.has(key)) {
          groupExpandedKeys.value.push(key)
        }
      }
    })

    // 2. 清理已删除的分组（避免内存泄漏和状态混乱）
    const currentGroupKeys = new Set(currentGroupConfigs.keys())
    groupExpandedKeys.value = groupExpandedKeys.value.filter((key) => currentGroupKeys.has(key))

    // 3. 更新记录，用于下次对比
    previousGroupConfigs = currentGroupConfigs
  }

  /**
   * 监听表单项变化，自动同步分组状态
   * immediate: true 确保组件挂载时立即执行
   * deep: true 确保能检测到深层变化
   */
  watch(items, syncGroupExpandedKeys, { immediate: true, deep: true })

  return {
    /** 分组展开状态（响应式） */
    groupExpandedKeys,
    /** 手动同步分组状态（通常不需要调用，watch 会自动处理） */
    syncGroupExpandedKeys
  }
}
