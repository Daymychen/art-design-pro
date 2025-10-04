<template>
  <ArtDialog :dialog-instance="dialogInstance" @confirm="handleSubmit">
    <ArtForm
      ref="formRef"
      v-model="formData"
      :items="formItems"
      :rules="rules"
      :span="24"
      label-width="90px"
    />
  </ArtDialog>
</template>

<script setup lang="ts">
  import { ROLE_LIST_DATA } from '@/mock/temp/formData'
  import type { FormItem, FormRule } from '@/types/component/form'
  import ArtDialog from '@/components/core/base/art-dialog/index.vue'
  import type { useDialog } from '@/composables/useDialog'

  /** 用户记录类型（扩展 API 类型，添加表单专用字段） */
  interface UserRecord extends Partial<Api.SystemManage.UserListItem> {
    emails?: string[]
    address?: string
    bio?: string
  }

  /** 表单数据类型 */
  interface UserFormData {
    username: string
    phone: string
    gender: string
    role: string[]
    emails: string[]
    address: string
    bio: string
  }

  /** Dialog Props 类型 */
  interface UserDialogProps {
    record?: UserRecord
  }

  interface Props {
    /** useDialog 实例 - 从父组件传入 */
    dialogInstance: ReturnType<typeof useDialog>
  }

  const props = defineProps<Props>()

  // 从 dialogInstance 中获取 record（带类型约束）
  const record = computed<UserRecord>(() => {
    const dialogProps = props.dialogInstance.dialogConfig.value.props as UserDialogProps | undefined
    return (dialogProps?.record || {}) as UserRecord
  })

  // 根据 record 判断是新增还是编辑模式
  const isEditMode = computed(() => {
    return record.value && Object.keys(record.value).length > 0
  })

  // 角色列表数据
  const roleList = ref(ROLE_LIST_DATA)

  // 表单实例（带类型）
  const formRef = ref<{ validate: () => Promise<void>; clearValidate: () => void }>()

  // 表单数据（带类型）
  const formData = ref<UserFormData>({
    username: '',
    phone: '',
    gender: '男',
    role: [],
    emails: [''], // 🆕 动态数组字段
    address: '',
    bio: ''
  })

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
    const row = record.value

    formData.value = {
      username: isEditMode.value ? row.userName || '' : '',
      phone: isEditMode.value ? row.userPhone || '' : '',
      gender: isEditMode.value ? row.userGender || '男' : '男',
      role: isEditMode.value ? (Array.isArray(row.userRoles) ? row.userRoles : []) : [],
      // 🆕 动态数组字段初始化
      emails: isEditMode.value
        ? Array.isArray(row.emails) && row.emails.length > 0
          ? row.emails
          : ['']
        : [''],
      // 🆕 其他信息字段初始化
      address: isEditMode.value ? row.address || '' : '',
      bio: isEditMode.value ? row.bio || '' : ''
    }
  }

  // 监听弹窗打开状态（优化性能，避免 deep watch）
  watch(
    () => props.dialogInstance.visible.value,
    (isVisible) => {
      if (isVisible) {
        initFormData()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    }
  )

  /**
   * 处理确认按钮点击（由 ArtDialog 触发）
   */
  const handleSubmit = async () => {
    // 1. 验证表单
    await formRef.value?.validate()
    console.log('formData', formData.value)

    // 2. 调用 dialog.submit(formData)
    //    - 会执行 open 时传入的 onSubmit 回调
    //    - 回调完成后自动关闭弹窗
    await props.dialogInstance.submit(formData.value)
  }

  // 暴露方法给父组件调用
  defineExpose({
    handleSubmit,
    formRef
  })
</script>
