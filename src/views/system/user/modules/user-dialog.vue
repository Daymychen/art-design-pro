<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
    width="50%"
    align-center
  >
    <ArtForm
      ref="formRef"
      v-model="formData"
      :items="formItems"
      :rules="rules"
      :span="24"
      label-width="90px"
    />

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit" :loading="submitting"> 提交 </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { ROLE_LIST_DATA } from '@/mock/temp/formData'
  import type { FormItem, FormRule } from '@/types/component/form'

  interface Props {
    visible: boolean
    type: string
    userData?: any
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 角色列表数据
  const roleList = ref(ROLE_LIST_DATA)

  // 对话框显示控制
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const dialogType = computed(() => props.type)

  // 表单实例
  const formRef = ref()

  // 表单数据
  const formData = ref({
    username: '',
    phone: '',
    gender: '男',
    role: [] as string[],
    emails: [''], // 🆕 动态数组字段
    address: '',
    bio: ''
  })

  // 提交状态
  const submitting = ref(false)

  // 性别选项
  const genderOptions = [
    { label: '男', value: '男' },
    { label: '女', value: '女' }
  ]

  // 表单验证规则（外部配置，优先级更高）
  const rules: Record<string, FormRule[]> = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'blur' }]
  }

  // 表单项配置
  const formItems = computed<FormItem[]>(() => [
    // 🆕 表单分组 1：基本信息
    {
      key: 'group_basic',
      type: 'group',
      groupConfig: {
        title: '📋 基本信息',
        collapsible: true,
        defaultExpanded: true,
        children: [
          {
            key: 'username',
            label: '用户名',
            type: 'input',
            placeholder: '请输入用户名',
            tooltip: '用户名长度2-20个字符',
            span: 12,
            props: {
              clearable: true
            }
          },
          {
            key: 'phone',
            label: '手机号',
            type: 'input',
            placeholder: '请输入手机号',
            help: '格式：13800138000',
            span: 12,
            props: {
              clearable: true,
              maxlength: 11
            }
          },
          {
            key: 'gender',
            label: '性别',
            type: 'select',
            span: 12,
            props: {
              placeholder: '请选择性别',
              options: genderOptions
            }
          },
          {
            key: 'role',
            label: '角色',
            type: 'select',
            tooltip: '可选择多个角色',
            span: 12,
            props: {
              placeholder: '请选择角色',
              multiple: true,
              options: roleList.value.map((role) => ({
                label: role.roleName,
                value: role.roleCode
              }))
            }
          }
        ]
      }
    },

    // 🆕 表单分组 2：联系方式（动态数组）
    {
      key: 'group_contact',
      type: 'group',
      groupConfig: {
        title: '📧 联系方式',
        collapsible: true,
        defaultExpanded: true,
        children: [
          {
            key: 'emails',
            label: '邮箱地址',
            type: 'array',
            placeholder: '请输入邮箱地址',
            tooltip: '可添加多个邮箱地址',
            span: 24,
            arrayConfig: {
              itemType: 'input',
              itemProps: {
                type: 'email',
                clearable: true
              },
              min: 1,
              max: 5,
              addText: '添加邮箱',
              showActions: true
            }
          }
        ]
      }
    },

    // 🆕 表单分组 3：其他信息（可折叠）
    {
      key: 'group_other',
      type: 'group',
      groupConfig: {
        title: '📝 其他信息',
        collapsible: true,
        defaultExpanded: false, // 默认折叠
        children: [
          {
            key: 'address',
            label: '地址',
            type: 'input',
            placeholder: '请输入地址',
            span: 24,
            props: {
              clearable: true
            }
          },
          {
            key: 'bio',
            label: '个人简介',
            type: 'input',
            placeholder: '请输入个人简介',
            help: '不超过200字',
            span: 24,
            props: {
              type: 'textarea',
              rows: 3,
              maxlength: 200,
              showWordLimit: true
            }
          }
        ]
      }
    }
  ])

  // 初始化表单数据
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.userData
    const row = props.userData

    formData.value = {
      username: isEdit ? row.userName || '' : '',
      phone: isEdit ? row.userPhone || '' : '',
      gender: isEdit ? row.userGender || '男' : '男',
      role: isEdit ? (Array.isArray(row.userRoles) ? row.userRoles : []) : [],
      // 🆕 动态数组字段初始化
      emails: isEdit
        ? Array.isArray(row.emails) && row.emails.length > 0
          ? row.emails
          : ['']
        : [''],
      // 🆕 其他信息字段初始化
      address: isEdit ? row.address || '' : '',
      bio: isEdit ? row.bio || '' : ''
    }
  }

  // 统一监听对话框状态变化
  watch(
    () => [props.visible, props.type, props.userData],
    ([visible]) => {
      if (visible) {
        initFormData()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    },
    { immediate: true }
  )

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    submitting.value = true
    try {
      await formRef.value.validate((valid: boolean) => {
        if (valid) {
          console.log('formData', formData.value)
          ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
          dialogVisible.value = false
          emit('submit')
        }
      })
    } finally {
      submitting.value = false
    }
  }
</script>
