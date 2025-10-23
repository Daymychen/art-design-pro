<!-- 时间轴列表卡片 -->
<template>
  <div class="[&_.el-timeline-item__tail]:left-[5px] [&_.el-timeline-item__node--normal]:left-0">
    <div
      class="art-custom-card rounded-[var(--custom-radius)] bg-[var(--art-main-bg-color)] p-[30px]"
    >
      <div class="pb-[15px]">
        <p class="text-lg font-medium text-[var(--art-gray-900)]">{{ title }}</p>
        <p class="text-sm text-[var(--art-gray-500)]">{{ subtitle }}</p>
      </div>
      <ElScrollbar :style="{ height: maxHeight }">
        <ElTimeline>
          <ElTimelineItem
            v-for="item in list"
            :key="item.time"
            :timestamp="item.time"
            :placement="TIMELINE_PLACEMENT"
            :color="item.status"
            :center="true"
          >
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <span class="text-sm">{{ item.content }}</span>
                <span v-if="item.code" class="text-[0.9em] text-[var(--el-color-primary)]">
                  #{{ item.code }}
                </span>
              </div>
            </div>
          </ElTimelineItem>
        </ElTimeline>
      </ElScrollbar>
    </div>
  </div>
</template>
<script setup lang="ts">
  defineOptions({ name: 'ArtTimelineListCard' })

  // 常量配置
  const ITEM_HEIGHT = 65
  const TIMELINE_PLACEMENT = 'top'
  const DEFAULT_MAX_COUNT = 5

  interface TimelineItem {
    /** 时间 */
    time: string
    /** 状态颜色 */
    status: string
    /** 内容 */
    content: string
    /** 代码标识 */
    code?: string
  }

  interface Props {
    /** 时间轴列表数据 */
    list: TimelineItem[]
    /** 标题 */
    title: string
    /** 副标题 */
    subtitle?: string
    /** 最大显示数量 */
    maxCount?: number
  }

  // Props 定义和验证
  const props = withDefaults(defineProps<Props>(), {
    title: '',
    subtitle: '',
    maxCount: DEFAULT_MAX_COUNT
  })

  // 计算最大高度
  const maxHeight = computed(() => `${ITEM_HEIGHT * props.maxCount}px`)
</script>
