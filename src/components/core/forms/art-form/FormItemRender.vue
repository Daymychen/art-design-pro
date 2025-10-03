<!-- 表单项渲染器 - 抽取重复的表单项渲染逻辑 -->
<template>
  <ElFormItem
    :label="item.label"
    :prop="item.key"
    :label-width="item.label ? item.labelWidth || labelWidth : undefined"
  >
    <!-- Label 插槽：添加 tooltip -->
    <template v-if="item.tooltip" #label>
      <span>
        {{ item.label }}
        <ElTooltip :content="item.tooltip" placement="top">
          <ElIcon style="margin-left: 4px; cursor: help">
            <QuestionFilled />
          </ElIcon>
        </ElTooltip>
      </span>
    </template>

    <slot :name="item.key" :item="item" :modelValue="modelValue">
      <!-- 动态数组字段 -->
      <template v-if="item.type === 'array'">
        <div v-for="(arrayItem, index) in modelValue[item.key]" :key="index" class="array-item">
          <component
            :is="getComponent({ type: item.arrayConfig?.itemType || 'input' })"
            v-model="editableModel[item.key][index]"
            v-bind="item.arrayConfig?.itemProps || {}"
            :placeholder="item.placeholder"
            style="width: calc(100% - 40px); margin-right: 8px"
          />
          <ElButton
            v-if="item.arrayConfig?.showActions !== false"
            type="danger"
            :icon="Delete"
            circle
            size="small"
            :disabled="(modelValue[item.key]?.length || 0) <= (item.arrayConfig?.min || 0)"
            @click="$emit('remove-array-item', item.key, index)"
          />
        </div>
        <ElButton
          v-if="item.arrayConfig?.showActions !== false"
          type="primary"
          :icon="Plus"
          size="small"
          :disabled="(modelValue[item.key]?.length || 0) >= (item.arrayConfig?.max || Infinity)"
          @click="$emit('add-array-item', item.key)"
          class="flex items-center"
        >
          {{ item.arrayConfig?.addText || '添加' }}
        </ElButton>
      </template>

      <!-- 普通表单组件 -->
      <component
        v-else
        :is="getComponent(item)"
        v-model="editableModel[item.key]"
        v-bind="getProps(item)"
      >
        <!-- 下拉选择 -->
        <template v-if="item.type === 'select' && getProps(item)?.options">
          <ElOption v-for="option in getProps(item).options" v-bind="option" :key="option.value" />
        </template>

        <!-- 复选框组 -->
        <template v-if="item.type === 'checkboxgroup' && getProps(item)?.options">
          <ElCheckbox
            v-for="option in getProps(item).options"
            v-bind="option"
            :key="option.value"
          />
        </template>

        <!-- 单选框组 -->
        <template v-if="item.type === 'radiogroup' && getProps(item)?.options">
          <ElRadio v-for="option in getProps(item).options" v-bind="option" :key="option.value" />
        </template>

        <!-- 动态插槽支持 -->
        <template v-for="(slotFn, slotName) in getSlots(item)" :key="slotName" #[slotName]>
          <component :is="slotFn" />
        </template>
      </component>
    </slot>

    <!-- 帮助文本 -->
    <div v-if="item.help" class="form-item-help">
      {{ item.help }}
    </div>
  </ElFormItem>
</template>

<script setup lang="ts">
  import type { FormItem } from '@/types/component/form'
  import { QuestionFilled, Delete, Plus } from '@element-plus/icons-vue'

  defineOptions({ name: 'FormItemRender' })

  interface Props {
    item: FormItem
    modelValue: Record<string, any>
    labelWidth?: string | number
    disabled?: boolean
    readonly?: boolean
    getComponent: (item: Partial<FormItem>) => any
    getProps: (item: FormItem) => Record<string, any>
    getSlots: (item: FormItem) => Record<string, () => any>
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    'add-array-item': [key: string]
    'remove-array-item': [key: string, index: number]
    'update:field': [key: string, value: any]
  }>()

  // 创建一个可编辑的代理对象，拦截属性修改并通过事件通知父组件
  const editableModel = computed(() => {
    return new Proxy(props.modelValue, {
      set(_target, key, value) {
        emit('update:field', key as string, value)
        return true
      },
      get(target, key) {
        return target[key as string]
      }
    })
  })
</script>

<style lang="scss" scoped>
  // 表单项帮助文本
  .form-item-help {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--el-text-color-secondary);
  }

  // 动态数组项
  .array-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
