<template>
  <div class="timeline-list-card">
    <div class="art-card art-custom-card">
      <div class="card-header">
        <p class="card-title">{{ title }}</p>
        <p class="card-subtitle">{{ subtitle }}</p>
      </div>
      <el-scrollbar :style="{ height: maxHeight }">
        <el-timeline>
          <el-timeline-item
            v-for="item in list"
            :key="item.time"
            :timestamp="item.time"
            :placement="TIMELINE_PLACEMENT"
            :color="item.status"
            :center="true"
          >
            <div class="timeline-item">
              <div class="timeline-content">
                <span class="timeline-text">{{ item.content }}</span>
                <span v-if="item.code" class="timeline-code"> #{{ item.code }} </span>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  // 常量配置
  const ITEM_HEIGHT = 65
  const TIMELINE_PLACEMENT = 'top'
  const DEFAULT_MAX_COUNT = 5

  interface TimelineItem {
    time: string
    status: string
    content: string
    code?: string
  }

  // Props 定义和验证
  const props = withDefaults(
    defineProps<{
      list: TimelineItem[]
      title: string
      subtitle?: string
      maxCount?: number
    }>(),
    {
      title: '',
      subtitle: '',
      maxCount: DEFAULT_MAX_COUNT
    }
  )

  // 计算最大高度
  const maxHeight = computed(() => `${ITEM_HEIGHT * props.maxCount}px`)
</script>

<style lang="scss" scoped>
  .timeline-list-card {
    .art-card {
      padding: 30px;
      background-color: var(--art-main-bg-color);
      border-radius: var(--custom-radius);

      .card-header {
        padding-bottom: 15px;

        .card-title {
          font-size: 18px;
          font-weight: 500;
          color: var(--art-gray-900);
        }

        .card-subtitle {
          font-size: 14px;
          color: var(--art-gray-500);
        }
      }
    }

    :deep(.el-timeline-item__tail) {
      left: 5px;
    }

    :deep(.el-timeline-item__node--normal) {
      left: 0;
    }

    .timeline-item {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .timeline-content {
      display: flex;
      gap: 8px;
      align-items: center;

      .timeline-text {
        font-size: 14px;
      }

      .timeline-code {
        font-size: 0.9em;
        color: var(--el-color-primary);
      }
    }
  }
</style>
