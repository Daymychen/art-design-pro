<template>
  <div class="page-content">
    <h3 class="page-title">标签页操作</h3>

    <!-- 修改标签标题模块 -->
    <ElCard class="module-card" header="修改标签标题" shadow="never">
      <div style="display: flex; gap: 10px">
        <ElInput
          v-model="newTabTitle"
          placeholder="请输入新的标签页标题"
          clearable
          style="width: 300px"
        />

        <ElButton type="primary" @click="handleUpdateTabTitle" :disabled="!newTabTitle.trim()">
          修改
        </ElButton>
        <ElButton @click="handleResetTabTitle"> 重置 </ElButton>
      </div>
    </ElCard>

    <!-- 获取标签页模块 -->
    <ElCard class="module-card" header="获取标签页信息" shadow="never">
      <div class="mb-4">
        <p class="tab-info">当前标签页信息：{{ currentTab }}</p>
      </div>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElButton type="success" plain @click="handleGetCurrentTabTitle(routePath)">
            获取当前标签页信息
          </ElButton>
        </ElCol>
      </ElRow>
    </ElCard>

    <!-- 关闭标签页模块 -->
    <ElCard class="module-card" header="关闭标签页" shadow="never">
      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElButton type="danger" plain @click="handleCloseTab(routePath)"> 关闭当前标签 </ElButton>
          <ElButton type="warning" plain @click="handleCloseOthersTab(routePath)">
            关闭其他标签
          </ElButton>
          <ElButton type="danger" plain @click="handleCloseAllTab"> 关闭所有标签 </ElButton>
        </ElCol>
      </ElRow>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { useWorktabStore } from '@/store/modules/worktab'
  import { WorkTab } from '@/types'
  import { ElMessage } from 'element-plus'
  const worktabStore = useWorktabStore()
  const currentTab = ref<WorkTab | null>(null)
  const newTabTitle = ref('')
  const routePath = '/examples/tabs'

  /**
   * 处理更新标签页标题
   * 验证输入内容后调用store方法更新标题
   */
  const handleUpdateTabTitle = () => {
    if (newTabTitle.value.trim()) {
      worktabStore.updateTabTitle(routePath, newTabTitle.value.trim())
    }
  }

  /**
   * 处理重置标签页标题
   * 将标题重置为默认值并清空输入框
   */
  const handleResetTabTitle = () => {
    worktabStore.resetTabTitle(routePath)
    newTabTitle.value = ''
  }

  /**
   * 获取指定路径的标签页信息
   * @param path - 标签页路径
   */
  const handleGetCurrentTabTitle = (path: string) => {
    const tab = worktabStore.getTabTitle(path)
    if (tab) {
      currentTab.value = tab
    } else {
      ElMessage.warning('未找到标签信息')
    }
  }

  /**
   * 关闭指定路径的标签页
   * @param path - 要关闭的标签页路径
   */
  const handleCloseTab = (path: string) => {
    worktabStore.removeTab(path)
  }

  /**
   * 关闭除指定路径外的其他所有标签页
   * @param path - 要保留的标签页路径
   */
  const handleCloseOthersTab = (path: string) => {
    worktabStore.removeOthers(path)
  }

  /**
   * 关闭所有标签页
   */
  const handleCloseAllTab = () => {
    worktabStore.removeAll()
  }
</script>

<style lang="scss" scoped>
  .page-content {
    .page-title {
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: 400;
      color: var(--el-text-color-primary);
    }

    .module-card {
      margin-bottom: 30px;
    }

    .tab-info {
      margin: 0 0 10px;
      font-size: 14px;
      color: var(--art-gray-600);
    }
  }
</style>
