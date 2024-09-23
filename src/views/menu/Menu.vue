<template>
  <div class="page-content">
    <el-row :gutter="20" style="margin-left: 25px">
      <el-button v-auth="'add'" @click="showModel('menu')">添加菜单</el-button>
    </el-row>

    <art-table :data="tableData">
      <template #default>
        <el-table-column prop="title" label="菜单名称" />
        <el-table-column prop="path" label="路由" />

        <el-table-column prop="permission" label="可操作权限">
          <template #default="scope">
            <el-popover
              placement="top-start"
              title="操作"
              :width="200"
              trigger="click"
              v-for="(item, index) in scope.row.authList"
              :key="index"
            >
              <div style="margin: 0; text-align: right">
                <el-button size="small" type="primary" @click="showModel('button')">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteMenu(item)">删除</el-button>
              </div>
              <template #reference>
                <el-button class="small-btn">{{ item.title }}</el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="编辑时间" prop="date"> 2022-3-12 12:00:00 </el-table-column>

        <el-table-column fixed="right" label="操作">
          <el-button
            link
            :icon="EditPen"
            type="primary"
            @click="showDialog('edit')"
            v-auth="'edit'"
          >
            编辑
          </el-button>
          <el-button link :icon="Delete" style="color: #fa6962" v-auth="'delete'"> 删除 </el-button>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog title="新建菜单" v-model="dialogVisible" width="700px" align-center>
      <el-form :model="form" :rules="rules" label-width="85px">
        <el-form-item label="菜单类型">
          <el-radio-group v-model="labelPosition">
            <el-radio-button value="menu" label="menu">菜单</el-radio-button>
            <el-radio-button value="button" label="button">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <template v-if="labelPosition === 'menu'">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="路由地址" prop="path">
                <el-input v-model="form.path"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="权限标识" prop="label">
                <el-input v-model="form.label"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图标" prop="icon">
                <el-input v-model="form.icon"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单排序" prop="sort" style="width: 100%">
                <el-input-number
                  v-model="form.sort"
                  style="width: 100%"
                  @change="handleChange"
                  :min="1"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="菜单" prop="isMenu">
                <el-switch v-model="form.isMenu"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="页面缓存" prop="keepAlive">
                <el-switch v-model="form.keepAlive"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="菜单可见" prop="showMenu">
                <el-switch v-model="form.showMenu"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="labelPosition === 'button'">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="按钮名称" prop="btnName">
                <el-input v-model="form.btnName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="权限标识" prop="btnLabel">
                <el-input v-model="form.btnLabel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="图标" prop="btnIcon">
                <el-input v-model="form.btnIcon"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="按钮排序" prop="btnSort" style="width: 100%">
                <el-input-number
                  v-model="form.btnSort"
                  style="width: 100%"
                  @change="handleChange"
                  :min="1"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm()"> 确 定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { Delete, EditPen } from '@element-plus/icons-vue'
  import { useMenuStore } from '@/store/modules/menu'

  const menuList = computed(() => useMenuStore().getMenuList)

  const dialogVisible = ref(false)
  const form = reactive({
    // 菜单
    name: '',
    path: '',
    label: '',
    icon: '',
    sort: 1,
    isMenu: true,
    keepAlive: true,
    showMenu: true,
    // 按钮
    btnName: '',
    btnLabel: '',
    btnIcon: '',
    btnSort: 1
  })

  const labelPosition = ref('menu')
  const rules = reactive({
    name: [
      // { required: true, message: '请输入活动名称', trigger: 'blur' },
      // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ]
  })

  const tableData = menuList.value

  const showDialog = (type: string) => {
    console.log(type)
  }

  const handleChange = () => {}

  const submitForm = () => {
    // this.$refs[formName].validate((valid) => {
    //   if (valid) {
    //     alert('submit!');
    //   } else {
    //     return false;
    //   }
    // });
  }

  const showModel = (type: string) => {
    dialogVisible.value = true
    labelPosition.value = type
  }

  const deleteMenu = (item: unknown) => {
    console.log(item)
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

    :deep(.small-btn) {
      height: 30px !important;
      padding: 0 10px !important;
      font-size: 12px !important;
    }
  }
</style>
