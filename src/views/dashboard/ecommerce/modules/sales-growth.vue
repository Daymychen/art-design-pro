<template>
  <div class="art-card p-[20px] pt-[15px] mb-[20px] h-[180px]">
    <div class="art-card-header">
      <div class="title">
        <h4 class="text-2xl">12%<i class="iconfont-sys text-success">&#xe8d5;</i></h4>
        <p>增长</p>
      </div>
    </div>

    <ArtLineChart
      :showAreaColor="true"
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 85, 65, 95, 75, 130, 180]"
      barWidth="16px"
      height="5rem"
    />
  </div>
</template>
