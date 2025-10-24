<template>
  <div class="art-card p-5 h-[28.2rem] mb-5">
    <div class="art-card-header">
      <div class="title">
        <h4>热销商品</h4>
        <p>本周销售排行</p>
      </div>
    </div>
    <ArtLineChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :showAreaColor="true"
      :data="[8, 40, 82, 35, 90, 52, 35]"
      height="9rem"
    />
    <div class="mt-10 space-y-5">
      <div v-for="item in weeklyList" :key="item.title" class="flex items-center">
        <div class="w-[42px] h-[42px] flex-center rounded-lg" :class="item.iconBgClass">
          <ArtSvgIcon :icon="item.icon" class="text-xl" />
        </div>
        <div class="ml-2.5">
          <p class="text-sm font-medium text-gray-800">{{ item.title }}</p>
          <span class="text-sm text-gray-600">{{ item.subtitle }}</span>
        </div>
        <div class="ml-auto px-3 py-1.5 text-sm text-center rounded" :class="item.valueBgClass">
          <span>+{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface WeeklyItem {
    icon: string
    title: string
    subtitle: string
    value: string
    iconBgClass: string
    valueBgClass: string
  }

  /**
   * 本周热销商品列表
   * 展示销量排名前三的商品信息
   */
  const weeklyList: WeeklyItem[] = [
    {
      icon: 'ri:money-cny-circle-line',
      title: '智能手表Pro',
      subtitle: '电子产品',
      value: '1,286件',
      iconBgClass: 'bg-[rgb(var(--art-bg-primary))] text-[rgb(var(--art-primary))]',
      valueBgClass: 'bg-[rgb(var(--art-bg-primary))] text-[rgb(var(--art-primary))]'
    },
    {
      icon: 'ri:money-cny-circle-line',
      title: '时尚连衣裙',
      subtitle: '女装服饰',
      value: '892件',
      iconBgClass: 'bg-[rgb(var(--art-bg-success))] text-[rgb(var(--art-success))]',
      valueBgClass: 'bg-[rgb(var(--art-bg-success))] text-[rgb(var(--art-success))]'
    },
    {
      icon: 'ri:money-cny-circle-line',
      title: '厨房小家电',
      subtitle: '家居用品',
      value: '756件',
      iconBgClass: 'bg-[rgb(var(--art-bg-error))] text-[rgb(var(--art-error))]',
      valueBgClass: 'bg-[rgb(var(--art-bg-error))] text-[rgb(var(--art-error))]'
    }
  ]
</script>
