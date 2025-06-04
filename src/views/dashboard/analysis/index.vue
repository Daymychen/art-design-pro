<template>
  <div class="analysis-dashboard">
    <el-row :gutter="20">
      <el-col :xl="14" :lg="15" :xs="24">
        <TodaySales />
      </el-col>
      <el-col :xl="10" :lg="9" :xs="24">
        <VisitorInsights />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :xl="10" :lg="10" :xs="24">
        <TotalRevenue />
      </el-col>
      <el-col :xl="7" :lg="7" :xs="24">
        <CustomerSatisfaction />
      </el-col>
      <el-col :xl="7" :lg="7" :xs="24">
        <TargetVsReality />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :xl="10" :lg="10" :xs="24">
        <TopProducts />
      </el-col>
      <el-col :xl="7" :lg="7" :xs="24">
        <SalesMappingByCountry />
      </el-col>
      <el-col :xl="7" :lg="7" :xs="24">
        <VolumeServiceLevel />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import TodaySales from './widget/TodaySales.vue'
  import VisitorInsights from './widget/VisitorInsights.vue'
  import TotalRevenue from './widget/TotalRevenue.vue'
  import CustomerSatisfaction from './widget/CustomerSatisfaction.vue'
  import TargetVsReality from './widget/TargetVsReality.vue'
  import TopProducts from './widget/TopProducts.vue'
  import SalesMappingByCountry from './widget/SalesMappingByCountry.vue'
  import VolumeServiceLevel from './widget/VolumeServiceLevel.vue'

  defineOptions({ name: 'Analysis' })
</script>

<style lang="scss" scoped>
  @use './style';
</style>
