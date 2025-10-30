<template>
  <ElDialog
    :title="dialogTitle"
    :model-value="visible"
    @update:model-value="handleCancel"
    width="800px"
    align-center
    class="menu-dialog"
    @closed="handleClosed"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="85px">
      <ElFormItem label="菜单类型">
        <ElRadioGroup v-model="menuType" :disabled="disableMenuType">
          <ElRadioButton value="menu" label="menu">菜单</ElRadioButton>
          <ElRadioButton value="button" label="button">按钮</ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>

      <!-- 菜单表单 -->
      <template v-if="menuType === 'menu'">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="菜单名称" prop="name">
              <ElInput v-model="form.name" placeholder="菜单名称" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="路由地址" prop="path">
              <ElInput v-model="form.path" placeholder="路由地址" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="权限标识" prop="label">
              <ElInput v-model="form.label" placeholder="权限标识" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="组件路径" prop="component">
              <ElInput v-model="form.component" placeholder="组件路径" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="图标" prop="icon">
              <ElInput v-model="form.icon" placeholder="图标名称" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <!-- 注意：角色权限仅用于前端权限模式，结合获取用户信息接口通过角色控制菜单 -->
            <ElFormItem label="角色权限" prop="roles">
              <ElInputTag
                v-model="form.roles"
                placeholder="输入角色权限后按回车添加"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="菜单排序" prop="sort">
              <ElInputNumber
                v-model="form.sort"
                style="width: 100%"
                :min="1"
                controls-position="right"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="外部链接" prop="link">
              <ElInput v-model="form.link" placeholder="外部链接/内嵌地址(https://www.baidu.com)" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="文本徽章" prop="showTextBadge">
              <ElInput v-model="form.showTextBadge" placeholder="文本徽章内容" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="激活路径" prop="activePath">
              <ElInput v-model="form.activePath" placeholder="详情页激活选中的菜单路径" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem label="是否启用" prop="isEnable">
              <ElSwitch v-model="form.isEnable" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="页面缓存" prop="keepAlive">
              <ElSwitch v-model="form.keepAlive" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="隐藏菜单" prop="isHide">
              <ElSwitch v-model="form.isHide" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="是否内嵌" prop="isIframe">
              <ElSwitch v-model="form.isIframe" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="显示徽章" prop="showBadge">
              <ElSwitch v-model="form.showBadge" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="固定标签" prop="fixedTab">
              <ElSwitch v-model="form.fixedTab" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="标签隐藏" prop="isHideTab">
              <ElSwitch v-model="form.isHideTab" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="全屏页面" prop="isFullPage">
              <ElSwitch v-model="form.isFullPage" />
            </ElFormItem>
          </ElCol>
        </ElRow>
      </template>

      <!-- 权限表单 -->
      <template v-if="menuType === 'button'">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="权限名称" prop="authName">
              <ElInput v-model="form.authName" placeholder="权限名称" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="权限标识" prop="authLabel">
              <ElInput v-model="form.authLabel" placeholder="权限标识" />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="权限排序" prop="authSort">
              <ElInputNumber
                v-model="form.authSort"
                style="width: 100%"
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
        <ElButton @click="handleCancel">取 消</ElButton>
        <ElButton type="primary" @click="handleSubmit">确 定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { formatMenuTitle } from '@/router/utils/utils'
  import type { AppRouteRecord } from '@/types/router'

  interface MenuFormData {
    id: number
    name: string
    path: string
    label: string
    component: string
    icon: string
    isEnable: boolean
    sort: number
    isMenu: boolean
    keepAlive: boolean
    isHide: boolean
    isHideTab: boolean
    link: string
    isIframe: boolean
    showBadge: boolean
    showTextBadge: string
    fixedTab: boolean
    activePath: string
    roles: string[]
    isFullPage: boolean
    authName: string
    authLabel: string
    authIcon: string
    authSort: number
  }

  interface Props {
    visible: boolean
    editData?: AppRouteRecord | any
    type?: 'menu' | 'button'
    lockType?: boolean
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', data: MenuFormData): void
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    type: 'menu',
    lockType: false
  })

  const emit = defineEmits<Emits>()

  const formRef = ref<FormInstance>()
  const menuType = ref<'menu' | 'button'>('menu')
  const isEdit = ref(false)

  const form = reactive<MenuFormData>({
    id: 0,
    name: '',
    path: '',
    label: '',
    component: '',
    icon: '',
    isEnable: true,
    sort: 1,
    isMenu: true,
    keepAlive: true,
    isHide: false,
    isHideTab: false,
    link: '',
    isIframe: false,
    showBadge: false,
    showTextBadge: '',
    fixedTab: false,
    activePath: '',
    roles: [],
    isFullPage: false,
    authName: '',
    authLabel: '',
    authIcon: '',
    authSort: 1
  })

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
    label: [{ required: true, message: '输入权限标识', trigger: 'blur' }],
    component: [{ required: false, message: '请输入组件路径', trigger: 'blur' }],
    authName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    authLabel: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
  })

  const dialogTitle = computed(() => {
    const type = menuType.value === 'menu' ? '菜单' : '按钮'
    return isEdit.value ? `编辑${type}` : `新建${type}`
  })

  /**
   * 是否禁用菜单类型切换
   */
  const disableMenuType = computed(() => {
    if (isEdit.value) return true
    if (!isEdit.value && menuType.value === 'menu' && props.lockType) return true
    return false
  })

  /**
   * 重置表单数据
   */
  const resetForm = (): void => {
    formRef.value?.resetFields()
    Object.assign(form, {
      id: 0,
      name: '',
      path: '',
      label: '',
      component: '',
      icon: '',
      isEnable: true,
      sort: 1,
      isMenu: true,
      keepAlive: true,
      isHide: false,
      isHideTab: false,
      link: '',
      isIframe: false,
      showBadge: false,
      showTextBadge: '',
      fixedTab: false,
      activePath: '',
      roles: [],
      isFullPage: false,
      authName: '',
      authLabel: '',
      authIcon: '',
      authSort: 1
    })
  }

  /**
   * 加载表单数据（编辑模式）
   */
  const loadFormData = (): void => {
    if (!props.editData) return

    isEdit.value = true

    if (menuType.value === 'menu') {
      const row = props.editData
      form.id = row.id || 0
      form.name = formatMenuTitle(row.meta?.title || '')
      form.path = row.path || ''
      form.label = row.name || ''
      form.component = row.component || ''
      form.icon = row.meta?.icon || ''
      form.sort = row.meta?.sort || 1
      form.isMenu = row.meta?.isMenu ?? true
      form.keepAlive = row.meta?.keepAlive ?? false
      form.isHide = row.meta?.isHide ?? false
      form.isHideTab = row.meta?.isHideTab ?? false
      form.isEnable = row.meta?.isEnable ?? true
      form.link = row.meta?.link || ''
      form.isIframe = row.meta?.isIframe ?? false
      form.showBadge = row.meta?.showBadge ?? false
      form.showTextBadge = row.meta?.showTextBadge || ''
      form.fixedTab = row.meta?.fixedTab ?? false
      form.activePath = row.meta?.activePath || ''
      form.roles = row.meta?.roles || []
      form.isFullPage = row.meta?.isFullPage ?? false
    } else {
      const row = props.editData
      form.authName = row.title || ''
      form.authLabel = row.authMark || ''
      form.authIcon = row.icon || ''
      form.authSort = row.sort || 1
    }
  }

  /**
   * 提交表单
   */
  const handleSubmit = async (): Promise<void> => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          emit('submit', { ...form })
          ElMessage.success(`${isEdit.value ? '编辑' : '新增'}成功`)
          handleCancel()
        } catch {
          ElMessage.error(`${isEdit.value ? '编辑' : '新增'}失败`)
        }
      }
    })
  }

  /**
   * 取消操作
   */
  const handleCancel = (): void => {
    emit('update:visible', false)
  }

  /**
   * 对话框关闭后的回调
   */
  const handleClosed = (): void => {
    resetForm()
    isEdit.value = false
  }

  /**
   * 监听对话框显示状态
   */
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        menuType.value = props.type
        nextTick(() => {
          if (props.editData) {
            loadFormData()
          }
        })
      }
    }
  )

  /**
   * 监听菜单类型变化
   */
  watch(
    () => props.type,
    (newType) => {
      if (props.visible) {
        menuType.value = newType
      }
    }
  )
</script>
