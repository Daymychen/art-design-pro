<template>
  <div class="art-card h-[420px] p-[16px] box-border mb-[20px]">
    <ArtBarChart
      class="box-border p-[10px]"
      barWidth="50%"
      height="13.7rem"
      :showAxisLine="false"
      :data="[160, 100, 150, 80, 190, 100, 175, 120, 160]"
      :xAxisData="['1', '2', '3', '4', '5', '6', '7', '8', '9']"
    />
    <div class="ml-[3px]">
      <h3 class="mt-[20px] text-[18px] font-medium">用户概述</h3>
      <p class="mt-[5px] text-[14px]">比上周 <span class="text-lime-500 font-medium">+23%</span></p>
      <p class="mt-[5px] text-[14px]"
        >我们为您创建了多个选项，可将它们组合在一起并定制为像素完美的页面</p
      >
    </div>
    <div class="flex justify-between mt-[10px]">
      <div class="flex-1" v-for="(item, index) in list" :key="index">
        <p class="text-[24px] text-g-900">{{ item.num }}</p>
        <p class="text-[13px] text-g-500">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface UserStatItem {
    name: string
    num: string
  }

  /**
   * 用户统计数据列表
   * 包含总用户量、总访问量、日访问量和周同比等关键指标
   */
  const list: UserStatItem[] = [
    { name: '总用户量', num: '32k' },
    { name: '总访问量', num: '128k' },
    { name: '日访问量', num: '1.2k' },
    { name: '周同比', num: '+5%' }
  ]
</script>
