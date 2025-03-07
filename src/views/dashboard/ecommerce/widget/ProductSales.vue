<template>
  <div class="card art-custom-card" style="height: 11rem">
    <div class="card-header">
      <p class="title" style="font-size: 24px"
        >14.5k<i class="iconfont-sys text-success">&#xe8d5;</i></p
      >
      <p class="subtitle">销售量</p>
    </div>

    <BarChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 80, 50, 90, 60, 70, 50]"
      barWidth="16px"
      height="4rem"
    />
  </div>
</template>
