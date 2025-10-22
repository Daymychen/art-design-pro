<template>
  <div class="art-card h-[330px] p-[20px] mb-[20px] overflow-hidden max-lg:h-auto">
    <div class="art-card-header">
      <div class="title">
        <h4>今日销售</h4>
        <p>销售总结</p>
      </div>
      <div
        class="flex items-center h-[30px] min-w-[66px] justify-center text-[12px] border border-g-300 rounded-[6px] text-g-500 cursor-pointer"
      >
        <ArtSvgIcon icon="ri:account-box-2-line" class="text-[16px] mr-[6px]" />
        <span>导出</span>
      </div>
    </div>

    <div class="mt-[10px]">
      <ElRow :gutter="20">
        <ElCol :span="6" :xs="24" v-for="(item, index) in salesData" :key="index">
          <div
            class="flex px-[20px] flex-col justify-center h-[220px] border border-g-200 rounded-[12px] max-lg:mb-4"
          >
            <div class="size-[50px] rounded-[12px] flex items-center justify-center bg-primary/10">
              <ArtSvgIcon icon="ri:account-box-2-line" class="text-[26px] text-primary" />
            </div>
            <ArtCountTo
              class="text-2xl font-medium mt-[15px]"
              :target="item.value"
              :duration="1500"
            />
            <p class="mt-[10px] text-[16px] text-g-600">{{ item.label }}</p>
            <small class="text-g-500 mt-[5px]">
              较昨天
              <span
                class="font-medium"
                :class="[item.change.indexOf('+') === -1 ? 'text-red-500' : 'text-lime-500']"
                >{{ item.change }}</span
              >
            </small>
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
    iconfont: string
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
      iconfont: '&#xe7d9',
      class: 'bg-primary'
    },
    {
      label: '总订单量',
      value: 300,
      change: '+15%',
      iconfont: '&#xe70f',
      class: 'bg-warning'
    },
    {
      label: '产品销售量',
      value: 56,
      change: '-5%',
      iconfont: '&#xe712',
      class: 'bg-error'
    },
    {
      label: '新客户数',
      value: 68,
      change: '+8%',
      iconfont: '&#xe77f',
      class: 'bg-success'
    }
  ])
</script>
