<template>
  <div class="art-card p-5 mb-5 h-105 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>销售分类</h4>
        <p>按产品类别</p>
      </div>
    </div>

    <ArtRingChart
      :data="[
        { value: 30, name: '电子产品' },
        { value: 55, name: '服装鞋包' },
        { value: 36, name: '家居用品' }
      ]"
      :color="['#4C87F3', '#EDF2FF', '#8BD8FC']"
      :radius="['70%', '80%']"
      height="16.5rem"
      :showLabel="false"
      :borderRadius="0"
      centerText="¥300,458"
    />
    <div class="flex justify-around">
      <div class="flex-c">
        <div class="flex-cc size-10.5 mr-2.5 text-theme bg-theme/10 rounded-lg">
          <ArtSvgIcon icon="ri:money-cny-circle-line" class="text-xl" />
        </div>
        <div>
          <p class="text-lg">¥500,458</p>
          <span class="text-sm">总收入</span>
        </div>
      </div>
      <div class="flex-c">
        <div class="flex-cc size-10.5 mr-2.5 text-theme bg-theme/10 rounded-lg">
          <ArtSvgIcon icon="ri:heart-3-line" class="text-xl" />
        </div>
        <div>
          <p class="text-lg">¥130,580</p>
          <span class="text-sm">净利润</span>
        </div>
      </div>
    </div>
  </div>
</template>
