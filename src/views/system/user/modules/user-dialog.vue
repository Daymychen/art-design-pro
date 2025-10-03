<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
    width="30%"
    align-center
  >
    <ArtForm
      ref="formRef"
      v-model="formData"
      :items="formItems"
      :rules="rules"
      :span="24"
      label-width="80px"
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
    role: [] as string[]
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
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      props: {
        clearable: true
      }
    },
    {
      key: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '请输入手机号',
      props: {
        clearable: true,
        maxlength: 11
      }
    },
    {
      key: 'gender',
      label: '性别',
      type: 'select',
      props: {
        placeholder: '请选择性别',
        options: genderOptions
      }
    },
    {
      key: 'role',
      label: '角色',
      type: 'select',
      props: {
        placeholder: '请选择角色',
        multiple: true,
        options: roleList.value.map((role) => ({
          label: role.roleName,
          value: role.roleCode
        }))
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
      role: isEdit ? (Array.isArray(row.userRoles) ? row.userRoles : []) : []
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
