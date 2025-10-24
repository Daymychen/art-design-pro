<!-- 数据列表卡片 -->
<template>
  <div>
    <div class="art-custom-card rounded-[var(--custom-radius)] art-card-bg p-[30px]">
      <div class="pb-[15px]">
        <p class="text-lg font-medium">{{ title }}</p>
        <p class="text-sm text-g-500">{{ subtitle }}</p>
      </div>
      <ElScrollbar :style="{ height: maxHeight }">
        <div v-for="(item, index) in list" :key="index" class="flex items-center py-3">
          <div v-if="item.icon" class="mr-3 size-10 flex-center rounded-lg" :class="item.class">
            <ArtSvgIcon :icon="item.icon" class="text-xl text-g-400" />
          </div>
          <div class="flex-1">
            <div class="mb-1 text-[15px]">{{ item.title }}</div>
            <div class="text-xs text-g-500">{{ item.status }}</div>
          </div>
          <div class="ml-3 text-xs text-g-500]">{{ item.time }}</div>
        </div>
      </ElScrollbar>
      <ElButton
        class="mt-[25px] w-full text-center"
        v-if="showMoreButton"
        v-ripple
        @click="handleMore"
        >查看更多</ElButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtDataListCard' })

  interface Props {
    /** 数据列表 */
    list: Activity[]
    /** 标题 */
    title: string
    /** 副标题 */
    subtitle?: string
    /** 最大显示数量 */
    maxCount?: number
    /** 是否显示更多按钮 */
    showMoreButton?: boolean
  }

  interface Activity {
    /** 标题 */
    title: string
    /** 状态 */
    status: string
    /** 时间 */
    time: string
    /** 样式类名 */
    class: string
    /** 图标 */
    icon: string
  }

  const ITEM_HEIGHT = 66
  const DEFAULT_MAX_COUNT = 5

  const props = withDefaults(defineProps<Props>(), {
    maxCount: DEFAULT_MAX_COUNT
  })

  const maxHeight = computed(() => `${ITEM_HEIGHT * props.maxCount}px`)

  const emit = defineEmits<{
    /** 点击更多按钮事件 */
    (e: 'more'): void
  }>()

  const handleMore = () => emit('more')
</script>
