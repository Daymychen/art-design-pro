<template>
  <div class="art-card h-82 p-5 mb-5">
    <div class="art-card-header">
      <div class="title">
        <h4>业务量与服务水平</h4>
      </div>
    </div>

    <ArtBarChart
      class="mt-6"
      height="14.3rem"
      :data="volumeServiceData"
      :xAxisData="serviceCategories"
      :showLegend="true"
      :showAxisLine="false"
      :stack="true"
      barWidth="22%"
    />
  </div>
</template>

<script setup lang="ts">
  interface VolumeServiceDataItem {
    name: string
    data: number[]
    stack: string
  }

  /**
   * 服务类别数据
   * 不同产品的分类标签
   */
  const serviceCategories = ref(['产品A', '产品B', '产品C', '产品D', '产品E'])

  /**
   * 业务量与服务量数据
   * 展示各产品的业务量和服务量对比，使用堆叠柱状图展示
   */
  const volumeServiceData = ref<VolumeServiceDataItem[]>([
    {
      name: '业务量',
      data: [20, 25, 30, 35, 40],
      stack: 'total'
    },
    {
      name: '服务量',
      data: [30, 35, 40, 45, 50],
      stack: 'total'
    }
  ])
</script>
