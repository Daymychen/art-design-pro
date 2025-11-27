<template>
  <ElForm
    ref="innerForm"
    :model="model"
    :rules="rules"
    label-width="120px"
    :label-position="labelPosition"
  >
    <template v-for="(item, idx) in items" :key="item.key || idx">
      <ElFormItem :label="item.label" :prop="item.key">
        <component
          v-if="item.type === 'input'"
          :is="ElInput"
          v-model="model[item.key]"
          v-bind="item.props"
        />

        <component
          v-else-if="item.type === 'select'"
          :is="ElSelect"
          v-model="model[item.key]"
          v-bind="item.props"
        >
          <ElOption
            v-for="opt in item.props?.options || []"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </component>

        <component
          v-else-if="item.type === 'date'"
          :is="ElDatePicker"
          v-model="model[item.key]"
          type="date"
          v-bind="item.props"
        />

        <component
          v-else-if="item.type === 'upload'"
          :is="ElUpload"
          v-model:modelValue="model[item.key]"
          v-bind="item.props"
        >
          <ElButton size="small" type="primary">上传</ElButton>
        </component>

        <component
          v-else-if="item.type === 'radio'"
          :is="ElRadioGroup"
          v-model="model[item.key]"
          v-bind="item.props"
        >
          <ElRadio v-for="opt in item.props?.options || []" :key="opt.value" :label="opt.value">{{
            opt.label
          }}</ElRadio>
        </component>

        <component
          v-else-if="item.type === 'checkbox'"
          :is="ElCheckboxGroup"
          v-model="model[item.key]"
          v-bind="item.props"
        >
          <ElCheckbox
            v-for="opt in item.props?.options || []"
            :key="opt.value"
            :label="opt.value"
            >{{ opt.label }}</ElCheckbox
          >
        </component>

        <div v-else>不支持的字段类型: {{ item.type }}</div>
      </ElFormItem>
    </template>

    <div class="mt-4">
      <ElButton type="primary" @click="submit">提交</ElButton>
      <ElButton @click="reset" class="ml-2">重置</ElButton>
    </div>
  </ElForm>
</template>

<script setup lang="ts">
  import { reactive, watch, ref } from 'vue'
  import {
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElDatePicker,
    ElUpload,
    ElButton,
    ElRadioGroup,
    ElRadio,
    ElCheckboxGroup,
    ElCheckbox
  } from 'element-plus'

  interface FieldItem {
    label: string
    key: string
    type: 'input' | 'select' | 'date' | 'upload' | 'radio' | 'checkbox' | string
    props?: Record<string, any>
  }

  const props = defineProps<{
    modelValue?: Record<string, any>
    items: FieldItem[]
    rules?: Record<string, any>
    labelPosition?: 'left' | 'right' | 'top'
  }>()

  const emit = defineEmits(['update:modelValue', 'submit'])

  const items = props.items || []
  const rules = props.rules || {}
  const labelPosition = props.labelPosition || 'right'

  const model = reactive<Record<string, any>>(props.modelValue || {})

  watch(
    () => props.modelValue,
    (v: Record<string, any> | undefined) => {
      if (v) {
        Object.assign(model, v)
      }
    },
    { deep: true }
  )

  watch(
    model,
    (v: Record<string, any>) => {
      emit('update:modelValue', { ...v })
    },
    { deep: true }
  )

  const innerForm = ref()

  const submit = async () => {
    if (!innerForm.value) return
    try {
      await innerForm.value.validate()
      emit('submit', { ...model })
    } catch {
      // validation failed
    }
  }

  const reset = () => {
    if (innerForm.value) innerForm.value.resetFields()
  }
</script>

<style scoped>
  .ml-2 {
    margin-left: 8px;
  }

  .mt-4 {
    margin-top: 16px;
  }
</style>
