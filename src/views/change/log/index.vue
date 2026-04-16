<!-- 更新日志页面 -->
<template>
  <div class="mx-auto pt-5 mb-5">
    <!-- 标题 -->
    <h3 class="text-2xl font-medium text-g-900 mb-8">更新日志</h3>

    <!-- 日志列表 -->
    <div v-if="loading" class="flex-cc h-40">
      <ElIcon class="is-loading text-4xl text-theme"><Loading /></ElIcon>
    </div>
    <ElEmpty v-else-if="upgradeLogList.length === 0" description="暂无更新日志" />
    <div v-else class="space-y-5">
      <div
        v-for="item in upgradeLogList"
        :key="item.version"
        class="art-card-sm rounded-lg p-6 transition-shadow max-md:p-4"
      >
        <!-- 版本和日期 -->
        <div class="flex-cb gap-3 mb-4 flex-wrap">
          <span class="px-3 py-1 bg-theme/10 text-theme text-sm font-medium rounded-full">
            {{ item.version }}
          </span>
          <span class="text-sm text-g-500">{{ item.date }}</span>
        </div>

        <!-- 标题 -->
        <h4 class="text-lg font-medium text-g-900 mb-3">{{ item.title }}</h4>

        <!-- 详情列表 -->
        <ul v-if="item.detail?.length" class="space-y-2 mb-4">
          <li
            v-for="(detail, index) in item.detail"
            :key="index"
            class="flex-c gap-2 text-sm text-g-600"
          >
            <span class="mt-0.5">•</span>
            <span class="text-g-700">{{ detail }}</span>
          </li>
        </ul>

        <!-- 备注 -->
        <div v-if="item.remark" class="text-sm text-g-800 bg-g-300/60 rounded p-3 mb-3">
          {{ item.remark }}
        </div>

        <!-- 标签 -->
        <ElTag v-if="item.requireReLogin" type="warning" size="small">需要重新登录</ElTag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { fetchChangelogList } from '@/api/changelog'
  import type { UpgradeLog } from '@/api/changelog'
  import { Loading } from '@element-plus/icons-vue'

  defineOptions({ name: 'ChangeLog' })

  const upgradeLogList = ref<UpgradeLog[]>([])
  const loading = ref(false)

  onMounted(async () => {
    loading.value = true
    try {
      upgradeLogList.value = await fetchChangelogList()
    } catch (e) {
      console.error('获取更新日志失败:', e)
    } finally {
      loading.value = false
    }
  })
</script>
