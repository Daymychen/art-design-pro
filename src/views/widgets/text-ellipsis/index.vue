<template>
  <div class="page-content mb-5">
    <div class="mb-15 text-center">
      <h1 class="my-4 text-2xl font-semibold leading-tight">文本省略组件演示</h1>
      <p class="m-0 text-base leading-relaxed text-gray-700 dark:text-gray-300">
        基于 ElText 和 VueTippy 的智能文本省略组件，支持单行/多行省略，自动显示 Tooltip
      </p>
      <el-link
        class="mt-2"
        href="https://github.com/Daymychen/art-design-pro/tree/main/src/views/widgets/text-ellipsis/index.vue"
        target="_blank"
      >
        代码位置 src/views/widgets/text-ellipsis/index.vue
      </el-link>
    </div>

    <!-- 基础用法 -->
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">基础用法</h2>
      <div class="space-y-4">
        <div class="art-card-sm p-5">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">单行省略</h3>

          <!-- 宽度控制器 -->
          <div
            class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded"
          >
            <div class="flex items-center gap-4 mb-2">
              <span class="text-sm font-medium text-blue-800 dark:text-blue-300 w-24"
                >容器宽度：</span
              >
              <ElSlider
                v-model="containerWidth"
                :min="100"
                :max="800"
                :step="10"
                show-input
                class="flex-1"
              />
            </div>
            <div class="text-xs text-blue-600 dark:text-blue-400">
              💡 拖动滑块调整容器宽度，观察文本省略效果
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-start gap-4">
              <span class="text-sm text-gray-600 dark:text-gray-400 w-20 flex-shrink-0 pt-3"
                >默认：</span
              >
              <div
                class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
                :style="{ width: containerWidth + 'px' }"
              >
                <ArtTextEllipsis :text="longText" />
              </div>
            </div>
            <div class="flex items-start gap-4">
              <span class="text-sm text-gray-600 dark:text-gray-400 w-20 flex-shrink-0 pt-3"
                >Primary：</span
              >
              <div
                class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
                :style="{ width: containerWidth + 'px' }"
              >
                <ArtTextEllipsis :text="longText" type="primary" />
              </div>
            </div>
            <div class="flex items-start gap-4">
              <span class="text-sm text-gray-600 dark:text-gray-400 w-20 flex-shrink-0 pt-3"
                >Success：</span
              >
              <div
                class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
                :style="{ width: containerWidth + 'px' }"
              >
                <ArtTextEllipsis :text="longText" type="success" />
              </div>
            </div>
          </div>
        </div>

        <div class="art-card-sm p-5">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">多行省略</h3>

          <!-- 宽度控制器 -->
          <div
            class="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded"
          >
            <div class="flex items-center gap-4 mb-2">
              <span class="text-sm font-medium text-green-800 dark:text-green-300 w-24"
                >容器宽度：</span
              >
              <ElSlider
                v-model="multilineWidth"
                :min="200"
                :max="800"
                :step="10"
                show-input
                class="flex-1"
              />
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">
              💡 调整容器宽度，观察多行文本省略效果
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">2 行省略：</div>
              <div
                class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
                :style="{ width: multilineWidth + 'px' }"
              >
                <ArtTextEllipsis :text="veryLongText" multiline :line-clamp="2" />
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">3 行省略：</div>
              <div
                class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
                :style="{ width: multilineWidth + 'px' }"
              >
                <ArtTextEllipsis :text="veryLongText" multiline :line-clamp="3" />
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">4 行省略：</div>
              <div
                class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
                :style="{ width: multilineWidth + 'px' }"
              >
                <ArtTextEllipsis :text="veryLongText" multiline :line-clamp="4" type="primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 不同尺寸 -->
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">不同尺寸</h2>
      <div class="art-card-sm p-5">
        <div class="space-y-4">
          <div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">Large：</div>
            <div
              class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
              :style="{ width: containerWidth + 'px' }"
            >
              <ArtTextEllipsis :text="longText" size="large" />
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">Default：</div>
            <div
              class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
              :style="{ width: containerWidth + 'px' }"
            >
              <ArtTextEllipsis :text="longText" size="default" />
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">Small：</div>
            <div
              class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
              :style="{ width: containerWidth + 'px' }"
            >
              <ArtTextEllipsis :text="longText" size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 不同类型 -->
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">不同类型</h2>
      <div class="art-card-sm p-5">
        <div class="space-y-3">
          <div class="flex items-start gap-4">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-20 flex-shrink-0 pt-3"
              >Primary：</span
            >
            <div
              class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
              :style="{ width: containerWidth + 'px' }"
            >
              <ArtTextEllipsis :text="longText" type="primary" />
            </div>
          </div>
          <div class="flex items-start gap-4">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-20 flex-shrink-0 pt-3"
              >Success：</span
            >
            <div
              class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
              :style="{ width: containerWidth + 'px' }"
            >
              <ArtTextEllipsis :text="longText" type="success" />
            </div>
          </div>
          <div class="flex items-start gap-4">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-20 flex-shrink-0 pt-3"
              >Warning：</span
            >
            <div
              class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800 transition-all duration-300"
              :style="{ width: containerWidth + 'px' }"
            >
              <ArtTextEllipsis :text="longText" type="warning" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 代码示例 -->
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">代码示例</h2>
      <div class="art-card-sm p-5">
        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">单行省略</h3>
            <div
              class="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200 p-4 rounded-lg font-mono text-sm overflow-x-auto"
            >
              <pre><code>&lt;ArtTextEllipsis :text="longText" /&gt;</code></pre>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">多行省略</h3>
            <div
              class="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200 p-4 rounded-lg font-mono text-sm overflow-x-auto"
            >
              <pre><code>&lt;ArtTextEllipsis 
  :text="longText" 
  multiline 
  :line-clamp="3" 
/&gt;</code></pre>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >自定义样式和 Tooltip</h3
            >
            <div
              class="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200 p-4 rounded-lg font-mono text-sm overflow-x-auto"
            >
              <pre><code>&lt;ArtTextEllipsis 
  :text="longText" 
  type="primary"
  size="large"
  tooltip-placement="bottom"
  :tooltip-max-width="500"
/&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- API 文档 -->
    <div class="mb-15">
      <h2 class="m-0 mb-6 text-xl font-medium">API 文档</h2>
      <div class="art-card-sm p-5">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Props</h3>
        <ElTable :data="apiData" border style="width: 100%">
          <ElTableColumn prop="name" label="属性名" width="180" />
          <ElTableColumn prop="type" label="类型" width="150" />
          <ElTableColumn prop="default" label="默认值" width="120" />
          <ElTableColumn prop="description" label="说明" min-width="200" />
        </ElTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { ElTable, ElTableColumn, ElSlider } from 'element-plus'
  import ArtTextEllipsis from '@/components/core/base/art-text-ellipsis/index.vue'

  defineOptions({ name: 'WidgetsTextEllipsis' })

  // 容器宽度控制
  const containerWidth = ref(300)
  const multilineWidth = ref(500)

  // 示例文本
  const longText = ref(
    '这是一段很长的文本内容，用于演示文本省略功能。当文本超出容器宽度时，会自动省略并显示省略号，鼠标悬停时会显示完整内容的 Tooltip 提示。'
  )

  const veryLongText = ref(
    '这是一段非常长的文本内容，用于演示多行文本省略功能。在实际应用中，我们经常需要在有限的空间内展示大量文本信息，比如文章摘要、商品描述、用户评论等场景。通过多行省略功能，我们可以优雅地处理这些长文本，既保证了界面的整洁美观，又不会丢失重要信息。用户可以通过鼠标悬停查看完整内容，提供了良好的用户体验。这个组件基于 Element Plus 的 Text 组件和 VueTippy 实现，支持灵活的配置选项，可以满足各种业务场景的需求。'
  )

  // API 文档数据
  const apiData = ref([
    {
      name: 'text',
      type: 'string',
      default: "''",
      description: '文本内容'
    },
    {
      name: 'type',
      type: 'string',
      default: 'default',
      description: '文本类型：primary / success / warning / danger / info / default'
    },
    {
      name: 'size',
      type: 'string',
      default: 'default',
      description: '文本大小：large / default / small'
    },
    {
      name: 'tag',
      type: 'string',
      default: 'span',
      description: '渲染的 HTML 标签'
    },
    {
      name: 'multiline',
      type: 'boolean',
      default: 'false',
      description: '是否多行省略'
    },
    {
      name: 'lineClamp',
      type: 'number',
      default: '2',
      description: '多行省略的行数'
    },
    {
      name: 'tooltipPlacement',
      type: 'string',
      default: 'top',
      description: 'Tooltip 位置：top / bottom / left / right 等'
    },
    {
      name: 'tooltipTheme',
      type: 'string',
      default: 'light',
      description: 'Tooltip 主题：light / dark'
    },
    {
      name: 'tooltipMaxWidth',
      type: 'number | string',
      default: '400',
      description: 'Tooltip 最大宽度'
    },
    {
      name: 'tooltipDelay',
      type: 'number | [number, number]',
      default: '200',
      description: 'Tooltip 延迟显示时间（毫秒）'
    },
    {
      name: 'textClass',
      type: 'string',
      default: "''",
      description: '自定义类名'
    }
  ])
</script>

<style scoped>
  @reference '@styles/core/tailwind.css';
</style>
