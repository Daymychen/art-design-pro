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
      v-bind="{ ...$attrs }"
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
            <ElRow class="form-row" :gutter="gutter">
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
                <ElFormItem
                  :label="childItem.label"
                  :prop="childItem.key"
                  :label-width="childItem.label ? childItem.labelWidth || labelWidth : undefined"
                >
                  <!-- Label 插槽：添加 tooltip -->
                  <template v-if="childItem.tooltip" #label>
                    <span>
                      {{ childItem.label }}
                      <ElTooltip :content="childItem.tooltip" placement="top">
                        <ElIcon style="margin-left: 4px; cursor: help">
                          <QuestionFilled />
                        </ElIcon>
                      </ElTooltip>
                    </span>
                  </template>

                  <slot :name="childItem.key" :item="childItem" :modelValue="modelValue">
                    <!-- 动态数组字段 -->
                    <template v-if="childItem.type === 'array'">
                      <div
                        v-for="(arrayItem, index) in modelValue[childItem.key]"
                        :key="index"
                        class="array-item"
                      >
                        <component
                          :is="getComponent({ type: childItem.arrayConfig?.itemType || 'input' })"
                          v-model="modelValue[childItem.key][index]"
                          v-bind="childItem.arrayConfig?.itemProps || {}"
                          :placeholder="childItem.placeholder"
                          style="width: calc(100% - 40px); margin-right: 8px"
                        />
                        <ElButton
                          v-if="childItem.arrayConfig?.showActions !== false"
                          type="danger"
                          :icon="Delete"
                          circle
                          size="small"
                          :disabled="
                            (modelValue[childItem.key]?.length || 0) <=
                            (childItem.arrayConfig?.min || 0)
                          "
                          @click="removeArrayItem(childItem.key, index)"
                        />
                      </div>
                      <ElButton
                        v-if="childItem.arrayConfig?.showActions !== false"
                        type="primary"
                        :icon="Plus"
                        size="small"
                        :disabled="
                          (modelValue[childItem.key]?.length || 0) >=
                          (childItem.arrayConfig?.max || Infinity)
                        "
                        @click="addArrayItem(childItem.key)"
                        class="array-add-btn"
                      >
                        {{ childItem.arrayConfig?.addText || '添加' }}
                      </ElButton>
                    </template>

                    <!-- 普通表单组件 -->
                    <component
                      v-else
                      :is="getComponent(childItem)"
                      v-model="modelValue[childItem.key]"
                      v-bind="getProps(childItem)"
                    >
                      <!-- 下拉选择 -->
                      <template v-if="childItem.type === 'select' && getProps(childItem)?.options">
                        <ElOption
                          v-for="option in getProps(childItem).options"
                          v-bind="option"
                          :key="option.value"
                        />
                      </template>

                      <!-- 复选框组 -->
                      <template
                        v-if="childItem.type === 'checkboxgroup' && getProps(childItem)?.options"
                      >
                        <ElCheckbox
                          v-for="option in getProps(childItem).options"
                          v-bind="option"
                          :key="option.value"
                        />
                      </template>

                      <!-- 单选框组 -->
                      <template
                        v-if="childItem.type === 'radiogroup' && getProps(childItem)?.options"
                      >
                        <ElRadio
                          v-for="option in getProps(childItem).options"
                          v-bind="option"
                          :key="option.value"
                        />
                      </template>

                      <!-- 动态插槽支持 -->
                      <template
                        v-for="(slotFn, slotName) in getSlots(childItem)"
                        :key="slotName"
                        #[slotName]
                      >
                        <component :is="slotFn" />
                      </template>
                    </component>
                  </slot>

                  <!-- 帮助文本 -->
                  <div v-if="childItem.help" class="form-item-help">
                    {{ childItem.help }}
                  </div>
                </ElFormItem>
              </ElCol>
            </ElRow>
          </ElCollapseItem>
        </ElCollapse>

        <!-- 普通表单项（非分组） -->
        <ElRow v-else class="form-row" :gutter="gutter">
          <ElCol :xs="24" :sm="12" :md="8" :lg="item.span || span" :xl="item.span || span">
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
                  <div
                    v-for="(arrayItem, index) in modelValue[item.key]"
                    :key="index"
                    class="array-item"
                  >
                    <component
                      :is="getComponent({ type: item.arrayConfig?.itemType || 'input' })"
                      v-model="modelValue[item.key][index]"
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
                      :disabled="
                        (modelValue[item.key]?.length || 0) <= (item.arrayConfig?.min || 0)
                      "
                      @click="removeArrayItem(item.key, index)"
                    />
                  </div>
                  <ElButton
                    v-if="item.arrayConfig?.showActions !== false"
                    type="primary"
                    :icon="Plus"
                    size="small"
                    :disabled="
                      (modelValue[item.key]?.length || 0) >= (item.arrayConfig?.max || Infinity)
                    "
                    @click="addArrayItem(item.key)"
                    class="array-add-btn"
                  >
                    {{ item.arrayConfig?.addText || '添加' }}
                  </ElButton>
                </template>

                <!-- 普通表单组件 -->
                <component
                  v-else
                  :is="getComponent(item)"
                  v-model="modelValue[item.key]"
                  v-bind="getProps(item)"
                >
                  <!-- 下拉选择 -->
                  <template v-if="item.type === 'select' && getProps(item)?.options">
                    <ElOption
                      v-for="option in getProps(item).options"
                      v-bind="option"
                      :key="option.value"
                    />
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
                    <ElRadio
                      v-for="option in getProps(item).options"
                      v-bind="option"
                      :key="option.value"
                    />
                  </template>

                  <!-- 动态插槽支持 -->
                  <template
                    v-for="(slotFn, slotName) in getSlots(item)"
                    :key="slotName"
                    #[slotName]
                  >
                    <component :is="slotFn" />
                  </template>
                </component>
              </slot>

              <!-- 帮助文本 -->
              <div v-if="item.help" class="form-item-help">
                {{ item.help }}
              </div>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </template>
    </ElForm>
  </section>
</template>

<script setup lang="ts">
  import type { FormInstance } from 'element-plus'
  import type { FormRule, FormProps, FormItem } from '@/types/component/form'
  import { componentMap } from './componentMap'
  import { QuestionFilled, Delete, Plus } from '@element-plus/icons-vue'

  defineOptions({ name: 'ArtForm' })

  const formInstance = useTemplateRef<FormInstance>('formRef')

  const props = withDefaults(defineProps<FormProps>(), {
    items: () => [],
    span: 6,
    gutter: 12,
    labelPosition: 'right',
    labelWidth: '70px',
    disabled: false,
    readonly: false,
    rules: () => ({})
  })

  const modelValue = defineModel<Record<string, any>>({ default: {} })

  // 分组展开状态
  const groupExpandedKeys = ref<string[]>([])

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

  // 生成内部验证规则
  const generateFormRules = computed(() => {
    const internalRules: Record<string, FormRule[]> = {}

    // 处理每个表单项的规则（包括分组内的子项）
    const processItem = (item: FormItem) => {
      // 跳过分组类型本身
      if (item.type === 'group') {
        // 处理分组内的子项
        item.groupConfig?.children.forEach(processItem)
        return
      }

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
    }

    props.items.forEach(processItem)

    // 合并外部传入的 rules (外部优先级更高)
    return { ...internalRules, ...props.rules }
  })

  const getProps = (item: FormItem) => {
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
  const getSlots = (item: FormItem) => {
    if (!item.slots) return {}
    const validSlots: Record<string, () => any> = {}
    Object.entries(item.slots).forEach(([key, slotFn]) => {
      if (slotFn) {
        validSlots[key] = slotFn
      }
    })
    return validSlots
  }

  // 组件
  const getComponent = (item: Partial<FormItem>) => {
    const { type } = item
    if (type && typeof type !== 'string') return type
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
   */
  const initDefaultValues = () => {
    const processItem = (item: FormItem) => {
      // 处理分组
      if (item.type === 'group') {
        // 初始化分组展开状态
        if (item.groupConfig?.defaultExpanded !== false) {
          groupExpandedKeys.value.push(item.key)
        }
        // 处理分组内的子项
        item.groupConfig?.children.forEach(processItem)
        return
      }

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
    }

    props.items.forEach(processItem)
  }

  // 组件挂载时初始化默认值和分组状态
  onMounted(() => {
    initDefaultValues()
  })

  /**
   * 监听表单值变化，触发 onChange 回调和依赖验证
   */
  watch(
    () => modelValue.value,
    (newVal, oldVal) => {
      // 找出变化的字段
      Object.keys(newVal).forEach((key) => {
        if (newVal[key] !== oldVal?.[key]) {
          // 触发 onChange 回调
          if (props.onChange) {
            props.onChange(key, newVal[key], { ...newVal })
          }

          // 检查是否有字段依赖于当前变化的字段
          props.items.forEach((item) => {
            if (item.dependencies?.includes(key)) {
              // 验证依赖该字段的表单项
              nextTick(() => {
                formInstance.value?.validateField(item.key).catch(() => {
                  // 忽略验证错误
                })
              })
            }
          })
        }
      })
    },
    { deep: true }
  )

  /**
   * 重置表单
   */
  const resetForm = () => {
    // 重置表单字段（UI 层）
    formInstance.value?.resetFields()

    // 收集所有表单项的 key（包括分组内的）
    const allKeys: string[] = []
    const collectKeys = (items: FormItem[]) => {
      items.forEach((item) => {
        if (item.type === 'group' && item.groupConfig?.children) {
          collectKeys(item.groupConfig.children)
        } else if (item.type !== 'group') {
          allKeys.push(item.key)
        }
      })
    }
    collectKeys(props.items)

    // 清空所有表单项值（包含隐藏项）
    Object.assign(modelValue.value, Object.fromEntries(allKeys.map((key) => [key, undefined])))
  }

  /**
   * 重置到初始值
   */
  const resetToInitial = () => {
    if (props.initialValues) {
      Object.assign(modelValue.value, { ...props.initialValues })
    } else {
      resetForm()
    }
    // 清空验证
    formInstance.value?.clearValidate()
  }

  /**
   * 获取提交数据（应用 transform.output）
   */
  const getSubmitData = () => {
    const submitData: Record<string, any> = { ...modelValue.value }

    const processItem = (item: FormItem) => {
      // 处理分组
      if (item.type === 'group') {
        item.groupConfig?.children.forEach(processItem)
        return
      }

      // 应用输出转换
      if (item.transform?.output && submitData[item.key] !== undefined) {
        submitData[item.key] = item.transform.output(submitData[item.key], submitData)
      }
    }

    props.items.forEach(processItem)

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
    /** 重置表单 */
    resetFields: () => formInstance.value?.resetFields(),
    /** 清空验证 */
    clearValidate: (props?: string | string[]) => formInstance.value?.clearValidate(props),
    /** 滚动到指定字段 */
    scrollToField: (prop: string) => formInstance.value?.scrollToField(prop),
    /** 重置表单（包括隐藏字段） */
    reset: resetForm,
    /** 重置到初始值 */
    resetToInitial,
    /** 获取提交数据（应用 transform） */
    getSubmitData,
    /** 添加数组项 */
    addArrayItem,
    /** 删除数组项 */
    removeArrayItem
  })

  // 解构 props 以便在模板中直接使用
  const { span, gutter, labelPosition, labelWidth } = toRefs(props)
</script>

<style lang="scss" scoped>
  .art-form {
    .form-row {
      display: flex;
      flex-wrap: wrap;
    }

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

    // 数组添加按钮
    .array-add-btn {
      display: flex;
      align-items: center;
    }

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
