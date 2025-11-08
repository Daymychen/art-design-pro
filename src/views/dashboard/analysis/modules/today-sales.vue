<template>
  <div class="art-card h-82 p-5 mb-5 overflow-hidden max-lg:h-auto max-sm:mb-4">
    <div class="art-card-header pr-0">
      <div class="title">
        <h4>今日销售</h4>
        <p>销售总结</p>
      </div>
      <div class="flex-cc h-7.5 min-w-17 border border-g-300 rounded-lg text-g-500 c-p">
        <ArtSvgIcon icon="ri:arrow-up-line" class="text-base mr-1.5" />
        <span class="text-xs">导出</span>
      </div>
    </div>

    <div class="mt-2">
      <ElRow :gutter="20">
        <ElCol :span="6" :xs="24" v-for="(item, index) in salesData" :key="index">
          <div
            class="flex px-5 flex-col justify-center h-55 border border-g-300/85 rounded-xl max-lg:mb-4 max-sm:flex-row max-sm:justify-between max-sm:items-center max-sm:h-40"
          >
            <div class="size-12 rounded-lg flex-cc bg-theme/10">
              <ArtSvgIcon :icon="item.icon" class="text-xl text-theme" />
            </div>

            <div class="max-sm:ml-4 mt-3.5 max-sm:mt-0 max-sm:text-end">
              <ArtCountTo class="text-2xl font-medium" :target="item.value" :duration="1500" />
              <p class="mt-2 text-base text-g-600 max-sm:mt-1">{{ item.label }}</p>
              <small class="text-g-500 mt-1 max-sm:mt-0.5">
                较昨天
                <span
                  class="font-medium"
                  :class="[item.change.indexOf('+') === -1 ? 'text-danger' : 'text-success']"
                  >{{ item.change }}</span
                >
              </small>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface SalesDataItem {
    label: string
    value: number
    change: string
    icon: string
    class: string
  }

  /**
   * 今日销售数据统计
   * 包含销售额、订单量、产品销量和新客户数等关键指标
   */
  const salesData = ref<SalesDataItem[]>([
    {
      label: '总销售额',
      value: 999,
      change: '+10%',
      icon: 'ri:bar-chart-box-ai-line',
      class: 'bg-theme'
    },
    {
      label: '总订单量',
      value: 300,
      change: '+15%',
      icon: 'ri:bar-chart-grouped-line',
      class: 'bg-warning'
    },
    {
      label: '产品销售量',
      value: 56,
      change: '-5%',
      icon: 'ri:bar-chart-2-line',
      class: 'bg-error'
    },
    {
      label: '新客户数',
      value: 68,
      change: '+8%',
      icon: 'ri:user-add-line',
      class: 'bg-success'
    }
  ])
</script>
