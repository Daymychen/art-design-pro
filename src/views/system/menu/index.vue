<template>
  <ArtTableFullScreen>
    <div class="menu-page" id="table-full-screen">
      <!-- 搜索栏 -->
      <ArtSearchBar
        v-model:filter="formFilters"
        :items="formItems"
        :showExpand="false"
        @reset="handleReset"
        @search="handleSearch"
      ></ArtSearchBar>

      <ElCard shadow="never" class="art-table-card">
        <!-- 表格头部 -->
        <ArtTableHeader :showZebra="false" v-model:columns="columnChecks" @refresh="handleRefresh">
          <template #left>
            <!-- 按钮权限：后端控制模式，使用自定义指令 -->
            <ElButton v-auth="'add'" @click="showModel('menu', null, true)" v-ripple>
              添加菜单
            </ElButton>
            <ElButton @click="toggleExpand" v-ripple>
              {{ isExpanded ? '收起' : '展开' }}
            </ElButton>
            <!-- 按钮权限：前端控制模式，使用 hasAuth 方法 -->
            <ElButton v-if="hasAuth('add')" @click="showModel('menu', null, true)" v-ripple>
              添加菜单
            </ElButton>
          </template>
        </ArtTableHeader>
        <!-- 表格 -->
        <ArtTable
          rowKey="path"
          ref="tableRef"
          :loading="loading"
          :data="filteredTableData"
          :marginTop="10"
          :stripe="false"
        >
          <template #default>
            <ElTableColumn v-for="col in columns" :key="col.prop || col.type" v-bind="col" />
          </template>
        </ArtTable>

        <ElDialog :title="dialogTitle" v-model="dialogVisible" width="700px" align-center>
          <ElForm ref="formRef" :model="form" :rules="rules" label-width="85px">
            <ElFormItem label="菜单类型">
              <ElRadioGroup v-model="labelPosition" :disabled="disableMenuType">
                <ElRadioButton value="menu" label="menu">菜单</ElRadioButton>
                <ElRadioButton value="button" label="button">权限</ElRadioButton>
              </ElRadioGroup>
            </ElFormItem>

            <template v-if="labelPosition === 'menu'">
              <ElRow :gutter="20">
                <ElCol :span="12">
                  <ElFormItem label="菜单名称" prop="name">
                    <ElInput v-model="form.name" placeholder="菜单名称"></ElInput>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="12">
                  <ElFormItem label="路由地址" prop="path">
                    <ElInput v-model="form.path" placeholder="路由地址"></ElInput>
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElRow :gutter="20">
                <ElCol :span="12">
                  <ElFormItem label="权限标识" prop="label">
                    <ElInput v-model="form.label" placeholder="权限标识"></ElInput>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="12">
                  <ElFormItem label="图标" prop="icon">
                    <ArtIconSelector v-model="form.icon" :iconType="iconType" width="100%" />
                  </ElFormItem>
                </ElCol>
              </ElRow>

              <ElRow :gutter="20">
                <ElCol :span="12">
                  <ElFormItem label="菜单排序" prop="sort" style="width: 100%">
                    <ElInputNumber
                      v-model="form.sort"
                      style="width: 100%"
                      @change="handleChange"
                      :min="1"
                      controls-position="right"
                    />
                  </ElFormItem>
                </ElCol>
                <ElCol :span="12">
                  <ElFormItem label="外部链接" prop="link">
                    <ElInput
                      v-model="form.link"
                      placeholder="外部链接/内嵌地址(https://www.baidu.com)"
                    ></ElInput>
                  </ElFormItem>
                </ElCol>
              </ElRow>

              <ElRow :gutter="20">
                <ElCol :span="5">
                  <ElFormItem label="是否启用" prop="isEnable">
                    <ElSwitch v-model="form.isEnable"></ElSwitch>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="5">
                  <ElFormItem label="页面缓存" prop="keepAlive">
                    <ElSwitch v-model="form.keepAlive"></ElSwitch>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="5">
                  <ElFormItem label="是否显示" prop="isHidden">
                    <ElSwitch v-model="form.isHidden"></ElSwitch>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="5">
                  <ElFormItem label="是否内嵌" prop="isMenu">
                    <ElSwitch v-model="form.isIframe"></ElSwitch>
                  </ElFormItem>
                </ElCol>
              </ElRow>
            </template>

            <template v-if="labelPosition === 'button'">
              <ElRow :gutter="20">
                <ElCol :span="12">
                  <ElFormItem label="权限名称" prop="authName">
                    <ElInput v-model="form.authName" placeholder="权限名称"></ElInput>
                  </ElFormItem>
                </ElCol>
                <ElCol :span="12">
                  <ElFormItem label="权限标识" prop="authLabel">
                    <ElInput v-model="form.authLabel" placeholder="权限标识"></ElInput>
                  </ElFormItem>
                </ElCol>
              </ElRow>
              <ElRow :gutter="20">
                <ElCol :span="12">
                  <ElFormItem label="权限排序" prop="authSort" style="width: 100%">
                    <ElInputNumber
                      v-model="form.authSort"
                      style="width: 100%"
                      @change="handleChange"
                      :min="1"
                      controls-position="right"
                    />
                  </ElFormItem>
                </ElCol>
              </ElRow>
            </template>
          </ElForm>

          <template #footer>
            <span class="dialog-footer">
              <ElButton @click="dialogVisible = false">取 消</ElButton>
              <ElButton type="primary" @click="submitForm()">确 定</ElButton>
            </span>
          </template>
        </ElDialog>
      </ElCard>
    </div>
  </ArtTableFullScreen>
</template>

<script setup lang="ts">
  import { useMenuStore } from '@/store/modules/menu'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { IconTypeEnum } from '@/enums/appEnum'
  import { formatMenuTitle } from '@/router/utils/utils'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useCheckedColumns } from '@/composables/useCheckedColumns'
  import { ElPopover, ElButton } from 'element-plus'
  import { AppRouteRecord } from '@/types/router'
  import { useAuth } from '@/composables/useAuth'
  import { SearchFormItem } from '@/types'

  defineOptions({ name: 'Menus' })

  const { hasAuth } = useAuth()

  const { menuList } = storeToRefs(useMenuStore())

  const loading = ref(false)

  // 定义表单搜索初始值
  const initialSearchState = {
    name: '',
    route: ''
  }

  // 响应式表单数据
  const formFilters = reactive({ ...initialSearchState })

  // 增加实际应用的搜索条件状态
  const appliedFilters = reactive({ ...initialSearchState })

  // 重置表单
  const handleReset = () => {
    Object.assign(formFilters, { ...initialSearchState })
    Object.assign(appliedFilters, { ...initialSearchState })
    getTableData()
  }

  // 搜索处理
  const handleSearch = () => {
    // 将当前输入的筛选条件应用到实际搜索
    Object.assign(appliedFilters, { ...formFilters })
    getTableData()
  }

  // 表单配置项
  const formItems: SearchFormItem[] = [
    {
      label: '菜单名称',
      prop: 'name',
      type: 'input',
      config: {
        clearable: true
      }
    },
    {
      label: '路由地址',
      prop: 'route',
      type: 'input',
      config: {
        clearable: true
      }
    }
  ]

  // 构建菜单类型标签
  const buildMenuTypeTag = (row: AppRouteRecord) => {
    if (row.children && row.children.length > 0) {
      return 'info'
    } else if (row.meta?.link && row.meta?.isIframe) {
      return 'success'
    } else if (row.path) {
      return 'primary'
    } else if (row.meta?.link) {
      return 'warning'
    }
  }

  // 构建菜单类型文本
  const buildMenuTypeText = (row: AppRouteRecord) => {
    if (row.children && row.children.length > 0) {
      return '目录'
    } else if (row.meta?.link && row.meta?.isIframe) {
      return '内嵌'
    } else if (row.path) {
      return '菜单'
    } else if (row.meta?.link) {
      return '外链'
    }
  }

  // 动态列配置
  const { columnChecks, columns } = useCheckedColumns(() => [
    {
      prop: 'meta.title',
      label: '菜单名称',
      minWidth: 120,
      formatter: (row: AppRouteRecord) => {
        return formatMenuTitle(row.meta?.title)
      }
    },
    {
      prop: 'type',
      label: '菜单类型',
      formatter: (row: AppRouteRecord) => {
        return h(ElTag, { type: buildMenuTypeTag(row) }, () => buildMenuTypeText(row))
      }
    },
    {
      prop: 'path',
      label: '路由',
      formatter: (row: AppRouteRecord) => {
        return row.meta?.link || row.path || ''
      }
    },
    {
      prop: 'meta.authList',
      label: '可操作权限',
      formatter: (row: AppRouteRecord) => {
        return h(
          'div',
          {},
          row.meta.authList?.map((item: { title: string; auth_mark: string }, index: number) => {
            return h(
              ElPopover,
              {
                placement: 'top-start',
                title: '操作',
                width: 200,
                trigger: 'click',
                key: index
              },
              {
                default: () =>
                  h('div', { style: 'margin: 0; text-align: right' }, [
                    h(
                      ElButton,
                      {
                        size: 'small',
                        type: 'primary',
                        onClick: () => showModel('button', item)
                      },
                      { default: () => '编辑' }
                    ),
                    h(
                      ElButton,
                      {
                        size: 'small',
                        type: 'danger',
                        onClick: () => deleteAuth()
                      },
                      { default: () => '删除' }
                    )
                  ]),
                reference: () => h(ElButton, { class: 'small-btn' }, { default: () => item.title })
              }
            )
          })
        )
      }
    },
    {
      prop: 'date',
      label: '编辑时间',
      formatter: () => '2022-3-12 12:00:00'
    },
    {
      prop: 'status',
      label: '隐藏菜单',
      formatter: (row) => {
        return h(ElTag, { type: row.meta.isHide ? 'danger' : 'info' }, () =>
          row.meta.isHide ? '是' : '否'
        )
      }
    },
    {
      prop: 'operation',
      label: '操作',
      width: 180,
      formatter: (row: AppRouteRecord) => {
        return h('div', [
          // 这里写两组权限标识判断是为了方便演示，在实际开发中可以删除其中一组
          // 前端模式权限标识
          hasAuth('B_CODE1') &&
            h(ArtButtonTable, {
              type: 'add',
              onClick: () => showModel('menu')
            }),
          hasAuth('B_CODE2') &&
            h(ArtButtonTable, {
              type: 'edit',
              onClick: () => showDialog('edit', row)
            }),
          hasAuth('B_CODE3') &&
            h(ArtButtonTable, {
              type: 'delete',
              onClick: () => deleteMenu()
            }),
          // 后端模式权限标识
          hasAuth('add') &&
            h(ArtButtonTable, {
              type: 'add',
              onClick: () => showModel('menu')
            }),
          hasAuth('edit') &&
            h(ArtButtonTable, {
              type: 'edit',
              onClick: () => showDialog('edit', row)
            }),
          hasAuth('delete') &&
            h(ArtButtonTable, {
              type: 'delete',
              onClick: () => deleteMenu()
            })
        ])
      }
    }
  ])

  const handleRefresh = () => {
    getTableData()
  }

  const dialogVisible = ref(false)
  const form = reactive({
    // 菜单
    name: '',
    path: '',
    label: '',
    icon: '',
    isEnable: true,
    sort: 1,
    isMenu: true,
    keepAlive: true,
    isHidden: true,
    link: '',
    isIframe: false,
    // 权限 (修改这部分)
    authName: '',
    authLabel: '',
    authIcon: '',
    authSort: 1
  })
  const iconType = ref(IconTypeEnum.UNICODE)

  const labelPosition = ref('menu')
  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
    label: [{ required: true, message: '输入权限标识', trigger: 'blur' }],
    // 修改这部分
    authName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    authLabel: [{ required: true, message: '请输入权限权限标识', trigger: 'blur' }]
  })

  const tableData = ref<AppRouteRecord[]>([])

  onMounted(() => {
    getTableData()
  })

  const getTableData = () => {
    loading.value = true
    setTimeout(() => {
      tableData.value = menuList.value
      loading.value = false
    }, 500)
  }

  // 过滤后的表格数据
  const filteredTableData = computed(() => {
    // 递归搜索函数
    const searchMenu = (items: AppRouteRecord[]): AppRouteRecord[] => {
      return items.filter((item) => {
        // 获取搜索关键词，转换为小写并去除首尾空格
        const searchName = appliedFilters.name?.toLowerCase().trim() || ''
        const searchRoute = appliedFilters.route?.toLowerCase().trim() || ''

        // 获取菜单标题和路径，确保它们存在
        const menuTitle = formatMenuTitle(item.meta?.title || '').toLowerCase()
        const menuPath = (item.path || '').toLowerCase()

        // 使用 includes 进行模糊匹配
        const nameMatch = !searchName || menuTitle.includes(searchName)
        const routeMatch = !searchRoute || menuPath.includes(searchRoute)

        // 如果有子菜单，递归搜索
        if (item.children && item.children.length > 0) {
          const matchedChildren = searchMenu(item.children)
          // 如果子菜单有匹配项，保留当前菜单
          if (matchedChildren.length > 0) {
            item.children = matchedChildren
            return true
          }
        }

        return nameMatch && routeMatch
      })
    }

    return searchMenu(tableData.value)
  })

  const isEdit = ref(false)
  const formRef = ref<FormInstance>()
  const dialogTitle = computed(() => {
    const type = labelPosition.value === 'menu' ? '菜单' : '权限'
    return isEdit.value ? `编辑${type}` : `新建${type}`
  })

  const showDialog = (type: string, row: AppRouteRecord) => {
    showModel('menu', row, true)
  }

  const handleChange = () => {}

  const submitForm = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          // const menuStore = useMenuStore()
          // const params =
          //   labelPosition.value === 'menu'
          //     ? {
          //         title: form.name,
          //         path: form.path,
          //         name: form.label,
          //         icon: form.icon,
          //         sort: form.sort,
          //         isEnable: form.isEnable,
          //         isMenu: form.isMenu,
          //         keepAlive: form.keepAlive,
          //         isHidden: form.isHidden,
          //         link: form.link
          //       }
          //     : {
          //         title: form.authName,
          //         name: form.authLabel,
          //         icon: form.authIcon,
          //         sort: form.authSort
          //       }

          if (isEdit.value) {
            // await menuStore.updateMenu(params)
          } else {
            // await menuStore.addMenu(params)
          }

          ElMessage.success(`${isEdit.value ? '编辑' : '新增'}成功`)
          dialogVisible.value = false
        } catch {
          ElMessage.error(`${isEdit.value ? '编辑' : '新增'}失败`)
        }
      }
    })
  }

  const showModel = (type: string, row?: any, lock: boolean = false) => {
    dialogVisible.value = true
    labelPosition.value = type
    isEdit.value = false
    lockMenuType.value = lock
    resetForm()

    if (row) {
      isEdit.value = true
      nextTick(() => {
        // 回显数据
        if (type === 'menu') {
          // 菜单数据回显
          form.name = formatMenuTitle(row.meta.title)
          form.path = row.path
          form.label = row.name
          form.icon = row.meta.icon
          form.sort = row.meta.sort || 1
          form.isMenu = row.meta.isMenu
          form.keepAlive = row.meta.keepAlive
          form.isHidden = row.meta.isHidden || true
          form.isEnable = row.meta.isEnable || true
          form.link = row.meta.link
          form.isIframe = row.meta.isIframe || false
        } else {
          // 权限按钮数据回显
          form.authName = row.title
          form.authLabel = row.auth_mark
          form.authIcon = row.icon || ''
          form.authSort = row.sort || 1
        }
      })
    }
  }

  const resetForm = () => {
    formRef.value?.resetFields()
    Object.assign(form, {
      // 菜单
      name: '',
      path: '',
      label: '',
      icon: '',
      sort: 1,
      isMenu: true,
      keepAlive: true,
      isHidden: true,
      link: '',
      isIframe: false,
      // 权限
      authName: '',
      authLabel: '',
      authIcon: '',
      authSort: 1
    })
  }

  const deleteMenu = async () => {
    try {
      await ElMessageBox.confirm('确定要删除该菜单吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      ElMessage.success('删除成功')
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败')
      }
    }
  }

  const deleteAuth = async () => {
    try {
      await ElMessageBox.confirm('确定要删除该权限吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      ElMessage.success('删除成功')
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败')
      }
    }
  }

  // 修改计算属性，增加锁定控制参数
  const disableMenuType = computed(() => {
    // 编辑权限时锁定为权限类型
    if (isEdit.value && labelPosition.value === 'button') return true
    // 编辑菜单时锁定为菜单类型
    if (isEdit.value && labelPosition.value === 'menu') return true
    // 顶部添加菜单按钮时锁定为菜单类型
    if (!isEdit.value && labelPosition.value === 'menu' && lockMenuType.value) return true
    return false
  })

  // 添加一个控制变量
  const lockMenuType = ref(false)

  const isExpanded = ref(false)
  const tableRef = ref()

  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
    nextTick(() => {
      if (tableRef.value) {
        tableRef.value[isExpanded.value ? 'expandAll' : 'collapseAll']()
      }
    })
  }
</script>

<style lang="scss" scoped>
  .menu-page {
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
