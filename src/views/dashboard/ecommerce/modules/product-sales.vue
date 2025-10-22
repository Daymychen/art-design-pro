<template>
  <div class="art-card p-[20px] pt-[15px] mb-[20px] h-[180px]">
    <div class="art-card-header">
      <div class="title">
        <h4 class="text-2xl">14.5k<i class="iconfont-sys text-success">&#xe8d5;</i></h4>
        <p>销售量</p>
      </div>
    </div>

    <ArtBarChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 80, 50, 90, 60, 70, 50]"
      barWidth="16px"
      height="5.6rem"
    />
  </div>
</template>
