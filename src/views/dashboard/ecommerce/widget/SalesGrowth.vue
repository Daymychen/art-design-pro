<template>
  <div class="card art-custom-card" style="height: 11rem">
    <div class="card-header">
      <p class="title" style="font-size: 24px"
        >12%<i class="iconfont-sys text-success">&#xe8d5;</i></p
      >
      <p class="subtitle">增长</p>
    </div>

    <LineChart
      :showAreaColor="true"
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 85, 65, 95, 75, 130, 180]"
      barWidth="16px"
      height="4rem"
    />
  </div>
</template>
