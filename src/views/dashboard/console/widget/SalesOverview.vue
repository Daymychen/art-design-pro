<template>
  <div class="card art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">访问量</h4>
        <p class="subtitle">今年增长<span class="text-success">+15%</span></p>
      </div>
    </div>
    <ArtLineChart
      class="chart"
      height="calc(100% - 40px)"
      :data="data"
      :xAxisData="xAxisData"
      :showAreaColor="true"
      :showAxisLine="false"
    />
  </div>
</template>

<script setup lang="ts">
  const data = [50, 25, 40, 20, 70, 35, 65, 30, 35, 20, 40, 44]
  const xAxisData = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月'
  ]
</script>

<style lang="scss" scoped>
  .card {
    box-sizing: border-box;
    width: 100%;
    height: 420px;
    padding: 20px 0 30px;

    .card-header {
      padding: 0 18px !important;
    }

    .chart {
      box-sizing: border-box;
      width: 100%;
      padding: 20px 20px 0;
    }
  }

  @media screen and (max-width: $device-phone) {
    .card {
      height: 280px;
    }
  }
</style>
