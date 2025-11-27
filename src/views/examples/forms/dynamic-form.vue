<template>
  <div class="pb-5">
    <h2 class="mb-2 text-lg font-medium">动态表单示例</h2>

    <ElRow :gutter="20">
      <ElCol :span="8">
        <ElCard shadow="never" class="art-card p-4">
          <h3 class="mb-3">添加字段</h3>
          <ElForm :model="fieldForm" label-width="80px">
            <ElFormItem label="字段标签">
              <ElInput v-model="fieldForm.label" placeholder="例如：用户名" />
            </ElFormItem>
            <ElFormItem label="字段 key">
              <ElInput v-model="fieldForm.key" placeholder="例如：name" />
            </ElFormItem>
            <ElFormItem label="字段类型">
              <ElSelect v-model="fieldForm.type" placeholder="请选择类型">
                <ElOption label="输入框" value="input" />
                <ElOption label="下拉" value="select" />
                <ElOption label="日期" value="date" />
                <ElOption label="上传" value="upload" />
                <ElOption label="单选" value="radio" />
                <ElOption label="多选" value="checkbox" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="选项(逗号分隔)">
              <ElInput v-model="fieldForm.options" placeholder="仅 select/radio/checkbox 使用" />
            </ElFormItem>
            <ElFormItem>
              <ElButton type="primary" @click="addField">添加字段</ElButton>
              <ElButton class="ml-2" @click="resetFieldForm">重置</ElButton>
            </ElFormItem>
          </ElForm>

          <h3 class="mt-4 mb-2">已添加字段</h3>
          <div class="h-64 overflow-auto">
            <div v-for="(it, i) in items" :key="it.key" class="p-2 border-b">
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-medium"
                    >{{ it.label }} <span class="text-sm text-gray-500">({{ it.type }})</span></div
                  >
                  <div class="text-sm text-gray-400">key: {{ it.key }}</div>
                </div>
                <div>
                  <ElButton size="small" type="danger" @click="removeField(i)">删除</ElButton>
                </div>
              </div>
            </div>
          </div>
        </ElCard>
      </ElCol>

      <ElCol :span="16">
        <ElCard shadow="never" class="art-card p-4">
          <h3 class="mb-3">表单预览</h3>
          <DynamicForm v-model="formData" :items="items" :rules="rules" @submit="onSubmit" />

          <div class="art-card p-4 mt-4">
            <h4 class="mb-2">表单数据 (实时)</h4>
            <pre><code>{{ formData }}</code></pre>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import DynamicForm from '@/components/core/forms/DynamicForm.vue'
  import { ElMessage } from 'element-plus'

  interface FieldItem {
    label: string
    key: string
    type: string
    props?: Record<string, any>
  }

  const items = ref<FieldItem[]>([
    { label: '用户名', key: 'name', type: 'input' },
    {
      label: '用户等级',
      key: 'level',
      type: 'select',
      props: {
        options: [
          { label: '普通', value: 'normal' },
          { label: 'VIP', value: 'vip' }
        ]
      }
    }
  ])

  const formData = ref<Record<string, any>>({})

  const fieldForm = reactive({ label: '', key: '', type: 'input', options: '' })

  const rules = {
    name: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
  }

  const addField = () => {
    if (!fieldForm.label || !fieldForm.key) {
      ElMessage.warning('请填写字段标签和 key')
      return
    }
    const exists = items.value.find((i: FieldItem) => i.key === fieldForm.key)
    if (exists) {
      ElMessage.error('该 key 已存在，请换一个')
      return
    }

    const newItem: FieldItem = {
      label: fieldForm.label,
      key: fieldForm.key,
      type: fieldForm.type,
      props: {}
    }

    if (['select', 'radio', 'checkbox'].includes(fieldForm.type) && fieldForm.options) {
      const opts = fieldForm.options
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)
      newItem.props = { options: opts.map((v: string) => ({ label: v, value: v })) }
    }

    if (fieldForm.type === 'upload') {
      newItem.props = { multiple: false }
    }

    items.value.push(newItem)
    // init value
    formData.value[fieldForm.key] = fieldForm.type === 'checkbox' ? [] : undefined
    resetFieldForm()
  }

  const resetFieldForm = () => {
    fieldForm.label = ''
    fieldForm.key = ''
    fieldForm.type = 'input'
    fieldForm.options = ''
  }

  const removeField = (index: number) => {
    const key = items.value[index].key
    items.value.splice(index, 1)
    delete formData.value[key]
  }

  const onSubmit = (data: Record<string, any>) => {
    ElMessage.success('提交成功，请查看控制台或右侧数据')
    console.log('动态表单提交：', data)
  }
</script>

<style scoped>
  .ml-2 {
    margin-left: 8px;
  }

  .pb-5 {
    padding-bottom: 20px;
  }

  .h-64 {
    height: 16rem;
  }

  .flex {
    display: flex;
  }

  .justify-between {
    justify-content: space-between;
  }

  .items-center {
    align-items: center;
  }

  .font-medium {
    font-weight: 500;
  }

  .text-sm {
    font-size: 0.875rem;
  }

  .text-gray-500 {
    color: #6b7280;
  }

  .text-gray-400 {
    color: #9ca3af;
  }
</style>
