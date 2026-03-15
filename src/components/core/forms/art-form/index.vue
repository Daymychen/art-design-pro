<!-- 表单组件 -->
<!-- 支持常用表单组件、自定义组件、插槽、校验、隐藏表单项 -->
<!-- 写法同 ElementPlus 官方文档组件，把属性写在 props 里面就可以了 -->
<template>
  <section class="px-4 pb-0 pt-4 md:px-4 md:pt-4">
    <ElForm
      ref="formRef"
      :model="modelValue"
      :label-position="labelPosition"
      v-bind="{ ...$attrs }"
    >
      <ElRow class="flex flex-wrap" :gutter="gutter">
        <ElCol
          v-for="item in visibleFormItems"
          :key="item.key"
          :xs="getColSpan(item.span, 'xs')"
          :sm="getColSpan(item.span, 'sm')"
          :md="getColSpan(item.span, 'md')"
          :lg="getColSpan(item.span, 'lg')"
          :xl="getColSpan(item.span, 'xl')"
        >
          <ElFormItem
            :prop="item.key"
            :label-width="item.label ? item.labelWidth || labelWidth : undefined"
          >
            <template #label v-if="item.label">
              <component v-if="typeof item.label !== 'string'" :is="item.label" />
              <span v-else>{{ item.label }}</span>
            </template>
            <slot :name="item.key" :item="item" :modelValue="modelValue">
              <component
                :is="getComponent(item)"
                :model-value="getFieldValue(item.key)"
                @update:model-value="setFieldValue(item.key, $event)"
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
        <ElCol :xs="24" :sm="24" :md="span" :lg="span" :xl="span" class="max-w-full flex-1">
          <div
            class="mb-3 flex-c flex-wrap justify-end md:flex-row md:items-stretch md:gap-2"
            :style="actionButtonsStyle"
          >
            <div class="flex gap-2 md:justify-center">
              <ElButton v-if="showReset" class="reset-button" @click="handleReset" v-ripple>
                {{ t('table.form.reset') }}
              </ElButton>
              <ElButton
                v-if="showSubmit"
                type="primary"
                class="submit-button"
                @click="handleSubmit"
                v-ripple
                :disabled="disabledSubmit"
              >
                {{ t('table.form.submit') }}
              </ElButton>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </ElForm>
  </section>
</template>

<script setup lang="ts">
  import { useWindowSize } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { toRaw, type Component } from 'vue'
  import {
    ElCascader,
    ElCheckbox,
    ElCheckboxGroup,
    ElDatePicker,
    ElInput,
    ElInputTag,
    ElInputNumber,
    ElRadioGroup,
    ElRate,
    ElSelect,
    ElSlider,
    ElSwitch,
    ElTimePicker,
    ElTimeSelect,
    ElTreeSelect,
    type FormInstance
  } from 'element-plus'
  import { calculateResponsiveSpan, type ResponsiveBreakpoint } from '@/utils/form/responsive'

  defineOptions({ name: 'ArtForm' })

  const componentMap = {
    input: ElInput, // 输入框
    inputtag: ElInputTag, // 标签输入框
    number: ElInputNumber, // 数字输入框
    select: ElSelect, // 选择器
    switch: ElSwitch, // 开关
    checkbox: ElCheckbox, // 复选框
    checkboxgroup: ElCheckboxGroup, // 复选框组
    radiogroup: ElRadioGroup, // 单选框组
    date: ElDatePicker, // 日期选择器
    daterange: ElDatePicker, // 日期范围选择器
    datetime: ElDatePicker, // 日期时间选择器
    datetimerange: ElDatePicker, // 日期时间范围选择器
    rate: ElRate, // 评分
    slider: ElSlider, // 滑块
    cascader: ElCascader, // 级联选择器
    timepicker: ElTimePicker, // 时间选择器
    timeselect: ElTimeSelect, // 时间选择
    treeselect: ElTreeSelect // 树选择器
  }

  const { width } = useWindowSize()
  const { t } = useI18n()
  const isMobile = computed(() => width.value < 500)

  const formInstance = useTemplateRef<FormInstance>('formRef')

  // 表单项配置
  export interface FormItem {
    /** 表单项的唯一标识 */
    key: string
    /** 表单项的标签文本或自定义渲染函数 */
    label: string | (() => VNode) | Component
    /** 表单项标签的宽度，会覆盖 Form 的 labelWidth */
    labelWidth?: string | number
    /** 表单项类型，支持预定义的组件类型 */
    type?: keyof typeof componentMap | string
    /** 自定义渲染函数或组件，用于渲染自定义组件（优先级高于 type） */
    render?: (() => VNode) | Component
    /** 是否隐藏该表单项 */
    hidden?: boolean
    /** 表单项占据的列宽，基于24格栅格系统 */
    span?: number
    /** 选项数据，用于 select、checkbox-group、radio-group 等 */
    options?: Record<string, any>
    /** 传递给表单项组件的属性 */
    props?: Record<string, any>
    /** 表单项的插槽配置 */
    slots?: Record<string, (() => any) | undefined>
    /** 表单项的占位符文本 */
    placeholder?: string
    /** 更多属性配置请参考 ElementPlus 官方文档 */
  }

  // 表单配置
  interface FormProps {
    /** 表单数据 */
    items: FormItem[]
    /** 每列的宽度（基于 24 格布局） */
    span?: number
    /** 表单控件间隙 */
    gutter?: number
    /** 表单域标签的位置 */
    labelPosition?: 'left' | 'right' | 'top'
    /** 文字宽度 */
    labelWidth?: string | number
    /** 按钮靠左对齐限制（表单项小于等于该值时） */
    buttonLeftLimit?: number
    /** 是否显示重置按钮 */
    showReset?: boolean
    /** 是否显示提交按钮 */
    showSubmit?: boolean
    /** 是否禁用提交按钮 */
    disabledSubmit?: boolean
    /** 提交时是否清洗空值 */
    sanitizeOutput?: Partial<SanitizeOutputOptions>
  }

  interface SanitizeOutputOptions {
    /** 移除空字符串 */
    removeEmptyString: boolean
    /** 移除空数组 */
    removeEmptyArray: boolean
    /** 移除清洗后为空的对象 */
    removeEmptyObject: boolean
    /** 移除空富文本占位内容，如 <p><br></p> */
    removeEmptyRichText: boolean
    /** 保留数字 0 这类有效值 */
    keepZero: boolean
    /** 保留 false 这类有效值 */
    keepFalse: boolean
  }

  const props = withDefaults(defineProps<FormProps>(), {
    items: () => [],
    span: 6,
    gutter: 12,
    labelPosition: 'right',
    labelWidth: '70px',
    buttonLeftLimit: 2,
    showReset: true,
    showSubmit: true,
    disabledSubmit: false,
    sanitizeOutput: () => ({})
  })

  interface FormEmits {
    reset: []
    submit: [Record<string, any>]
  }

  const emit = defineEmits<FormEmits>()

  const modelValue = defineModel<Record<string, any>>({ default: {} })
  const initialModelValue = ref<Record<string, any>>({})

  // 保存组件初始化时的表单快照，用于 reset 时恢复默认值。
  const cloneModelValue = (value: Record<string, any> | undefined) => {
    if (!value) return {}

    const deepClone = (source: unknown): unknown => {
      if (Array.isArray(source)) {
        return source.map((item) => deepClone(item))
      }

      if (source && typeof source === 'object') {
        const rawSource = toRaw(source)
        return Object.keys(rawSource).reduce<Record<string, unknown>>((accumulator, key) => {
          accumulator[key] = deepClone((rawSource as Record<string, unknown>)[key])
          return accumulator
        }, {})
      }

      return source
    }

    return deepClone(toRaw(value)) as Record<string, any>
  }

  initialModelValue.value = cloneModelValue(modelValue.value)

  const rootProps = ['label', 'labelWidth', 'key', 'type', 'hidden', 'span', 'slots']
  // 输出时的清洗策略默认偏“接口友好”，但允许按业务覆盖。
  const sanitizeOutputOptions = computed<SanitizeOutputOptions>(() => ({
    removeEmptyString: true,
    removeEmptyArray: true,
    removeEmptyObject: true,
    removeEmptyRichText: true,
    keepZero: true,
    keepFalse: true,
    ...props.sanitizeOutput
  }))

  const PATH_NUMBER_RE = /^\d+$/

  // 兼容 a.b、a.0.b 这类路径写法，数字段会被当作数组索引处理。
  const parsePath = (path: string) => {
    return path
      .split('.')
      .filter(Boolean)
      .map((segment) => (PATH_NUMBER_RE.test(segment) ? Number(segment) : segment))
  }

  const getFieldValue = (path: string) => {
    return parsePath(path).reduce<any>((currentValue, segment) => {
      if (currentValue == null) return undefined
      return currentValue[segment]
    }, modelValue.value)
  }

  // 清空字段时只删除路径的最后一段，避免误删同级数据。
  const deleteFieldValue = (path: string) => {
    const segments = parsePath(path)
    if (!segments.length) return

    const lastSegment = segments.pop()
    const parent = segments.reduce<any>((currentValue, segment) => {
      if (currentValue == null) return undefined
      return currentValue[segment]
    }, modelValue.value)

    if (parent != null && lastSegment !== undefined) {
      delete parent[lastSegment]
    }
  }

  // 表单清空输入时不保留空字符串，同时按路径自动补齐中间对象或数组。
  const setFieldValue = (path: string, value: unknown) => {
    const normalizedValue = value === '' ? undefined : value
    const segments = parsePath(path)

    if (!segments.length) return

    if (normalizedValue === undefined) {
      deleteFieldValue(path)
      return
    }

    let currentValue: any = modelValue.value

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1

      if (isLast) {
        currentValue[segment] = normalizedValue
        return
      }

      const nextSegment = segments[index + 1]
      const nextContainer = typeof nextSegment === 'number' ? [] : {}

      if (
        currentValue[segment] === null ||
        currentValue[segment] === undefined ||
        typeof currentValue[segment] !== 'object'
      ) {
        currentValue[segment] = nextContainer
      }

      currentValue = currentValue[segment]
    })
  }

  const isRichTextEmpty = (value: string) => {
    if (/<(img|video|audio|iframe|embed|object)\b/i.test(value)) {
      return false
    }

    // 去掉编辑器常见占位标签后再判断是否还有实际内容。
    return (
      value
        .replace(/&nbsp;/gi, '')
        .replace(/<br\s*\/?>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim() === ''
    )
  }

  // 提交时按配置清洗空值，但保留 0 和 false 这类有效值。
  const sanitizeOutputValue = (value: unknown): unknown => {
    const options = sanitizeOutputOptions.value

    if (Array.isArray(value)) {
      const sanitizedArray = value
        .map((item) => sanitizeOutputValue(item))
        .filter((item) => item !== undefined)
      return sanitizedArray.length === 0 && options.removeEmptyArray ? undefined : sanitizedArray
    }

    if (value && typeof value === 'object') {
      const rawValue = toRaw(value)
      const sanitizedObject = Object.entries(rawValue).reduce<Record<string, unknown>>(
        (accumulator, [key, item]) => {
          const sanitizedItem = sanitizeOutputValue(item)
          if (sanitizedItem !== undefined) {
            accumulator[key] = sanitizedItem
          }
          return accumulator
        },
        {}
      )
      return Object.keys(sanitizedObject).length === 0 && options.removeEmptyObject
        ? undefined
        : sanitizedObject
    }

    if (typeof value === 'string') {
      if (options.removeEmptyString && value.trim() === '') {
        return undefined
      }
      if (options.removeEmptyRichText && isRichTextEmpty(value)) {
        return undefined
      }
      return value
    }

    if (value === 0) {
      return options.keepZero ? value : undefined
    }

    if (value === false) {
      return options.keepFalse ? value : undefined
    }

    return value ?? undefined
  }

  const getSanitizedOutput = () => {
    return (sanitizeOutputValue(cloneModelValue(modelValue.value)) || {}) as Record<string, any>
  }

  const getProps = (item: FormItem) => {
    if (item.props) return item.props
    const props = { ...item }
    rootProps.forEach((key) => delete (props as Record<string, any>)[key])
    return props
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
    // 优先使用 render 函数或组件渲染自定义组件
    if (item.render) {
      return item.render
    }
    // 使用 type 获取预定义组件
    const { type } = item
    return componentMap[type as keyof typeof componentMap] || componentMap['input']
  }

  /**
   * 获取列宽 span 值
   * 根据屏幕尺寸智能降级，避免小屏幕上表单项被压缩过小
   */
  const getColSpan = (itemSpan: number | undefined, breakpoint: ResponsiveBreakpoint): number => {
    return calculateResponsiveSpan(itemSpan, span.value, breakpoint)
  }

  /**
   * 可见的表单项
   */
  const visibleFormItems = computed(() => {
    return props.items.filter((item) => !item.hidden)
  })

  /**
   * 操作按钮样式
   */
  const actionButtonsStyle = computed(() => ({
    'justify-content': isMobile.value
      ? 'flex-end'
      : props.items.filter((item) => !item.hidden).length <= props.buttonLeftLimit
        ? 'flex-start'
        : 'flex-end'
  }))

  /**
   * 处理重置事件
   */
  const handleReset = () => {
    // 重置表单字段（UI 层）
    formInstance.value?.resetFields()

    // 恢复初始表单值，保留默认值而不是简单清空。
    Object.keys(modelValue.value).forEach((key) => {
      delete modelValue.value[key]
    })
    Object.assign(modelValue.value, cloneModelValue(initialModelValue.value))

    // 触发 reset 事件
    emit('reset')
  }

  /**
   * 处理提交事件
   */
  const handleSubmit = () => {
    // 对外只抛出清洗后的结果，避免业务层重复过滤空值。
    emit('submit', getSanitizedOutput())
  }

  defineExpose({
    ref: formInstance,
    validate: (...args: any[]) => formInstance.value?.validate(...args),
    reset: handleReset,
    // 允许外部在不触发提交事件时主动获取清洗后的输出。
    getOutput: getSanitizedOutput
  })

  // 解构 props 以便在模板中直接使用
  const { span, gutter, labelPosition, labelWidth } = toRefs(props)
</script>
