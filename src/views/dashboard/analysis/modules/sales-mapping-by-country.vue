<template>
  <div class="art-card h-82 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>全国销售分布</h4>
      </div>
    </div>

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
</template>
