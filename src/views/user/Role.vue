<template>
  <div class="page-content">
    <el-row>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-input placeholder="部门名称"></el-input>
      </el-col>
      <div style="width: 12px"></div>
      <el-col :xs="24" :sm="12" :lg="6" class="el-col2">
        <el-button>搜索</el-button>
        <el-button @click="showDialog('add')">新增角色</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData">
      <template #default>
        <el-table-column label="角色名称" prop="name" />
        <el-table-column label="描述" prop="des" />
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'primary' : 'info'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="date" />
        <el-table-column fixed="right" label="操作">
          <el-button link :icon="View" type="primary" @click="showPermissionDialog()">
            菜单权限
          </el-button>
          <el-button link :icon="EditPen" type="primary" @click="showDialog('edit')">
            编辑
          </el-button>
          <el-button link :icon="Delete" style="color: #fa6962" @click="deleteRole">
            删除
          </el-button>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      width="30%"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.des" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="permissionDialog" title="菜单权限" width="30%">
      <div :style="{ maxHeight: '500px', overflowY: 'scroll' }">
        <el-tree
          :data="menuList"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[1, 2, 3, 4, 5, 6, 7, 8]"
          :default-checked-keys="[1, 2, 3]"
          :props="defaultProps"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { useMenuStore } from '@/store/modules/menu'
  import { Delete, EditPen, View } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const dialogVisible = ref(false)
  const permissionDialog = ref(false)
  const menuList = computed(() => useMenuStore().getMenuList)

  const form = reactive({
    name: '',
    des: '',
    status: true
  })

  const tableData = reactive([
    {
      name: '超级管理员',
      allow: '全部权限',
      des: '拥有系统全部权限',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '董事会部',
      allow: '自定义',
      des: '负责董事会部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '监事会部',
      allow: '自定义',
      des: '负责监事会部相关工作的管理者',
      date: '2021-01-08',
      status: 0
    },
    {
      name: '市场部',
      allow: '自定义',
      des: '负责市场部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '人力资源部',
      allow: '自定义',
      des: '负责人力资源部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '财务部',
      allow: '自定义',
      des: '负责财务部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '公关部',
      allow: '自定义',
      des: '负责公关部相关工作的管理者',
      date: '2021-01-08',
      status: 0
    },
    {
      name: '广告部',
      allow: '自定义',
      des: '负责广告部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '营销',
      allow: '自定义',
      des: '负责营销相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '设计部',
      allow: '自定义',
      des: '负责设计部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '开发部',
      allow: '自定义',
      des: '负责开发部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '测试部',
      allow: '自定义',
      des: '负责测试部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    },
    {
      name: '安保部',
      allow: '自定义',
      des: '负责安保部相关工作的管理者',
      date: '2021-01-08',
      status: 1
    }
  ])

  const dialogType = ref('add')

  const showDialog = (type: string) => {
    dialogVisible.value = true
    dialogType.value = type
  }

  const showPermissionDialog = () => {
    permissionDialog.value = true
  }

  const defaultProps = {
    children: 'children',
    label: 'title'
  }

  const deleteRole = () => {
    ElMessageBox.confirm('确定删除该角色吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      ElMessage.success('删除成功')
    })
  }
</script>

<style lang="scss" scoped>
  .page-content {
    .svg-icon {
      width: 1.8em;
      height: 1.8em;
      overflow: hidden;
      vertical-align: -8px;
      fill: currentcolor;
    }
  }
</style>
