<template>
  <div class="page-content">
    <ElForm>
      <ElRow :gutter="12">
        <ElCol :xs="24" :sm="12" :lg="6">
          <ElFormItem>
            <ElInput placeholder="请输入角色名称" v-model="form.roleName"></ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="12" :lg="6">
          <ElFormItem>
            <ElButton v-ripple>搜索</ElButton>
            <ElButton @click="showDialog('add')" v-ripple>新增角色</ElButton>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <ArtTable :data="roleList">
      <template #default>
        <ElTableColumn label="角色名称" prop="roleName" />
        <ElTableColumn label="角色编码" prop="roleCode" />
        <ElTableColumn label="描述" prop="des" />
        <ElTableColumn label="启用" prop="enable">
          <template #default="scope">
            <ElTag :type="scope.row.enable ? 'primary' : 'info'">
              {{ scope.row.enable ? '启用' : '禁用' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="创建时间" prop="date">
          <template #default="scope">
            {{ formatDate(scope.row.date) }}
          </template>
        </ElTableColumn>
        <ElTableColumn fixed="right" label="操作" width="100px">
          <template #default="scope">
            <ElRow>
              <!-- 可以在 list 中添加 auth 属性来控制按钮的权限, auth 属性值为权限标识 -->
              <ArtButtonMore
                :list="[
                  { key: 'permission', label: '菜单权限' },
                  { key: 'edit', label: '编辑角色' },
                  { key: 'delete', label: '删除角色' }
                ]"
                @click="buttonMoreClick($event, scope.row)"
              />
            </ElRow>
          </template>
        </ElTableColumn>
      </template>
    </ArtTable>

    <ElDialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      width="30%"
      align-center
    >
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
        <ElFormItem label="角色名称" prop="roleName">
          <ElInput v-model="form.roleName" />
        </ElFormItem>
        <ElFormItem label="角色编码" prop="roleCode">
          <ElInput v-model="form.roleCode" />
        </ElFormItem>
        <ElFormItem label="描述" prop="roleStatus">
          <ElInput v-model="form.des" type="textarea" :rows="3" />
        </ElFormItem>
        <ElFormItem label="启用">
          <ElSwitch v-model="form.enable" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="dialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="handleSubmit(formRef)">提交</ElButton>
        </div>
      </template>
    </ElDialog>

    <ElDialog
      v-model="permissionDialog"
      title="菜单权限"
      width="520px"
      align-center
      class="el-dialog-border"
    >
      <ElScrollbar height="70vh">
        <ElTree
          ref="treeRef"
          :data="processedMenuList"
          show-checkbox
          node-key="name"
          :default-expand-all="isExpandAll"
          :default-checked-keys="[1, 2, 3]"
          :props="defaultProps"
          @check="handleTreeCheck"
        >
          <template #default="{ data }">
            <div style="display: flex; align-items: center">
              <span v-if="data.isAuth">
                {{ data.label }}
              </span>
              <span v-else>{{ defaultProps.label(data) }}</span>
            </div>
          </template>
        </ElTree>
      </ElScrollbar>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="toggleExpandAll">{{ isExpandAll ? '全部收起' : '全部展开' }}</ElButton>
          <ElButton @click="toggleSelectAll" style="margin-left: 8px">{{
            isSelectAll ? '取消全选' : '全部选择'
          }}</ElButton>
          <ElButton type="primary" @click="savePermission">保存</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { useMenuStore } from '@/store/modules/menu'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { formatMenuTitle } from '@/router/utils/utils'
  import { Role, ROLE_LIST_DATA } from '@/mock/temp/formData'
  import { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue'

  defineOptions({ name: 'Role' })

  const dialogVisible = ref(false)
  const permissionDialog = ref(false)
  const { menuList } = storeToRefs(useMenuStore())
  const treeRef = ref()
  const isExpandAll = ref(true)
  const isSelectAll = ref(false)

  // 处理菜单数据，将 authList 转换为子节点
  const processedMenuList = computed(() => {
    const processNode = (node: any) => {
      const processed = { ...node }

      // 如果有 authList，将其转换为子节点
      if (node.meta && node.meta.authList && node.meta.authList.length) {
        const authNodes = node.meta.authList.map((auth: any) => ({
          id: `${node.id}_${auth.authMark}`,
          name: `${node.name}_${auth.authMark}`,
          label: auth.title,
          authMark: auth.authMark,
          isAuth: true,
          checked: auth.checked || false
        }))

        processed.children = processed.children ? [...processed.children, ...authNodes] : authNodes
      }

      // 递归处理子节点
      if (processed.children) {
        processed.children = processed.children.map(processNode)
      }

      return processed
    }

    return menuList.value.map(processNode)
  })

  const formRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    des: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
  })

  const form = reactive<Role>({
    roleName: '',
    roleCode: '',
    des: '',
    date: '',
    enable: true
  })

  const roleList = ref<Role[]>([])

  onMounted(() => {
    getTableData()
  })

  const getTableData = () => {
    roleList.value = ROLE_LIST_DATA
  }

  const dialogType = ref('add')

  const showDialog = (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      form.roleName = row.roleName
      form.roleCode = row.roleCode
      form.des = row.des
      form.date = row.date
      form.enable = row.enable
    } else {
      form.roleName = ''
      form.roleCode = ''
      form.des = ''
      form.date = ''
      form.enable = true
    }
  }

  const buttonMoreClick = (item: ButtonMoreItem, row: any) => {
    if (item.key === 'permission') {
      showPermissionDialog()
    } else if (item.key === 'edit') {
      showDialog('edit', row)
    } else if (item.key === 'delete') {
      deleteRole()
    }
  }

  const showPermissionDialog = () => {
    permissionDialog.value = true
  }

  const defaultProps = {
    children: 'children',
    label: (data: any) => formatMenuTitle(data.meta?.title) || ''
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

  const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate((valid) => {
      if (valid) {
        const message = dialogType.value === 'add' ? '新增成功' : '修改成功'
        ElMessage.success(message)
        dialogVisible.value = false
        formEl.resetFields()
      }
    })
  }

  const savePermission = () => {
    ElMessage.success('权限保存成功')
    permissionDialog.value = false
  }

  const toggleExpandAll = () => {
    const tree = treeRef.value
    if (!tree) return

    // 使用store.nodesMap直接控制所有节点的展开状态
    const nodes = tree.store.nodesMap
    for (const node in nodes) {
      nodes[node].expanded = !isExpandAll.value
    }

    isExpandAll.value = !isExpandAll.value
  }

  const toggleSelectAll = () => {
    const tree = treeRef.value
    if (!tree) return

    if (!isSelectAll.value) {
      // 全选：获取所有节点的key并设置为选中
      const allKeys = getAllNodeKeys(processedMenuList.value)
      tree.setCheckedKeys(allKeys)
    } else {
      // 取消全选：清空所有选中
      tree.setCheckedKeys([])
    }

    isSelectAll.value = !isSelectAll.value
  }

  const getAllNodeKeys = (nodes: any[]): string[] => {
    const keys: string[] = []
    const traverse = (nodeList: any[]) => {
      nodeList.forEach((node) => {
        if (node.name) {
          keys.push(node.name)
        }
        if (node.children && node.children.length > 0) {
          traverse(node.children)
        }
      })
    }
    traverse(nodes)
    return keys
  }

  const handleTreeCheck = () => {
    const tree = treeRef.value
    if (!tree) return

    // 使用树组件的getCheckedKeys方法获取选中的节点
    const checkedKeys = tree.getCheckedKeys()
    const allKeys = getAllNodeKeys(processedMenuList.value)

    // 判断是否全选：选中的节点数量等于总节点数量
    isSelectAll.value = checkedKeys.length === allKeys.length && allKeys.length > 0
  }

  const formatDate = (date: string) => {
    return new Date(date)
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      .replace(/\//g, '-')
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
