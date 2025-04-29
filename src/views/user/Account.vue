<template>
  <ArtTableFullScreen>
    <div class="account-page" id="table-full-screen">
      <!-- 搜索栏 -->
      <ArtSearchBar
        v-model:filter="formFilters"
        :items="formItems"
        @reset="handleReset"
        @search="handleSearch"
      ></ArtSearchBar>

      <ElCard shadow="never" class="art-table-card">
        <!-- 表格头部 -->
        <ArtTableHeader
          :columnList="columnOptions"
          v-model:columns="columnChecks"
          @refresh="handleRefresh"
        >
          <template #left>
            <ElButton @click="showDialog('add')" v-ripple>新增用户</ElButton>
          </template>
        </ArtTableHeader>

        <!-- 表格 -->
        <ArtTable
          :loading="loading"
          :data="tableData"
          selection
          :currentPage="1"
          :pageSize="20"
          :total="50"
          :marginTop="10"
          height="100%"
        >
          <template #default>
            <ElTableColumn v-for="col in columns" :key="col.prop || col.type" v-bind="col" />
          </template>
        </ArtTable>

        <ElDialog
          v-model="dialogVisible"
          :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
          width="30%"
        >
          <ElForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
            <ElFormItem label="用户名" prop="username">
              <ElInput v-model="formData.username" />
            </ElFormItem>
            <ElFormItem label="手机号" prop="phone">
              <ElInput v-model="formData.phone" />
            </ElFormItem>
            <ElFormItem label="性别" prop="sex">
              <ElSelect v-model="formData.sex">
                <ElOption label="男" value="男" />
                <ElOption label="女" value="女" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="部门" prop="dep">
              <ElSelect v-model="formData.dep">
                <ElOption label="董事会部" :value="1" />
                <ElOption label="市场部" :value="2" />
                <ElOption label="技术部" :value="3" />
              </ElSelect>
            </ElFormItem>
          </ElForm>
          <template #footer>
            <div class="dialog-footer">
              <ElButton @click="dialogVisible = false">取消</ElButton>
              <ElButton type="primary" @click="handleSubmit">提交</ElButton>
            </div>
          </template>
        </ElDialog>
      </ElCard>
    </div>
  </ArtTableFullScreen>
</template>

<script setup lang="ts">
  import { h } from 'vue'
  import { ACCOUNT_TABLE_DATA } from '@/mock/temp/formData'
  import { SearchChangeParams, SearchFormItem } from '@/types/search-form'
  import { ElDialog, FormInstance, ElTag } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import type { FormRules } from 'element-plus'
  import { useCheckedColumns } from '@/composables/useCheckedColumns'
  import ArtButtonTable from '@/components/core/forms/ArtButtonTable.vue'

  const dialogType = ref('add')
  const dialogVisible = ref(false)
  const loading = ref(false)

  // 定义表单搜索初始值
  const initialSearchState = {
    name: '',
    gender: 'male',
    phone: '',
    address: '',
    level: '',
    email: '',
    company: ''
  }

  // 响应式表单数据
  const formFilters = reactive({ ...initialSearchState })

  // 重置表单
  const handleReset = () => {
    Object.assign(formFilters, { ...initialSearchState })
  }

  // 搜索处理
  const handleSearch = () => {
    console.log('搜索参数:', formFilters)
    getTableData()
  }

  // 表单项变更处理
  const handleFormChange = (params: SearchChangeParams): void => {
    console.log('表单项变更:', params)
  }

  // 表单配置项
  const formItems: SearchFormItem[] = [
    {
      label: '用户名',
      prop: 'name',
      type: 'input',
      config: {
        clearable: true
      },
      onChange: handleFormChange
    },

    {
      label: '电话',
      prop: 'phone',
      type: 'input',
      config: {
        placeholder: '请输入电话号码',
        clearable: true
      },
      onChange: handleFormChange
    },
    {
      label: '用户等级',
      prop: 'level',
      type: 'select',
      config: {
        clearable: true
      },
      options: () => [
        { label: '普通用户', value: 'normal' },
        { label: 'VIP用户', value: 'vip' },
        { label: '高级VIP', value: 'svip' },
        { label: '企业用户', value: 'enterprise', disabled: true }
      ],
      onChange: handleFormChange
    },
    {
      label: '地址',
      prop: 'address',
      type: 'input',
      config: {
        placeholder: '请输入地址',
        clearable: true
      },
      onChange: handleFormChange
    },
    {
      label: '邮箱',
      prop: 'email',
      type: 'input',
      config: {
        placeholder: '请输入邮箱',
        clearable: true
      },
      onChange: handleFormChange
    },
    {
      label: '公司',
      prop: 'company',
      type: 'input',
      config: {
        placeholder: '请输入公司名称',
        clearable: true
      },
      onChange: handleFormChange
    },
    {
      label: '性别',
      prop: 'gender',
      type: 'radio',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ],
      onChange: handleFormChange
    }
  ]

  // 列配置
  const columnOptions = [
    { label: '勾选', type: 'selection' },
    { label: '用户名', prop: 'avatar' },
    { label: '手机号', prop: 'mobile' },
    { label: '性别', prop: 'sex' },
    { label: '部门', prop: 'dep' },
    { label: '状态', prop: 'status' },
    { label: '创建日期', prop: 'create_time' },
    { label: '操作', prop: 'operation' }
  ]

  // 获取标签类型
  // 1: 在线 2: 离线 3: 异常 4: 注销
  const getTagType = (status: string) => {
    switch (status) {
      case '1':
        return 'success'
      case '2':
        return 'info'
      case '3':
        return 'warning'
      case '4':
        return 'danger'
      default:
        return 'info'
    }
  }

  // 构建标签文本
  const buildTagText = (status: string) => {
    let text = ''
    if (status === '1') {
      text = '在线'
    } else if (status === '2') {
      text = '离线'
    } else if (status === '3') {
      text = '异常'
    } else if (status === '4') {
      text = '注销'
    }
    return text
  }

  // 显示对话框
  const showDialog = (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      formData.username = row.username
      formData.phone = row.mobile
      formData.sex = row.sex === 1 ? '男' : '女'
      formData.dep = row.dep
    } else {
      formData.username = ''
      formData.phone = ''
      formData.sex = '男'
      formData.dep = ''
    }
  }

  // 删除用户
  const deleteUser = () => {
    ElMessageBox.confirm('确定要注销该用户吗？', '注销用户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      ElMessage.success('注销成功')
    })
  }

  // 动态列配置
  const { columnChecks, columns } = useCheckedColumns(() => [
    { type: 'selection' }, // 勾选列
    // { type: 'expand', label: '展开', width: 80 }, // 展开列
    // { type: 'index', label: '序号', width: 80 }, // 序号列
    {
      prop: 'avatar',
      label: '用户名',
      formatter: (row: any) => {
        return h('div', { class: 'user', style: 'display: flex; align-items: center' }, [
          h('img', { class: 'avatar', src: row.avatar }),
          h('div', {}, [
            h('p', { class: 'user-name' }, row.username),
            h('p', { class: 'email' }, row.email)
          ])
        ])
      }
    },
    { prop: 'mobile', label: '手机号' },
    {
      prop: 'sex',
      label: '性别',
      sortable: true,
      formatter: (row) => (row.sex === 1 ? '男' : '女')
    },
    { prop: 'dep', label: '部门' },
    {
      prop: 'status',
      label: '状态',
      formatter: (row) => {
        return h(ElTag, { type: getTagType(row.status) }, () => buildTagText(row.status))
      }
    },
    {
      prop: 'create_time',
      label: '创建日期',
      sortable: true
    },
    {
      prop: 'operation',
      label: '操作',
      width: 150,
      // fixed: 'right', // 固定在右侧
      // disabled: true,
      formatter: (row: any) => {
        return h('div', [
          h(ArtButtonTable, {
            type: 'edit',
            onClick: () => showDialog('edit', row)
          }),
          h(ArtButtonTable, {
            type: 'delete',
            onClick: () => deleteUser()
          })
        ])
      }
    }
  ])

  // 表单实例
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive({
    username: '',
    phone: '',
    sex: '',
    dep: ''
  })

  // 表格数据
  const tableData = ref<any[]>([])

  onMounted(() => {
    getTableData()
  })

  const getTableData = () => {
    loading.value = true
    setTimeout(() => {
      tableData.value = ACCOUNT_TABLE_DATA
      loading.value = false
    }, 500)
  }

  const handleRefresh = () => {
    tableData.value = []
    getTableData()
  }

  // 表单验证规则
  const rules = reactive<FormRules>({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    dep: [{ required: true, message: '请选择部门', trigger: 'change' }]
  })

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
      }
    })
  }
</script>

<style lang="scss" scoped>
  .account-page {
    // 添加表格容器样式
    .table-container {
      flex: 1;
      min-height: 0; // 重要：允许容器收缩
      padding: 16px; // 根据需求调整内边距
    }

    :deep(.user) {
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 6px;
      }

      > div {
        margin-left: 10px;

        .user-name {
          font-weight: 500;
          color: var(--art-text-gray-800);
        }
      }
    }
  }
</style>
