<!-- API 异步选择器组件 - 极简版 -->
<template>
  <div class="api-select-wrapper">
    <ElSelect
      v-model="model"
      :loading="loading"
      :remote="remote"
      :remote-method="handleRemoteSearch"
      :filterable="remote"
      v-bind="$attrs"
      @focus="handleFocus"
      @visible-change="handleVisibleChange"
    >
      <!-- 普通选项 -->
      <ElOption
        v-for="option in options"
        :key="getOptionValue(option)"
        :label="getOptionLabel(option)"
        :value="getOptionValue(option)"
        :disabled="option.disabled"
      />

      <!-- 空状态 -->
      <template v-if="!loading && options.length === 0" #empty>
        <div class="api-select-empty">
          <!-- 错误状态 -->
          <template v-if="loadingState === 'error'">
            <div class="error-content">
              <ElIcon class="error-icon"><WarningFilled /></ElIcon>
              <div class="error-text">
                {{ errorText || '加载失败' }}
              </div>
              <ElButton type="primary" size="small" @click="manualRetry">重试</ElButton>
            </div>
          </template>

          <!-- 空数据状态 -->
          <template v-else>
            <div class="empty-content">
              <ElIcon class="empty-icon"><InfoFilled /></ElIcon>
              <div class="empty-text">
                {{ emptyText || '暂无数据' }}
              </div>
            </div>
          </template>
        </div>
      </template>
    </ElSelect>

    <!-- 加载提示（外部） -->
    <div v-if="loadingText && loading" class="api-select-loading-tip">
      {{ loadingText }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { WarningFilled, InfoFilled } from '@element-plus/icons-vue'
  import type { ApiSelectProps, ApiSelectEmits } from './types'
  import { useApiSelect } from './useApiSelect'

  defineOptions({
    name: 'ApiSelect',
    inheritAttrs: false
  })

  // Props
  const props = withDefaults(defineProps<ApiSelectProps>(), {
    labelField: 'label',
    valueField: 'value',
    dataPath: 'data',
    immediate: true,
    loadOn: 'mounted',
    debounce: 300,
    remote: false,
    remoteQueryKey: 'keyword',
    remoteDebounce: 300,
    remoteMinLength: 0,
    params: () => ({})
  })

  // Emits
  const emit = defineEmits<ApiSelectEmits>()

  // Model
  const model = defineModel<any>()

  // 使用核心逻辑
  const {
    loading,
    loadingState,
    options,
    loadData,
    refresh,
    handleRemoteSearch,
    clearOptions,
    manualRetry,
    getOptionLabel,
    getOptionValue
  } = useApiSelect({
    ...props,
    modelValue: model,
    emit: emit as any
  })

  /**
   * 处理聚焦事件
   */
  const handleFocus = () => {
    if (props.loadOn === 'focus' && !loading.value && options.value.length === 0) {
      loadData()
    }
  }

  /**
   * 处理下拉显示状态变化
   */
  const handleVisibleChange = (visible: boolean) => {
    if (visible && props.loadOn === 'focus' && options.value.length === 0) {
      loadData()
    }
  }

  /**
   * 暴露方法供外部调用
   */
  defineExpose({
    /** 手动刷新数据 */
    refresh,
    /** 手动加载数据 */
    loadData,
    /** 获取当前选项列表 */
    getOptions: () => options.value,
    /** 清空选项 */
    clearOptions,
    /** 手动重试 */
    retry: manualRetry,
    /** 远程搜索 */
    search: handleRemoteSearch,
    /** 根据值查找选项 */
    findOptionByValue: (value: any) => options.value.find((opt) => getOptionValue(opt) === value),
    /** 根据多个值查找选项 */
    findOptionsByValues: (values: any[]) =>
      options.value.filter((opt) => values.includes(getOptionValue(opt)))
  })
</script>

<style lang="scss" scoped>
  .api-select-wrapper {
    position: relative;
    width: 100%;
  }

  .api-select-empty {
    padding: 16px;

    .error-content,
    .empty-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }

    .error-icon {
      font-size: 32px;
      color: var(--el-color-danger);
    }

    .empty-icon {
      font-size: 32px;
      color: var(--el-color-info);
    }

    .error-text,
    .empty-text {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .api-select-loading-tip {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-color-primary);
  }
</style>
