<template>
  <div class="card art-custom-card yearly-card" style="height: 28.2rem">
    <div class="card-header">
      <p class="title">年度销售额</p>
      <p class="subtitle">按季度统计</p>
    </div>

    <BarChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 80, 50, 90, 60, 70, 50]"
      barWidth="26px"
      height="16rem"
    />
    <div class="icon-text-widget" style="margin-top: 50px">
      <div class="item">
        <div class="icon">
          <i class="iconfont-sys">&#xe718;</i>
        </div>
        <div class="content">
          <p>¥200,858</p>
          <span>线上销售</span>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <i class="iconfont-sys">&#xe70c;</i>
        </div>
        <div class="content">
          <p>¥102,927</p>
          <span>线下销售</span>
        </div>
      </div>
    </div>
  </div>
</template>
