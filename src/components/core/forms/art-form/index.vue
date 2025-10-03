<!-- 表单组件 -->
<!-- 支持常用表单组件、自定义组件、插槽、校验、隐藏表单项 -->
<!-- 写法同 ElementPlus 官方文档组件，把属性写在 props 里面就可以了 -->
<template>
  <section class="art-form">
    <ElForm
      ref="formRef"
      :model="modelValue"
      :label-position="labelPosition"
      :rules="generateFormRules"
      v-bind="$attrs"
    >
      <!-- 处理表单分组和普通表单项 -->
      <template v-for="item in visibleFormItems" :key="item.key">
        <!-- 表单分组 -->
        <ElCollapse
          v-if="item.type === 'group' && item.groupConfig"
          v-model="groupExpandedKeys"
          class="form-group"
        >
          <ElCollapseItem
            :name="item.key"
            :title="item.groupConfig.title || item.label"
            :disabled="!item.groupConfig.collapsible"
          >
            <ElRow class="flex flex-wrap" :gutter="gutter">
              <ElCol
                v-for="childItem in item.groupConfig.children.filter(
                  (child) => !isItemHidden(child)
                )"
                :key="childItem.key"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="childItem.span || span"
                :xl="childItem.span || span"
              >
                <!-- 子表单项渲染 -->
                <FormItemRender
                  :item="childItem"
                  :modelValue="modelValue"
                  :labelWidth="props.labelWidth"
                  :disabled="props.disabled"
                  :readonly="props.readonly"
                  :getComponent="getComponent"
                  :getProps="getProps"
                  :getSlots="getSlots"
                  @add-array-item="addArrayItem"
                  @remove-array-item="removeArrayItem"
                  @update:field="updateField"
                >
                  <!-- 透传表单项插槽 -->
                  <template v-if="$slots[childItem.key]" #[childItem.key]="slotProps">
                    <slot :name="childItem.key" v-bind="slotProps" />
                  </template>
                </FormItemRender>
              </ElCol>
            </ElRow>
          </ElCollapseItem>
        </ElCollapse>

        <!-- 普通表单项（非分组） -->
        <ElRow v-else class="flex flex-wrap" :gutter="gutter">
          <ElCol :xs="24" :sm="12" :md="8" :lg="item.span || span" :xl="item.span || span">
            <FormItemRender
              :item="item"
              :modelValue="modelValue"
              :labelWidth="props.labelWidth"
              :disabled="props.disabled"
              :readonly="props.readonly"
              :getComponent="getComponent"
              :getProps="getProps"
              :getSlots="getSlots"
              @add-array-item="addArrayItem"
              @remove-array-item="removeArrayItem"
              @update:field="updateField"
            >
              <!-- 透传表单项插槽 -->
              <template v-if="$slots[item.key]" #[item.key]="slotProps">
                <slot :name="item.key" v-bind="slotProps" />
              </template>
            </FormItemRender>
          </ElCol>
        </ElRow>
      </template>
    </ElForm>
  </section>
</template>

<script setup lang="ts">
  import type { Component, VNode } from 'vue'
  import type { FormInstance } from 'element-plus'
  import type { FormRule, FormProps, FormItem } from '@/types/component/form'
  import { componentMap } from './componentMap'
  import FormItemRender from './FormItemRender.vue'
  import { useFormGroup } from './useFormGroup'

  defineOptions({ name: 'ArtForm' })

  const formInstance = useTemplateRef<FormInstance>('formRef')

  const props = withDefaults(defineProps<FormProps>(), {
    items: () => [],
    span: 6,
    gutter: 12,
    labelPosition: 'right',
    labelWidth: '80px',
    disabled: false,
    readonly: false,
    rules: () => ({})
  })

  const modelValue = defineModel<Record<string, any>>({ default: {} })

  /**
   * 分组展开状态管理（使用 composable）
   * 职责：
   * - 管理分组的展开/折叠状态
   * - 响应表单项配置的动态变化
   * - 智能同步：新增分组自动展开，删除分组自动清理
   * - 保留用户手动操作的状态
   */
  const { groupExpandedKeys } = useFormGroup({
    items: () => props.items
  })

  const rootProps = [
    'label',
    'labelWidth',
    'key',
    'type',
    'hidden',
    'span',
    'slots',
    'rules',
    'required',
    'requiredMessage',
    'disabled',
    'readonly',
    'defaultValue',
    'tooltip',
    'help',
    'transform',
    'dependencies',
    'arrayConfig',
    'groupConfig'
  ]

  /**
   * 遍历所有表单项（包括分组内的子项）
   * 抽取公共遍历逻辑，避免重复代码
   * @param items - 表单项数组
   * @param callback - 对每个非分组表单项执行的回调
   */
  const traverseFormItems = (items: FormItem[], callback: (item: FormItem) => void) => {
    items.forEach((item) => {
      if (item.type === 'group' && item.groupConfig?.children) {
        // 递归处理分组内的子项
        traverseFormItems(item.groupConfig.children, callback)
      } else if (item.type !== 'group') {
        // 处理普通表单项
        callback(item)
      }
    })
  }

  // 生成内部验证规则
  const generateFormRules = computed(() => {
    const internalRules: Record<string, FormRule[]> = {}

    traverseFormItems(props.items, (item) => {
      const itemRules: FormRule[] = []

      // 处理快捷必填配置
      if (item.required) {
        itemRules.push({
          required: true,
          message: item.requiredMessage || `请输入${item.label}`,
          trigger: 'blur'
        })
      }

      // 处理详细规则配置
      if (item.rules && item.rules.length > 0) {
        itemRules.push(...item.rules)
      }

      // 如果有规则，添加到内部规则对象中
      if (itemRules.length > 0) {
        internalRules[item.key] = itemRules
      }
    })

    // 合并外部传入的 rules (外部优先级更高)
    return { ...internalRules, ...props.rules }
  })

  const getProps = (item: FormItem): Record<string, any> => {
    // 基础属性处理
    let itemProps: Record<string, any>
    if (item.props) {
      itemProps = { ...item.props }
    } else {
      itemProps = { ...item }
      rootProps.forEach((key) => delete itemProps[key])
    }

    // 处理禁用状态：item.disabled 优先级高于全局 disabled
    if (item.disabled !== undefined) {
      itemProps.disabled = item.disabled
    } else if (props.disabled) {
      itemProps.disabled = true
    }

    // 处理只读状态：item.readonly 优先级高于全局 readonly
    if (item.readonly !== undefined) {
      itemProps.readonly = item.readonly
    } else if (props.readonly) {
      itemProps.readonly = true
    }

    // 处理 placeholder
    if (item.placeholder && !itemProps.placeholder) {
      itemProps.placeholder = item.placeholder
    }

    return itemProps
  }

  // 获取插槽
  const getSlots = (item: FormItem): Record<string, () => VNode> => {
    if (!item.slots) return {}
    const validSlots: Record<string, () => VNode> = {}
    Object.entries(item.slots).forEach(([key, slotFn]) => {
      if (slotFn) {
        validSlots[key] = slotFn
      }
    })
    return validSlots
  }

  // 组件
  const getComponent = (item: Partial<FormItem>): Component | string => {
    const { type } = item
    if (type && typeof type !== 'string') return type as Component
    // type不传递、默认使用 input
    return componentMap[type as keyof typeof componentMap] || componentMap['input']
  }

  /**
   * 判断表单项是否隐藏
   */
  const isItemHidden = (item: FormItem) => {
    if (typeof item.hidden === 'function') {
      return item.hidden(modelValue.value)
    }
    return !!item.hidden
  }

  /**
   * 可见的表单项
   */
  const visibleFormItems = computed(() => {
    return props.items.filter((item) => !isItemHidden(item))
  })

  /**
   * 初始化默认值
   * 注意：分组展开状态由 watch 自动处理，这里不再重复处理
   */
  const initDefaultValues = () => {
    // 处理所有表单项的默认值
    traverseFormItems(props.items, (item) => {
      // 应用默认值
      if (item.defaultValue !== undefined && modelValue.value[item.key] === undefined) {
        modelValue.value[item.key] = item.defaultValue
      }

      // 应用输入转换
      if (item.transform?.input && modelValue.value[item.key] !== undefined) {
        modelValue.value[item.key] = item.transform.input(
          modelValue.value[item.key],
          modelValue.value
        )
      }

      // 初始化动态数组字段
      if (item.type === 'array' && !modelValue.value[item.key]) {
        const min = item.arrayConfig?.min || 1
        modelValue.value[item.key] = Array(min).fill('')
      }
    })
  }

  // 组件挂载时初始化默认值
  onMounted(() => {
    initDefaultValues()
  })

  /**
   * 处理字段依赖验证
   * 当指定字段变化时，重新验证所有依赖该字段的表单项
   */
  const handleFieldDependencies = (changedKey: string) => {
    // 收集所有依赖当前字段的表单项
    const dependentItems: FormItem[] = []

    traverseFormItems(props.items, (item) => {
      if (item.dependencies?.includes(changedKey)) {
        dependentItems.push(item)
      }
    })

    // 异步验证依赖项
    if (dependentItems.length > 0) {
      nextTick(() => {
        dependentItems.forEach((item) => {
          formInstance.value?.validateField(item.key).catch(() => {
            // 忽略验证错误，避免控制台警告
          })
        })
      })
    }
  }

  /**
   * 清空表单
   */
  const clearForm = () => {
    // 重置表单字段（UI 层）
    formInstance.value?.resetFields()

    // 收集所有表单项的 key（包括分组内的）
    const allKeys: string[] = []
    traverseFormItems(props.items, (item) => {
      allKeys.push(item.key)
    })

    // 清空所有表单项值（包含隐藏项）
    Object.assign(modelValue.value, Object.fromEntries(allKeys.map((key) => [key, undefined])))
  }

  /**
   * 重置表单到初始值
   */
  const resetForm = () => {
    if (props.initialValues) {
      // 如果提供了 initialValues，恢复到指定的初始值
      Object.assign(modelValue.value, { ...props.initialValues })
    } else {
      // 否则使用 Element Plus 原生方法，恢复到表单注册时的初始值
      formInstance.value?.resetFields()
    }
    // 清空验证
    formInstance.value?.clearValidate()
  }

  /**
   * 获取提交数据（应用 transform.output）
   */
  const getSubmitData = () => {
    const submitData: Record<string, any> = { ...modelValue.value }

    traverseFormItems(props.items, (item) => {
      // 应用输出转换
      if (item.transform?.output && submitData[item.key] !== undefined) {
        submitData[item.key] = item.transform.output(submitData[item.key], submitData)
      }
    })

    return submitData
  }

  /**
   * 递归查找表单项（包括分组内的子项）
   */
  const findFormItem = (key: string, items: FormItem[] = props.items): FormItem | undefined => {
    for (const item of items) {
      if (item.key === key) {
        return item
      }
      // 如果是分组，递归查找子项
      if (item.type === 'group' && item.groupConfig?.children) {
        const found = findFormItem(key, item.groupConfig.children)
        if (found) return found
      }
    }
    return undefined
  }

  /**
   * 更新字段值
   * 性能优化：在此统一处理 onChange 回调和依赖验证，避免使用 deep watch
   */
  const updateField = (key: string, value: any) => {
    // 更新字段值
    modelValue.value[key] = value

    // 触发 onChange 回调
    if (props.onChange) {
      props.onChange(key, value, { ...modelValue.value })
    }

    // 处理字段依赖验证
    handleFieldDependencies(key)
  }

  /**
   * 动态数组字段操作
   */
  const addArrayItem = (key: string) => {
    const item = findFormItem(key)
    if (!item || item.type !== 'array') return

    const currentArray = modelValue.value[key] || []
    const max = item.arrayConfig?.max || Infinity

    if (currentArray.length < max) {
      modelValue.value[key] = [...currentArray, '']
    }
  }

  const removeArrayItem = (key: string, index: number) => {
    const item = findFormItem(key)
    if (!item || item.type !== 'array') return

    const currentArray = modelValue.value[key] || []
    const min = item.arrayConfig?.min || 0

    if (currentArray.length > min) {
      const newArray = [...currentArray]
      newArray.splice(index, 1)
      modelValue.value[key] = newArray
    }
  }

  /**
   * 暴露方法供外部调用
   */
  defineExpose({
    /** 表单实例 */
    formRef: formInstance,
    /** 验证表单 */
    validate: (callback?: (valid: boolean, fields?: Record<string, any>) => void) =>
      formInstance.value?.validate(callback),
    /** 验证指定字段 */
    validateField: (props: string | string[], callback?: (valid: boolean) => void) =>
      formInstance.value?.validateField(props, callback),
    /** 重置表单字段（Element Plus 原生方法，仅重置可见字段） */
    resetFields: () => formInstance.value?.resetFields(),
    /** 清空验证 */
    clearValidate: (props?: string | string[]) => formInstance.value?.clearValidate(props),
    /** 滚动到指定字段 */
    scrollToField: (prop: string) => formInstance.value?.scrollToField(prop),
    /** 清空表单（所有字段清空为 undefined） */
    clear: clearForm,
    /** 重置表单（恢复到初始值） */
    reset: resetForm,
    /** 获取提交数据（应用 transform） */
    getSubmitData,
    /** 添加数组项 */
    addArrayItem,
    /** 删除数组项 */
    removeArrayItem
  })

  // 解构 props 以便在模板中直接使用
  const { span, gutter, labelPosition } = toRefs(props)
</script>

<style lang="scss" scoped>
  .art-form {
    // 表单分组
    .form-group {
      margin-bottom: 16px;

      :deep(.el-collapse-item__header) {
        font-size: 14px;
        font-weight: 600;
      }

      :deep(.el-collapse-item__content) {
        padding-bottom: 0;
      }
    }
  }
</style>
