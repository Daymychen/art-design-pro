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
      <ElRow class="form-row" :gutter="gutter">
        <ElCol
          v-for="item in visibleFormItems"
          :key="item.key"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="item.span || span"
          :xl="item.span || span"
        >
          <ElFormItem
            :label="item.label"
            :prop="item.key"
            :label-width="item.label ? item.labelWidth || labelWidth : undefined"
          >
            <slot :name="item.key" :item="item" :modelValue="modelValue">
              <component
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
                <template v-for="(slotFn, slotName) in getSlots(item)" :key="slotName" #[slotName]>
                  <component :is="slotFn" />
                </template>
              </component>
            </slot>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </section>
</template>

<script setup lang="ts">
  import type { FormInstance } from 'element-plus'
  import type { FormRule, FormProps, FormItem } from '@/types/component/form'
  import { componentMap } from './componentMap'

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
    'defaultValue'
  ]

  // 生成内部验证规则
  const generateFormRules = computed(() => {
    const internalRules: Record<string, FormRule[]> = {}

    // 处理每个表单项的规则
    props.items.forEach((item) => {
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
  const getComponent = (item: FormItem) => {
    const { type } = item
    if (type && typeof item.type !== 'string') return type
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
    props.items.forEach((item) => {
      if (item.defaultValue !== undefined && modelValue.value[item.key] === undefined) {
        modelValue.value[item.key] = item.defaultValue
      }
    })
  }

  // 组件挂载时初始化默认值
  onMounted(() => {
    initDefaultValues()
  })

  /**
   * 监听表单值变化，触发 onChange 回调
   */
  watch(
    () => modelValue.value,
    (newVal, oldVal) => {
      if (!props.onChange) return

      // 找出变化的字段
      Object.keys(newVal).forEach((key) => {
        if (newVal[key] !== oldVal?.[key]) {
          props.onChange?.(key, newVal[key], { ...newVal })
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

    // 清空所有表单项值（包含隐藏项）
    Object.assign(
      modelValue.value,
      Object.fromEntries(props.items.map(({ key }) => [key, undefined]))
    )
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
    reset: resetForm
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
  }
</style>
