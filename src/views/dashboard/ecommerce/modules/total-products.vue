<template>
  <div class="art-card p-[20px] pt-[15px] mb-[20px]" style="height: 13.3rem">
    <div class="art-card-header">
      <div class="title">
        <h4 class="text-2xl font-medium">55,231</h4>
        <p>商品总数</p>
      </div>
    </div>

    <ArtBarChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 80, 40, 90, 60, 70]"
      height="7rem"
      barWidth="18px"
    />
  </div>
</template>
