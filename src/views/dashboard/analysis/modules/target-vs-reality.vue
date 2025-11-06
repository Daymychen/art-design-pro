<template>
  <div class="art-card h-100 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>目标与实际</h4>
      </div>
    </div>

    <ArtBarChart
      class="p-5"
      height="12rem"
      :data="revenueData"
      :xAxisData="weekDays"
      :showAxisLine="false"
      barWidth="28%"
    />

    <div class="px-5 mt-4">
      <div v-for="item in totalItems" :key="item.label" class="flex-c mb-5 last:mb-0">
        <div class="flex-c justify-start w-3/5 text-sm">
          <div class="w-10 h-10 mr-3 text-lg rounded-md flex-cc" :class="item.iconClass">
            <ArtSvgIcon :icon="item.icon" />
          </div>

          <div class="flex flex-col items-start">
            <span class="text-base text-g-800">{{ item.label }}</span>
            <span class="mt-1 text-xs text-g-500">{{ item.subLabel }}</span>
          </div>
        </div>
        <div class="text-lg font-normal" :class="item.valueClass">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface RevenueDataItem {
    name: string
    data: number[]
  }

  /**
   * 一周的日期标签
   */
  const weekDays = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])

  /**
   * 目标与实际销售数据
   * 展示一周内的线上销售情况
   */
  const revenueData = ref<RevenueDataItem[]>([
    {
      name: '线上销售',
      data: [12, 13, 5, 15, 10, 15, 18]
    }
  ])

  /**
   * 统计项数据
   */
  const totalItems = [
    {
      icon: 'ri:shopping-bag-line',
      iconClass: 'text-theme bg-theme/12',
      label: '实际销售额',
      subLabel: '全球',
      value: '8,823',
      valueClass: 'text-theme'
    },
    {
      icon: 'ri:money-dollar-circle-line',
      iconClass: 'text-theme bg-theme/12',
      label: '目标销售额',
      subLabel: '商业',
      value: '12,122',
      valueClass: 'text-theme'
    }
  ]
</script>
