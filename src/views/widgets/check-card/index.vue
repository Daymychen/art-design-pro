<template>
  <div class="page-content mb-5">
    <div class="mb-15 text-center">
      <h1 class="my-4 text-2xl font-semibold leading-tight">多选卡片组件演示</h1>
      <p class="m-0 text-base leading-relaxed text-gray-700">
        基于 ArtCheckCard 的多选卡片组件，支持自定义头像、标签、尺寸等功能
      </p>
      <el-link
        class="mt-2"
        href="https://github.com/Daymychen/art-design-pro/tree/main/src/views/widgets/check-card/index.vue"
        target="_blank"
      >
        代码位置 src/views/widgets/check-card/index.vue
      </el-link>
    </div>

    <!-- 基础用法 -->
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">基础用法</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <ArtCheckCard
          v-model="basicSelection1"
          title="Vue.js"
          description="渐进式 JavaScript 框架"
        />
        <ArtCheckCard
          v-model="basicSelection2"
          title="React"
          description="用于构建用户界面的 JavaScript 库"
        />
        <ArtCheckCard
          v-model="basicSelection3"
          title="Angular"
          description="基于 TypeScript 构建的企业级前端框架"
        />
      </div>
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm font-medium mb-2">选择结果：</p>
        <div class="flex gap-2">
          <ElTag v-if="basicSelection1" type="success">Vue.js</ElTag>
          <ElTag v-if="basicSelection2" type="success">React</ElTag>
          <ElTag v-if="basicSelection3" type="success">Angular</ElTag>
          <span
            v-if="!basicSelection1 && !basicSelection2 && !basicSelection3"
            class="text-gray-500"
          >
            暂无选择
          </span>
        </div>
      </div>
    </div>

    <!-- 带头像的卡片 -->
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">带头像的卡片</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ArtCheckCard
          v-model="avatarSelection1"
          avatar="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          title="文档管理"
          description="支持多种文档格式，包括PDF、Word、Excel等"
          :tags="[
            { text: 'PDF', type: 'success' as const },
            { text: 'Office', type: 'primary' as const }
          ]"
        />
        <ArtCheckCard
          v-model="avatarSelection2"
          avatar="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
          title="图片处理"
          description="支持图片压缩、格式转换、裁剪等功能"
          :tags="[
            { text: 'PNG', type: 'warning' as const },
            { text: 'JPG', type: 'info' as const }
          ]"
        />
        <ArtCheckCard
          v-model="avatarSelection3"
          avatar="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          title="系统设置"
          description="配置系统参数、主题、语言等"
        />
      </div>
    </div>

    <!-- 不同尺寸 -->
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">不同尺寸</h2>
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-gray-600 w-16">小尺寸:</span>
          <ArtCheckCard
            v-model="sizeSmall"
            size="small"
            :avatar="{ icon: 'ri:user-3-line', color: '#f59e0b' }"
            title="用户管理"
            description="管理系统用户、权限和角色"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-gray-600 w-16">默认:</span>
          <ArtCheckCard
            v-model="sizeDefault"
            size="default"
            :avatar="{ icon: 'ri:settings-3-line', color: '#8b5cf6' }"
            title="系统配置"
            description="配置系统参数、主题和语言"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-gray-600 w-16">大尺寸:</span>
          <ArtCheckCard
            v-model="sizeLarge"
            size="large"
            :avatar="{ icon: 'ri:notification-3-line', color: '#ef4444' }"
            title="消息通知"
            description="系统消息、邮件通知、短信提醒等"
            :tags="[
              { text: '邮件', type: 'primary' as const },
              { text: '短信', type: 'success' as const }
            ]"
          />
        </div>
      </div>
    </div>

    <!-- 禁用状态 -->
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">禁用状态</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ArtCheckCard
          v-model="disabled1"
          disabled
          :avatar="{ icon: 'ri:lock-2-line', color: '#9ca3af' }"
          title="已禁用功能"
          description="该功能暂时不可用"
        />
        <ArtCheckCard
          v-model="disabled2"
          disabled
          :avatar="{ icon: 'ri:close-circle-line', color: '#f59e0b' }"
          title="维护中"
          description="系统升级维护，暂时不可访问"
          :tags="[{ text: '维护', type: 'warning' }]"
        />
      </div>
    </div>

    <!-- 事件监听 -->
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">事件监听</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ArtCheckCard
          v-model="eventSelection"
          :avatar="{ icon: 'ri:star-line', color: '#f59e0b' }"
          title="收藏功能"
          description="点击卡片可以收藏或取消收藏"
          :extra="{ icon: 'ri:more-2-fill', color: '#6b7280' }"
          @change="handleCardChange"
          @extra="handleExtraClick"
        />
      </div>
      <div class="mt-4 p-4 bg-gray-50 rounded-lg">
        <p class="text-sm font-medium mb-2">事件日志：</p>
        <div class="space-y-1">
          <div v-for="(log, index) in eventLogs" :key="index" class="text-xs text-gray-600">
            {{ log }}
          </div>
          <div v-if="eventLogs.length === 0" class="text-xs text-gray-400"> 暂无事件记录 </div>
        </div>
      </div>
    </div>

    <!-- 批量操作 -->
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">批量操作</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <ArtCheckCard
          v-for="(item, index) in batchItems"
          :key="index"
          v-model="item.selected"
          :avatar="{ icon: item.icon, color: item.color }"
          :title="item.title"
          :description="item.description"
          :tags="item.tags"
        />
      </div>
      <div class="flex items-center gap-4">
        <ElButton type="primary" @click="selectAll">全选</ElButton>
        <ElButton @click="selectNone">全不选</ElButton>
        <ElButton type="danger" @click="selectInverse">反选</ElButton>
        <span class="text-sm text-gray-600">
          已选择: {{ selectedCount }} / {{ batchItems.length }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ArtCheckCard from '@/components/core/cards/art-check-card/index.vue'

  defineOptions({ name: 'WidgetsCheckCard' })

  // 基础用法选择状态
  const basicSelection1 = ref(false)
  const basicSelection2 = ref(false)
  const basicSelection3 = ref(false)

  // 带头像的选择状态
  const avatarSelection1 = ref(false)
  const avatarSelection2 = ref(false)
  const avatarSelection3 = ref(false)

  // 不同尺寸的选择状态
  const sizeSmall = ref(false)
  const sizeDefault = ref(true)
  const sizeLarge = ref(false)

  // 禁用状态
  const disabled1 = ref(false)
  const disabled2 = ref(true)

  // 事件监听
  const eventSelection = ref(false)
  const eventLogs = ref<string[]>([])

  const handleCardChange = (checked: boolean) => {
    eventLogs.value.unshift(
      `${new Date().toLocaleTimeString()} - 卡片选择状态变化: ${checked ? '选中' : '取消选中'}`
    )
    if (eventLogs.value.length > 10) {
      eventLogs.value = eventLogs.value.slice(0, 10)
    }
  }

  const handleExtraClick = () => {
    eventLogs.value.unshift(`${new Date().toLocaleTimeString()} - 点击了额外操作按钮`)
    if (eventLogs.value.length > 10) {
      eventLogs.value = eventLogs.value.slice(0, 10)
    }
  }

  // 批量操作数据
  const batchItems = ref([
    {
      selected: false,
      icon: 'ri:bar-chart-2-line',
      color: '#3b82f6',
      title: '数据分析',
      description: '数据可视化和统计分析功能',
      tags: [{ text: '图表', type: 'primary' as const }]
    },
    {
      selected: false,
      icon: 'ri:share-line',
      color: '#10b981',
      title: '数据共享',
      description: '团队数据共享和协作功能',
      tags: [{ text: '协作', type: 'success' as const }]
    },
    {
      selected: false,
      icon: 'ri:shield-check-line',
      color: '#f59e0b',
      title: '安全审计',
      description: '数据安全和访问权限审计',
      tags: [{ text: '安全', type: 'warning' as const }]
    },
    {
      selected: false,
      icon: 'ri:download-2-line',
      color: '#8b5cf6',
      title: '数据导出',
      description: '支持多种格式的数据导出',
      tags: [{ text: '导出', type: 'info' as const }]
    },
    {
      selected: false,
      icon: 'ri:upload-2-line',
      color: '#ef4444',
      title: '数据导入',
      description: '批量数据导入和处理功能',
      tags: [{ text: '导入', type: 'danger' as const }]
    },
    {
      selected: false,
      icon: 'ri:calendar-2-line',
      color: '#06b6d4',
      title: '定时任务',
      description: '自动化定时数据任务处理',
      tags: [{ text: '自动化', type: 'primary' as const }]
    }
  ])

  // 批量操作方法
  const selectedCount = computed(() => {
    return batchItems.value.filter((item) => item.selected).length
  })

  const selectAll = () => {
    batchItems.value.forEach((item) => {
      item.selected = true
    })
  }

  const selectNone = () => {
    batchItems.value.forEach((item) => {
      item.selected = false
    })
  }

  const selectInverse = () => {
    batchItems.value.forEach((item) => {
      item.selected = !item.selected
    })
  }
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';
</style>
