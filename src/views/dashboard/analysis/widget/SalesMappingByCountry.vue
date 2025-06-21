<template>
  <div class="custom-card art-custom-card sales-mapping-country">
    <div class="custom-card-header">
      <span class="title">全国销售分布</span>
    </div>
    <div class="custom-card-body">
      <ArtRingChart
        :data="[
          { value: 30, name: '北京' },
          { value: 25, name: '上海' },
          { value: 45, name: '广州' }
        ]"
        :color="['#4C87F3', '#93F1B4', '#8BD8FC']"
        :radius="['46%', '60%']"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .sales-mapping-country {
    height: 330px;

    .sales-mapping-chart {
      width: 100%;
      height: 260px;
    }
  }
</style>
