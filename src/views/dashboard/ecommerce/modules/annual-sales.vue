<template>
  <div class="art-card p-[20px] h-[28.2rem] mb-[20px]">
    <div class="art-card-header">
      <div class="title">
        <h4>年度销售额</h4>
        <p>按季度统计</p>
      </div>
    </div>

    <ArtBarChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 80, 50, 90, 60, 70, 50]"
      barWidth="26px"
      height="calc(100% - 155px)"
    />
    <div class="flex justify-around mt-10">
      <div class="flex items-center">
        <div
          class="flex items-center justify-center w-[42px] h-[42px] mr-2.5 text-primary bg-primary/10 rounded-lg"
        >
          <i class="iconfont-sys text-xl">&#xe718;</i>
        </div>
        <div>
          <p class="text-lg">¥200,858</p>
          <span class="text-sm">线上销售</span>
        </div>
      </div>
      <div class="flex items-center">
        <div
          class="flex items-center justify-center w-[42px] h-[42px] mr-2.5 text-primary bg-primary/10 rounded-lg"
        >
          <i class="iconfont-sys text-xl">&#xe70c;</i>
        </div>
        <div>
          <p class="text-lg">¥102,927</p>
          <span class="text-sm">线下销售</span>
        </div>
      </div>
    </div>
  </div>
</template>
