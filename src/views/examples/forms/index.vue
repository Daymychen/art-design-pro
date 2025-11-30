<!-- 表单示例 -->
<template>
  <div class="pb-5">
    <h2 class="mb-1 text-lg font-medium">表单组件示例</h2>

    <ElCard shadow="never" class="art-card-xs">
      <ArtForm
        ref="formRef"
        v-model="formData"
        :items="formItems"
        :rules="formRules"
        :defaultExpanded="true"
        :labelWidth="labelWidth"
        :labelPosition="labelPosition"
        :span="span"
        :gutter="gutter"
        @reset="handleReset"
        @submit="handleSubmit"
      >
        <template #slots>
          <ElInput v-model="formData.slots" placeholder="我是插槽渲染出来的组件" />
        </template>
      </ArtForm>
    </ElCard>

    <div class="art-card p-5 !rounded-lg mt-5">
      <pre><code>{{ formData }}</code></pre>
    </div>

    <div class="mt-3.5">
      <h3 class="mb-2 text-base font-medium">动态表单操作</h3>
      <ElSpace wrap class="mb-3">
        <ElButton @click="getLevelOptions"> 获取用户等级数据 </ElButton>
        <ElButton @click="addFormItem"> 新增表单项 </ElButton>
        <ElButton @click="updateFormItem"> 修改表单项 </ElButton>
        <ElButton @click="deleteFormItem"> 删除表单项 </ElButton>
        <ElButton @click="batchAddFormItems"> 批量新增 </ElButton>
        <ElButton @click="resetDynamicItems"> 重置动态项 </ElButton>
      </ElSpace>

      <h3 class="mb-2 text-base font-medium">其他操作</h3>
      <ElSpace wrap>
        <ElButton @click="validateForm"> 校验表单 </ElButton>
        <ElButton @click="resetForm"> 重置 </ElButton>
        <ElButton v-if="showUserName" @click="updateUserName"> 修改用户名 </ElButton>
        <ElButton v-if="showUserName" @click="deleteUserName"> 删除用户名 </ElButton>
        <ElButton @click="labelWidth = 120"> 修改 label 宽度 </ElButton>
        <ElButton @click="span = 8"> 设置一行显示的组件数 </ElButton>
        <ElButton @click="gutter = 50"> 修改 gutter </ElButton>
        <ElButton @click="labelPosition = 'left'"> label 左对齐 </ElButton>
        <ElButton @click="labelPosition = 'right'"> label 右对齐 </ElButton>
        <ElButton @click="labelPosition = 'top'"> label 顶部对齐 </ElButton>
      </ElSpace>
    </div>

    <!-- 图片预览对话框 -->
    <ElDialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" class="w-full h-auto" />
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import ArtWangEditor from '@/components/core/forms/art-wang-editor/index.vue'
  import { SearchFormItem } from '@/components/core/forms/art-search-bar/index.vue'
  import { ElMessage, ElUpload, ElButton, ElIcon, ElInput } from 'element-plus'
  import type { UploadFile, UploadFiles, UploadUserFile } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'

  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }

  interface OptionItem {
    label: string
    value: string
    disabled?: boolean
  }

  interface FormData {
    name?: string
    phone?: string
    level?: string
    address?: string
    slots?: string
    date?: string
    daterange?: string[]
    cascader?: string[]
    checkboxgroup?: string[]
    userGender?: string
    iconSelector?: string
    status?: boolean
    systemName?: string
    fileUpload: UploadUserFile[]
    imageUpload: UploadUserFile[]
    multipleFiles: UploadUserFile[]
    richTextContent: string
  }

  const emit = defineEmits<Emits>()

  const FETCH_DELAY = 500

  const formRef = ref()
  const dialogVisible = ref(false)
  const dialogImageUrl = ref('')

  /**
   * 表单数据
   */
  const formData = ref<FormData>({
    name: undefined,
    phone: undefined,
    level: undefined,
    address: undefined,
    slots: undefined,
    date: undefined,
    daterange: undefined,
    cascader: undefined,
    checkboxgroup: undefined,
    userGender: undefined,
    iconSelector: undefined,
    status: undefined,
    systemName: undefined,
    fileUpload: [],
    imageUpload: [],
    multipleFiles: [],
    richTextContent: ''
  })

  /**
   * 表单校验规则
   */
  const formRules = {
    name: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
  }

  const labelWidth = ref(100)
  const labelPosition = ref<'right' | 'left' | 'top'>('right')
  const span = ref(6)
  const gutter = ref(12)

  const levelOptions = ref<OptionItem[]>([])

  /**
   * 用户等级选项
   */
  const LEVEL_OPTIONS: OptionItem[] = [
    { label: '普通用户', value: 'normal' },
    { label: 'VIP用户', value: 'vip' },
    { label: '高级VIP', value: 'svip' },
    { label: '企业用户', value: 'enterprise', disabled: true }
  ]

  /**
   * 性别选项
   */
  const GENDER_OPTIONS: OptionItem[] = [
    { label: '男', value: '1' },
    { label: '女', value: '2' }
  ]

  /**
   * 日期快捷选项
   */
  const DATE_SHORTCUTS = [
    { text: '今日', value: new Date() },
    { text: '昨日', value: () => new Date(Date.now() - 86400000) },
    { text: '一周前', value: () => new Date(Date.now() - 604800000) }
  ]

  /**
   * 模拟接口获取用户等级数据
   * @returns 用户等级选项列表
   */
  const fetchLevelOptions = (): Promise<OptionItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(LEVEL_OPTIONS)
      }, FETCH_DELAY)
    })
  }

  /**
   * 获取用户等级数据
   */
  const getLevelOptions = async (): Promise<void> => {
    levelOptions.value = await fetchLevelOptions()
    if (levelOptions.value.length) {
      ElMessage.success('成功获取到数据')
    }
  }

  /**
   * 表单项配置类型
   */
  interface FormItemConfig {
    label: string
    key: string
    type: string
    placeholder?: string
    props?: Record<string, any>
    [key: string]: any
  }

  /**
   * 创建表单项的工厂函数
   */
  const createFormItem = (config: FormItemConfig) => config

  // 基础表单项配置
  const baseFormItems = {
    username: createFormItem({
      label: '用户名',
      key: 'name',
      type: 'input',
      placeholder: '请输入用户名',
      clearable: true
    }),
    phone: createFormItem({
      label: '手机号',
      key: 'phone',
      type: 'input',
      props: { placeholder: '请输入手机号', maxlength: '11' }
    }),
    level: createFormItem({
      label: '用户等级',
      key: 'level',
      type: 'select',
      props: {
        placeholder: '请选择等级',
        options: LEVEL_OPTIONS
      }
    }),
    address: createFormItem({
      label: '地址',
      key: 'address',
      type: 'input',
      placeholder: '请输入地址'
    }),
    date: createFormItem({
      label: '日期',
      key: 'date',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: '请选择日期',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        shortcuts: DATE_SHORTCUTS
      }
    }),
    gender: createFormItem({
      label: '性别',
      key: 'userGender',
      type: 'radiogroup',
      props: {
        options: GENDER_OPTIONS
      }
    })
  }

  const userItem = ref<SearchFormItem>({
    label: '用户名',
    key: 'name',
    type: 'input',
    props: {
      placeholder: '请输入用户名',
      clearable: true
    }
  })

  // 控制用户名字段是否显示
  const showUserName = ref(true)

  // 动态表单项列表
  const dynamicFormItems = ref<SearchFormItem[]>([])

  // 动态表单项计数器（用于生成唯一 key）
  let dynamicItemCounter = 0

  // 级联选择器数据
  const cascaderOptions = [
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

  // 树选择器数据
  const treeSelectData = [
    {
      value: '1',
      label: '一级 1',
      children: [
        {
          value: '1-1',
          label: '二级 1-1',
          children: [{ value: '1-1-1', label: '三级 1-1-1' }]
        }
      ]
    },
    {
      value: '2',
      label: '一级 2',
      children: [
        {
          value: '2-1',
          label: '二级 2-1',
          children: [{ value: '2-1-1', label: '三级 2-1-1' }]
        },
        {
          value: '2-2',
          label: '二级 2-2',
          children: [{ value: '2-2-1', label: '三级 2-2-1' }]
        }
      ]
    }
  ]

  // 复选框选项
  const checkboxOptions = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' },
    { label: '选项4', value: 'option4' },
    { label: '选项5（disabled）', value: 'option5', disabled: true }
  ]

  // 表单配置
  const formItems = computed(() => [
    ...(showUserName.value ? [userItem.value] : []),
    // 动态表单项
    ...dynamicFormItems.value,
    {
      ...baseFormItems.phone
    },
    {
      ...baseFormItems.level,
      props: { placeholder: '请选择等级', options: levelOptions.value }
    },
    baseFormItems.address,
    baseFormItems.date,
    // 日期时间
    {
      label: '日期时间',
      key: 'datetime',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: '请选择日期时间',
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
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
    // 日期时间范围
    {
      label: '日期时间范围',
      key: 'datetimerange',
      type: 'datetime',
      props: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        rangeSeparator: '至',
        startPlaceholder: '开始日期时间',
        endPlaceholder: '结束日期时间'
      }
    },
    // 时间选择
    {
      label: '时间选择',
      key: 'timeselect',
      type: 'timeselect',
      props: {
        placeholder: '请选择时间',
        type: 'time',
        valueFormat: 'HH:mm:ss'
      }
    },
    // 时间选择器
    {
      label: '时间选择器',
      key: 'timepicker',
      type: 'timepicker',
      props: {
        style: { width: '100%' },
        placeholder: '请选择时间',
        type: 'time',
        valueFormat: 'HH:mm:ss'
      }
    },
    // 级联选择
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
        options: cascaderOptions
      }
    },
    // 树型选择器
    {
      label: '树型选择器',
      key: 'treeSelect',
      type: 'treeselect',
      props: {
        showCheckbox: true,
        multiple: true,
        clearable: true,
        data: treeSelectData
      }
    },
    { label: '插槽', key: 'slots', type: 'input', placeholder: '请输入邮箱' },
    {
      label: '渲染组件',
      key: 'iconSelector',
      render: () => h(ElInput, { placeholder: '渲染自定义 input' })
    },
    {
      label: '自定义组件',
      key: 'customComponent',
      render: () =>
        h(
          'div',
          {
            style:
              'color: var(--art-gray-600); border: 1px solid var(--default-border-dashed); padding: 0px 15px; border-radius: 6px'
          },
          '我是一个自定义组件'
        )
    },
    {
      label: '复选框',
      key: 'checkboxgroup',
      type: 'checkboxgroup',
      span: 12,
      props: {
        options: checkboxOptions
      }
    },
    {
      ...baseFormItems.gender
    },

    {
      label: '是否启用',
      key: 'isEnabled',
      type: 'switch',
      props: {
        placeholder: '请选择是否启用'
      }
    },
    {
      label: '年龄',
      key: 'age',
      type: 'number',
      slots: {
        suffix: () => h('span', { style: 'color: #909399; font-size: 12px' }, '岁')
      }
    },
    {
      label: '网站地址',
      key: 'website',
      type: 'input',
      placeholder: '请输入网站名称',
      slots: {
        prepend: () => h('span', 'https://'),
        append: () => h('span', '.com')
      }
    },
    {
      label: '事件演示',
      key: 'event',
      type: 'input',
      props: {
        placeholder: '输入内容触发事件，控制台查看',
        clearable: true,
        prefixIcon: 'Search',
        // prefix: () => h('span', {}, '123'),
        // 事件必须以 on 开头，然后驼峰式命名拼接 ElementPlus 事件名
        onInput(val: string) {
          console.log('输入事件', val)
        },
        onClear() {
          console.log('清空事件')
        }
      }
    },

    {
      label: '多行输入',
      key: 'remark',
      type: 'input',
      props: {
        placeholder: '请输入备注',
        type: 'textarea',
        rows: 2
      }
    },
    {
      label: '评分',
      key: 'rate',
      type: 'rate',
      props: {
        size: 'large',
        placeholder: '请选择评分'
      }
    },
    {
      label: '禁用',
      key: 'diaabled',
      type: 'input',
      placeholder: '我被禁用了',
      disabled: true // 禁用
    },
    {
      label: '滑块',
      key: 'slider',
      type: 'slider'
      // props: {
      //   step: 10,
      //   showStops: true
      // }
    },

    {
      label: '隐藏',
      key: 'email',
      type: 'input',
      hidden: true
    },
    // 根据条件隐藏
    {
      label: '根据条件隐藏',
      key: 'systemName',
      type: 'input',
      hidden: formData.value.systemName === 'mac',
      placeholder: '输入 mac 组件隐藏'
    },
    {
      label: '栅格布局',
      key: 'sg1',
      type: 'input',
      span: 12,
      placeholder: '示例：栅格 span=12 占容器一半宽度，span=24 占满容器'
    },
    // 文件上传示例 - 使用 render 函数渲染
    {
      label: '文件上传',
      key: 'multipleFiles',
      span: 12,
      render: () =>
        h(
          ElUpload,
          {
            multiple: true,
            limit: 5,
            action: '#',
            autoUpload: false,
            showFileList: true,
            // accept: '.pdf,.doc,.docx,.txt',
            beforeUpload: (file: File) => {
              console.log('准备上传文件:', file.name)
              return true
            },
            onChange: (file: UploadFile, fileList: UploadFiles) => {
              console.log('多文件变化:', file, fileList)
              formData.value.multipleFiles = fileList as UploadUserFile[]
            },
            onRemove: (file: UploadFile, fileList: UploadFiles) => {
              console.log('删除文件:', file, fileList)
              formData.value.multipleFiles = fileList as UploadUserFile[]
            },
            onExceed: (files: File[], fileList: UploadUserFile[]) => {
              ElMessage.warning(
                `最多只能上传 5 个文件，当前选择了 ${files.length + fileList.length} 个文件`
              )
            }
          },
          {
            default: () => [h(ElButton, { type: 'primary' }, () => '点击上传')]
          }
        )
    },
    // 图片上传示例 - 使用 render 函数渲染
    {
      label: '图片上传',
      key: 'imageUpload',
      span: 12,
      render: () =>
        h(
          ElUpload,
          {
            accept: '.jpg,.jpeg,.png,.gif,.webp',
            limit: 4,
            action: '#',
            autoUpload: false,
            showFileList: true,
            listType: 'picture-card',
            beforeUpload: (file: File) => {
              const isImage = file.type.startsWith('image/')
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isImage) {
                ElMessage.error('只能上传图片文件!')
                return false
              }
              if (!isLt2M) {
                ElMessage.error('图片大小不能超过 2MB!')
                return false
              }
              return true
            },
            onChange: (file: UploadFile, fileList: UploadFiles) => {
              console.log('图片变化:', file, fileList)
              formData.value.imageUpload = fileList as UploadUserFile[]
            },
            onRemove: (file: UploadFile, fileList: UploadFiles) => {
              console.log('删除图片:', file, fileList)
              formData.value.imageUpload = fileList as UploadUserFile[]
            },
            onPreview: (file: UploadFile) => {
              dialogImageUrl.value = file.url || ''
              dialogVisible.value = true
            }
          },
          {
            default: () => [h(ElIcon, { type: 'primary' }, () => h(Plus))]
          }
        )
    },
    // 富文本编辑器示例 - 使用 render 函数渲染
    {
      label: '富文本编辑器',
      key: 'richTextContent',
      span: 24,
      render: () =>
        h(ArtWangEditor, {
          modelValue: formData.value.richTextContent,
          height: '300px',
          placeholder: '请输入富文本内容...',
          'onUpdate:modelValue': (value: string) => {
            formData.value.richTextContent = value
            console.log('富文本内容变化:', value)
          },
          toolbarKeys: [
            'headerSelect',
            'bold',
            'italic',
            'underline',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'insertLink',
            'insertImage',
            '|',
            'undo',
            'redo'
          ]
        })
    }
  ])

  /**
   * 处理表单重置事件
   */
  const handleReset = (): void => {
    console.log('重置表单')
    emit('reset')
  }

  /**
   * 处理表单提交事件
   */
  const handleSubmit = async (): Promise<void> => {
    await formRef.value.validate()
    emit('search', formData.value)
    console.log('表单数据', formData.value)
  }

  /**
   * 校验表单
   */
  const validateForm = () => formRef.value.validate()

  /**
   * 重置表单
   */
  const resetForm = () => formRef.value.reset()

  /**
   * 更新用户名字段配置
   */
  const updateUserName = (): void => {
    userItem.value = {
      ...userItem.value,
      label: '昵称',
      props: {
        placeholder: '请输入昵称'
      }
    }
  }

  /**
   * 删除用户名字段
   */
  const deleteUserName = (): void => {
    showUserName.value = false
    formData.value.name = undefined
  }

  /**
   * 新增表单项
   */
  const addFormItem = (): void => {
    dynamicItemCounter++
    const newItem: SearchFormItem = {
      label: `动态字段${dynamicItemCounter}`,
      key: `dynamic_${dynamicItemCounter}`,
      type: 'input',
      props: {
        placeholder: `请输入动态字段${dynamicItemCounter}`,
        clearable: true
      }
    }
    dynamicFormItems.value.push(newItem)
    ElMessage.success(`已新增表单项：${newItem.label}`)
  }

  /**
   * 修改表单项（修改最后一个动态表单项）
   */
  const updateFormItem = (): void => {
    if (dynamicFormItems.value.length === 0) {
      ElMessage.warning('没有可修改的动态表单项，请先新增')
      return
    }

    const lastIndex = dynamicFormItems.value.length - 1
    const lastItem = dynamicFormItems.value[lastIndex]

    // 修改最后一个表单项的配置
    dynamicFormItems.value[lastIndex] = {
      ...lastItem,
      label: `已修改`,
      type: 'select',
      props: {
        placeholder: '修改为下拉选择',
        options: [
          { label: '选项A', value: 'a' },
          { label: '选项B', value: 'b' },
          { label: '选项C', value: 'c' }
        ]
      }
    }

    ElMessage.success(`已修改表单项：${lastItem.label}`)
  }

  /**
   * 删除表单项（删除最后一个动态表单项）
   */
  const deleteFormItem = (): void => {
    if (dynamicFormItems.value.length === 0) {
      ElMessage.warning('没有可删除的动态表单项')
      return
    }

    const deletedItem = dynamicFormItems.value.pop()
    if (deletedItem) {
      // 清除对应的表单数据
      delete formData.value[deletedItem.key as keyof FormData]
      ElMessage.success(`已删除表单项：${deletedItem.label}`)
    }
  }

  /**
   * 批量新增表单项
   */
  const batchAddFormItems = (): void => {
    const batchItems: SearchFormItem[] = [
      {
        label: '公司名称',
        key: `company_${++dynamicItemCounter}`,
        type: 'input',
        props: {
          placeholder: '请输入公司名称',
          clearable: true
        }
      },
      {
        label: '部门',
        key: `department_${++dynamicItemCounter}`,
        type: 'select',
        props: {
          placeholder: '请选择部门',
          options: [
            { label: '技术部', value: 'tech' },
            { label: '产品部', value: 'product' },
            { label: '运营部', value: 'operation' }
          ]
        }
      },
      {
        label: '入职日期',
        key: `joinDate_${++dynamicItemCounter}`,
        type: 'datetime',
        props: {
          style: { width: '100%' },
          placeholder: '请选择入职日期',
          type: 'date',
          valueFormat: 'YYYY-MM-DD'
        }
      }
    ]

    dynamicFormItems.value.push(...batchItems)
    ElMessage.success(`已批量新增 ${batchItems.length} 个表单项`)
  }

  /**
   * 重置动态表单项
   */
  const resetDynamicItems = (): void => {
    if (dynamicFormItems.value.length === 0) {
      ElMessage.info('当前没有动态表单项')
      return
    }

    // 清除所有动态表单项的数据
    dynamicFormItems.value.forEach((item) => {
      delete formData.value[item.key as keyof FormData]
    })

    dynamicFormItems.value = []
    dynamicItemCounter = 0
    ElMessage.success('已重置所有动态表单项')
  }
</script>
