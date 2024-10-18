<template>
  <div class="page-content">
    <table-bar
      :showTop="false"
      @search="search"
      @reset="resetForm(searchFormRef)"
      @changeColumn="changeColumn"
      :columns="columns"
    >
      <template #top>
        <el-form :model="searchForm" ref="searchFormRef" label-width="82px">
          <el-row :gutter="20">
            <form-input label="用户名" prop="name" v-model="searchForm.name" />
            <form-input label="手机号" prop="phone" v-model="searchForm.phone" />
            <form-input label="邮箱" prop="email" v-model="searchForm.email" />
            <form-input label="账号" prop="account" v-model="searchForm.account" />
          </el-row>
          <el-row :gutter="20">
            <form-input label="用户ID" prop="id" v-model="searchForm.id" />
            <form-select label="性别" prop="sex" v-model="searchForm.sex" :options="sexOptions" />
            <form-select
              label="会员等级"
              prop="level"
              v-model="searchForm.level"
              :options="levelOptions"
            />
          </el-row>
        </el-form>
      </template>
      <template #bottom>
        <el-button @click="showDialog('add')">添加用户</el-button>
      </template>
    </table-bar>

    <art-table :data="tableData">
      <template #default>
        <el-table-column
          label="用户名"
          prop="avatar"
          #default="scope"
          width="300px"
          v-if="columns[0].show"
        >
          <div class="user" style="display: flex; align-items: center">
            <img class="avatar" :src="scope.row.avatar" />
            <div>
              <p class="user-name">{{ scope.row.username }}</p>
              <p class="email">{{ scope.row.email }}</p>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile" v-if="columns[1].show" />
        <el-table-column label="性别" prop="sex" #default="scope" sortable v-if="columns[2].show">
          {{ scope.row.sex === 1 ? '男' : '女' }}
        </el-table-column>
        <el-table-column label="部门" prop="dep" v-if="columns[3].show" />
        <el-table-column
          label="状态"
          prop="status"
          :filters="[
            { text: '在线', value: '1' },
            { text: '离线', value: '2' },
            { text: '异常', value: '3' },
            { text: '注销', value: '4' }
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
          v-if="columns[4].show"
        >
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.status)">
              {{ buildTagText(scope.row.status) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="create_time" sortable v-if="columns[5].show" />
        <el-table-column fixed="right" label="操作" width="180px">
          <el-button link :icon="EditPen" type="primary" @click="showDialog('edit')">
            编辑
          </el-button>
          <el-button link :icon="Delete" style="color: #fa6962" @click="deleteUser">
            注销
          </el-button>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="30%"
    >
      <el-form :model="formData" label-width="60px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="formData.sex">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="dep">
          <el-select v-model="formData.dep">
            <el-option label="董事会部" :value="1" />
            <el-option label="市场部" :value="2" />
            <el-option label="技术部" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ACCOUNT_TABLE_DATA } from '@/mock/formData'
  import { EditPen, Delete } from '@element-plus/icons-vue'
  import { FormInstance } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'

  const dialogType = ref('add')
  const dialogVisible = ref(false)

  const formData = reactive({
    username: '',
    phone: '',
    sex: '',
    dep: ''
  })

  const sexOptions = [
    {
      value: '1',
      label: '男'
    },
    {
      value: '2',
      label: '女'
    }
  ]
  const levelOptions = [
    {
      value: '1',
      label: '普通用户'
    },
    {
      value: '2',
      label: ' VIP'
    }
  ]

  const columns = reactive([
    { name: '用户名', show: true },
    { name: '手机号', show: true },
    { name: '性别', show: true },
    { name: '部门', show: true },
    { name: '状态', show: true },
    { name: '创建日期', show: true }
  ])

  const searchFormRef = ref<FormInstance>()
  const searchForm = reactive({
    name: '',
    phone: '',
    email: '',
    account: '',
    id: '',
    sex: '',
    level: ''
  })

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  const tableData = ACCOUNT_TABLE_DATA

  const showDialog = (type: string) => {
    dialogVisible.value = true
    dialogType.value = type
  }

  const deleteUser = () => {
    ElMessageBox.confirm('确定要注销该用户吗？', '注销用户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      ElMessage.success('注销成功')
    })
  }

  const search = () => {}

  const changeColumn = (list: any) => {
    columns.values = list
  }

  const filterTag = (value: string, row: any) => {
    return row.status === value
  }

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
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;

    .user {
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
