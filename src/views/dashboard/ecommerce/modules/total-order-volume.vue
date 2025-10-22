<template>
  <div class="art-card p-[20px] pt-[15px] mb-[20px]" style="height: 13.3rem">
    <div class="art-card-header">
      <div class="title">
        <h4 class="text-2xl font-medium">205,216</h4>
        <p>这个月增长</p>
      </div>
    </div>

    <ArtRingChart
      :data="[
        { value: 30, name: '已完成' },
        { value: 25, name: '处理中' },
        { value: 45, name: '待发货' }
      ]"
      :color="['#4C87F3', '#93F1B4', '#8BD8FC']"
      :radius="['56%', '76%']"
      height="7rem"
      :showLabel="false"
      :borderRadius="0"
    />
  </div>
</template>
