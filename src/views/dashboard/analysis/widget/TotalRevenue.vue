<template>
  <div class="custom-card total-revenue-card art-custom-card">
    <div class="custom-card-header">
      <span class="title">总收入</span>
    </div>
    <div class="custom-card-body">
      <ArtBarChart
        height="100%"
        :data="revenueData"
        :xAxisData="weekDays"
        :showLegend="true"
        :showAxisLine="false"
        barWidth="18%"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const weekDays = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])

  const revenueData = ref([
    {
      name: '线上销售',
      data: [12, 13, 5, 15, 10, 15, 18]
    },
    {
      name: '线下销售',
      data: [10, 11, 20, 5, 11, 13, 10]
    }
  ])
</script>

<style lang="scss" scoped>
  .total-revenue-card {
    height: 400px;

    .custom-card-body {
      height: calc(100% - 108px);
      padding: 20px;
    }
  }

  @media screen and (max-width: $device-phone) {
    .total-revenue-card {
      height: 300px;
    }
  }
</style>
