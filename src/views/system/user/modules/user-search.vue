<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
    <template #email>
      <ElInput v-model="formData.email" placeholder="我是插槽渲染出来的组件" />
    </template>
  </ArtSearchBar>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, h } from 'vue'
  import ArtIconSelector from '@/components/core/base/art-icon-selector/index.vue'
  import { IconTypeEnum } from '@/enums/appEnum'

  interface Props {
    modelValue: Record<string, any>
  }
  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 表单数据双向绑定
  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  // 校验规则
  const rules = {
    // name: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
  }

  // 动态 options
  const levelOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])

  // 模拟接口返回用户等级
  function fetchLevelOptions(): Promise<typeof levelOptions.value> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '普通用户', value: 'normal' },
          { label: 'VIP用户', value: 'vip' },
          { label: '高级VIP', value: 'svip' },
          { label: '企业用户', value: 'enterprise', disabled: true }
        ])
      }, 1000)
    })
  }

  onMounted(async () => {
    levelOptions.value = await fetchLevelOptions()
  })

  // 表单配置
  const formItems = computed(() => [
    { label: '用户名', key: 'name', type: 'input', placeholder: '请输入用户名', clearable: true },
    {
      label: '手机号',
      key: 'phone',
      type: 'input',
      props: { placeholder: '请输入手机号', maxlength: '11' }
    },
    {
      label: '用户等级',
      key: 'level',
      type: 'select',
      props: { placeholder: '请选择等级', options: levelOptions.value }
    },
    { label: '地址', key: 'address', type: 'input', placeholder: '请输入地址' },
    {
      label: '日期',
      key: 'date',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: '请选择日期',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        shortcuts: [
          { text: '今日', value: new Date() },
          { text: '昨日', value: () => new Date(Date.now() - 86400000) },
          { text: '一周前', value: () => new Date(Date.now() - 604800000) }
        ]
      }
    },
    {
      label: '日期范围',
      key: 'daterange',
      type: 'datetime',
      props: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      }
    },
    {
      label: '级联选择',
      key: 'cascader',
      type: 'cascader',
      props: {
        placeholder: '请选择级联选择器',
        clearable: true,
        style: { width: '100%' },
        collapseTags: true,
        maxCollapseTags: 1,
        props: { multiple: true },
        options: [
          {
            value: 'guide',
            label: '指南',
            children: [
              {
                value: 'disciplines',
                label: '规范',
                children: [
                  { value: 'consistency', label: '一致性' },
                  { value: 'feedback', label: '反馈' },
                  { value: 'efficiency', label: '效率' },
                  { value: 'controllability', label: '可控性' }
                ]
              }
            ]
          },
          {
            value: 'components',
            label: '组件',
            children: [
              {
                value: 'basic',
                label: '基础组件',
                children: [
                  { value: 'button', label: '按钮' },
                  { value: 'form', label: '表单' },
                  { value: 'table', label: '表格' }
                ]
              }
            ]
          }
        ]
      }
    },
    { label: '插槽', key: 'email', type: 'input', placeholder: '请输入邮箱' },
    {
      label: '渲染组件',
      key: 'iconSelector',
      type: () => h(ArtIconSelector, { iconType: IconTypeEnum.UNICODE, width: '100%' }),
      props: { placeholder: '请输入备注', type: 'textarea', rows: 4 }
    },
    {
      label: '栅格示例',
      key: 'checkboxgroup',
      type: 'checkboxgroup',
      span: 12,
      props: {
        options: [
          { label: '选项1', value: 'option1' },
          { label: '选项2', value: 'option2' },
          { label: '选项3', value: 'option3' },
          { label: '选项4', value: 'option4' },
          { label: '选项5（disabled）', value: 'option5', disabled: true }
        ]
      }
    },
    {
      label: '性别',
      key: 'userGender',
      type: 'radiogroup',
      props: {
        options: [
          { label: '男', value: '1' },
          { label: '女', value: '2' }
        ]
      }
    }
  ])

  // 事件
  function handleReset() {
    console.log('重置表单')
    emit('reset')
  }

  async function handleSearch() {
    await searchBarRef.value.validate()
    emit('search', formData.value)
    console.log('表单数据', formData.value)
  }
</script>
