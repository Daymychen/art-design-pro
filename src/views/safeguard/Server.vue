<template>
  <div class="page-content">
    <table-bar :showTop="false" :columns="columns" @changeColumn="changeColumn">
      <template #top>
        <el-form label-width="55px">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :lg="6">
              <el-form-item label="名称：">
                <el-input placeholder="名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
              <el-form-item label="地址：">
                <el-input placeholder="地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template #bottom>
        <el-button @click="showDialog('add')" style="width: 100px">新增</el-button>
      </template>
    </table-bar>

    <art-table :data="serverList" :showPage="false" ref="table">
      <el-table-column v-if="columns[0].show" label="名称" prop="name" />
      <el-table-column v-if="columns[1].show" label="地址" prop="ip" />
      <el-table-column v-if="columns[2].show" label="用户名" prop="username" />
      <el-table-column v-if="columns[3].show" label="状态" prop="status">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
            {{ scope.row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[4].show" label="创建日期" prop="create_time" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button link :icon="EditPen" type="primary" @click="showDialog('edit')">
            编辑
          </el-button>
          <el-button link :icon="Delete" style="color: #fa6962" @click="deleteUser(scope)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </art-table>

    <el-dialog :title="dialogTitle" width="500px" v-model="dvEdit" top="30vh">
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="名称">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.mibile"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dvEdit = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { Delete, EditPen } from '@element-plus/icons-vue'

  const dvEdit = ref(false)

  const dialogTitle = ref('')
  const form = reactive({
    username: '',
    mibile: '',
    email: '',
    sex: 1,
    dep: '',
    status: true
  })
  const serverList = reactive([
    {
      name: 'blog',
      ip: '43.133.133.133',
      username: 'SuperMan',
      account: 'root',
      status: 1,
      create_time: '2021-1-5'
    }
  ])
  const columns = reactive([
    { name: '名称', show: true },
    { name: '地址', show: true },
    { name: '用户名', show: true },
    { name: '状态', show: true },
    { name: '创建日期', show: true }
  ])

  const showDialog = (type: string) => {
    dvEdit.value = true
    dialogTitle.value = type === 'add' ? '新增' : '编辑'
  }
  const onSubmit = () => {
    dvEdit.value = false
  }
  const deleteUser = (scope: unknown) => {
    console.log(scope)
  }
  const changeColumn = (columns: any) => {
    columns.value = columns
  }
</script>

<style lang="scss" scoped></style>
