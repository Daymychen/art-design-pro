<template>
  <div class="card art-custom-card" style="height: 13.3rem">
    <div class="card-header">
      <p class="title" style="font-size: 24px">55,231</p>
      <p class="subtitle">商品总数</p>
    </div>
    <BarChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 80, 40, 90, 60, 70]"
      height="7rem"
      barWidth="18px"
    />
  </div>
</template>
