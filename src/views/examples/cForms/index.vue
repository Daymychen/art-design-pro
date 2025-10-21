<!-- TableSelect 表单组件示例 -->
<template>
  <div class="form-example">
    <h2 class="title">TableSelect 表单组件示例</h2>

    <ElCard class="art-custom-card" shadow="never">
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
      />
    </ElCard>

    <div class="code">
      <pre><code>{{ formData }}</code></pre>
    </div>

    <div class="button-group">
      <ElSpace wrap>
        <ElButton type="primary" @click="validateForm">校验表单</ElButton>
        <ElButton @click="resetForm">重置表单</ElButton>
        <ElButton @click="handleSubmit">提交表单</ElButton>
      </ElSpace>
    </div>
  </div>
</template>

<script setup lang="ts">
  import TableSelect from '@/components/core/forms/art-form-item/select-table/index.vue'
  import { ElMessage } from 'element-plus'

  interface FormData {
    singleUser?: string
    multipleUsers?: string[]
    department?: string
    project?: string
  }

  const formRef = ref()

  /**
   * 表单数据
   */
  const formData = ref<FormData>({
    singleUser: undefined,
    multipleUsers: [],
    department: undefined,
    project: undefined
  })

  /**
   * 表单校验规则
   */
  const formRules = {
    singleUser: [{ required: true, message: '请选择用户', trigger: 'change' }],
    multipleUsers: [
      {
        required: true,
        type: 'array',
        min: 1,
        message: '请至少选择一个用户',
        trigger: 'change'
      }
    ],
    department: [{ required: true, message: '请选择部门', trigger: 'change' }]
  }

  const labelWidth = ref(120)
  const labelPosition = ref<'right' | 'left' | 'top'>('right')
  const span = ref(8)
  const gutter = ref(16)

  // ========== Mock 数据 ==========

  /**
   * 用户列表 Mock 数据
   */
  const mockUsers = [
    {
      id: '1',
      name: '张三',
      dept: '技术部',
      position: '前端工程师',
      email: 'zhangsan@example.com',
      status: '在职'
    },
    {
      id: '2',
      name: '李四',
      dept: '技术部',
      position: '后端工程师',
      email: 'lisi@example.com',
      status: '在职'
    },
    {
      id: '3',
      name: '王五',
      dept: '产品部',
      position: '产品经理',
      email: 'wangwu@example.com',
      status: '在职'
    },
    {
      id: '4',
      name: '赵六',
      dept: '设计部',
      position: 'UI设计师',
      email: 'zhaoliu@example.com',
      status: '在职'
    },
    {
      id: '5',
      name: '张小明',
      dept: '技术部',
      position: '测试工程师',
      email: 'zhangxm@example.com',
      status: '在职'
    },
    {
      id: '6',
      name: '李小红',
      dept: '运营部',
      position: '运营专员',
      email: 'lixh@example.com',
      status: '在职'
    },
    {
      id: '7',
      name: '王小刚',
      dept: '技术部',
      position: '架构师',
      email: 'wangxg@example.com',
      status: '在职'
    },
    {
      id: '8',
      name: '张伟',
      dept: '产品部',
      position: '产品助理',
      email: 'zhangwei@example.com',
      status: '离职'
    }
  ]

  /**
   * 部门列表 Mock 数据
   */
  const mockDepartments = [
    { id: 'd1', name: '技术部', code: 'TECH', manager: '张经理', count: 25 },
    { id: 'd2', name: '产品部', code: 'PROD', manager: '李经理', count: 15 },
    { id: 'd3', name: '设计部', code: 'DESIGN', manager: '王经理', count: 10 },
    { id: 'd4', name: '运营部', code: 'OPS', manager: '赵经理', count: 12 },
    { id: 'd5', name: '市场部', code: 'MARKET', manager: '刘经理', count: 18 }
  ]

  /**
   * 项目列表 Mock 数据
   */
  const mockProjects = [
    {
      id: 'p1',
      name: 'ERP系统',
      code: 'ERP-001',
      leader: '张三',
      status: '进行中',
      progress: 75
    },
    {
      id: 'p2',
      name: 'CRM系统',
      code: 'CRM-001',
      leader: '李四',
      status: '进行中',
      progress: 60
    },
    {
      id: 'p3',
      name: 'OA系统',
      code: 'OA-001',
      leader: '王五',
      status: '已完成',
      progress: 100
    },
    {
      id: 'p4',
      name: '移动APP',
      code: 'APP-001',
      leader: '赵六',
      status: '进行中',
      progress: 45
    }
  ]

  /**
   * 模拟异步获取用户列表
   */
  const fetchUserList = async (query: string): Promise<any[]> => {
    console.log('搜索用户:', query)

    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 根据查询条件过滤
    if (!query) {
      return mockUsers
    }

    return mockUsers.filter(
      (user) =>
        user.name.includes(query) ||
        user.dept.includes(query) ||
        user.position.includes(query) ||
        user.email.includes(query)
    )
  }

  /**
   * 模拟异步获取部门列表
   */
  const fetchDepartmentList = async (query: string): Promise<any[]> => {
    console.log('搜索部门:', query)

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!query) {
      return mockDepartments
    }

    return mockDepartments.filter(
      (dept) =>
        dept.name.includes(query) || dept.code.includes(query) || dept.manager.includes(query)
    )
  }

  /**
   * 模拟异步获取项目列表
   */
  const fetchProjectList = async (query: string): Promise<any[]> => {
    console.log('搜索项目:', query)

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!query) {
      return mockProjects
    }

    return mockProjects.filter(
      (project) =>
        project.name.includes(query) ||
        project.code.includes(query) ||
        project.leader.includes(query)
    )
  }

  // ========== 表单配置 ==========

  /**
   * 用户表格列配置
   */
  const userColumns = [
    { label: '姓名', prop: 'name', width: 120 },
    { label: '部门', prop: 'dept', width: 120 },
    { label: '职位', prop: 'position', width: 140 },
    { label: '邮箱', prop: 'email', minWidth: 180 },
    { label: '状态', prop: 'status', width: 80 }
  ]

  /**
   * 部门表格列配置
   */
  const departmentColumns = [
    { label: '部门名称', prop: 'name', width: 150 },
    { label: '部门编码', prop: 'code', width: 120 },
    { label: '负责人', prop: 'manager', width: 120 },
    { label: '人数', prop: 'count', width: 80 }
  ]

  /**
   * 项目表格列配置
   */
  const projectColumns = [
    { label: '项目名称', prop: 'name', width: 150 },
    { label: '项目编码', prop: 'code', width: 120 },
    { label: '负责人', prop: 'leader', width: 120 },
    { label: '状态', prop: 'status', width: 100 },
    { label: '进度', prop: 'progress', width: 80 }
  ]

  /**
   * 表单项配置
   */
  const formItems = computed(() => [
    // 单选用户
    {
      label: '选择用户（单选）',
      key: 'singleUser',
      type: () =>
        h(TableSelect, {
          columns: userColumns,
          request: fetchUserList,
          valueKey: 'id',
          labelKey: 'name',
          placeholder: '请输入搜索用户',
          clearable: true,
          tableHeight: 300,
          'onUpdate:modelValue': (value: any) => {
            formData.value.singleUser = value
          }
        }),
      span: 12
    },
    // 多选用户
    {
      label: '选择用户（多选）',
      key: 'multipleUsers',
      type: () =>
        h(TableSelect, {
          columns: userColumns,
          request: fetchUserList,
          valueKey: 'id',
          labelKey: 'name',
          placeholder: '请输入搜索用户（可多选）',
          multiple: true,
          clearable: true,
          tableHeight: 300,
          'onUpdate:modelValue': (value: any) => {
            formData.value.multipleUsers = value
          }
        }),
      span: 12
    },
    // 选择部门
    {
      label: '选择部门',
      key: 'department',
      type: () =>
        h(TableSelect, {
          columns: departmentColumns,
          request: fetchDepartmentList,
          valueKey: 'id',
          labelKey: 'name',
          placeholder: '请输入搜索部门',
          clearable: true,
          tableHeight: 300,
          'onUpdate:modelValue': (value: any) => {
            formData.value.department = value
          }
        }),
      span: 12
    },
    // 选择项目
    {
      label: '选择项目',
      key: 'project',
      type: () =>
        h(TableSelect, {
          columns: projectColumns,
          request: fetchProjectList,
          valueKey: 'id',
          labelKey: 'name',
          placeholder: '请输入搜索项目',
          clearable: true,
          tableHeight: 350,
          popperWidth: 600, // 自定义下拉框宽度
          tableProps: {
            stripe: true
          },
          'onUpdate:modelValue': (value: any) => {
            formData.value.project = value
          }
        }),
      span: 12
    }
  ])

  // ========== 事件处理 ==========

  /**
   * 处理表单重置事件
   */
  const handleReset = (): void => {
    console.log('重置表单')
    formData.value = {
      singleUser: undefined,
      multipleUsers: [],
      department: undefined,
      project: undefined
    }
  }

  /**
   * 处理表单提交事件
   */
  const handleSubmit = async (): Promise<void> => {
    try {
      await formRef.value.validate()
      console.log('表单数据:', formData.value)
      ElMessage.success('表单提交成功！')
    } catch (error) {
      console.error('表单验证失败:', error)
      ElMessage.error('表单验证失败，请检查必填项')
    }
  }

  /**
   * 校验表单
   */
  const validateForm = async () => {
    try {
      await formRef.value.validate()
      ElMessage.success('表单验证通过！')
    } catch {
      ElMessage.error('表单验证失败')
    }
  }

  /**
   * 重置表单
   */
  const resetForm = () => {
    formRef.value.reset()
    ElMessage.success('表单已重置')
  }
</script>

<style scoped lang="scss">
  .form-example {
    padding-bottom: 20px;

    .title {
      margin-bottom: 5px;
      font-size: 18px;
      font-weight: 500;

      &.m-15 {
        margin-top: 15px;
      }
    }

    .code {
      padding: 15px;
      margin-top: 15px;
      font-size: 14px;
      background-color: var(--art-main-bg-color);
      border: 1px solid var(--art-border-color);
      border-radius: var(--el-border-radius-base);
    }

    .button-group {
      margin-top: 15px;
    }
  }
</style>
