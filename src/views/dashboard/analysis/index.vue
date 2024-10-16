<template>
  <div class="analysis-dashboard" :style="{ paddingTop: showWorkTab ? '0' : '10px' }">
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
  import { useSettingStore } from '@/store/modules/setting'

  const settingStore = useSettingStore()
  const showWorkTab = computed(() => settingStore.showWorkTab)
</script>

<style lang="scss" scoped>
  .analysis-dashboard {
    padding-bottom: 20px;

    :deep(.custom-card) {
      background: var(--art-main-bg-color);
      border-radius: 16px;
    }

    // 卡片头部
    :deep(.custom-card-header) {
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 20px;

      .title {
        font-size: 20px;
        font-weight: 400;
        color: var(--art-text-gray-900);
      }

      .subtitle {
        position: absolute;
        bottom: 2px;
        left: 21px;
        font-size: 13px;
        color: #737791;
      }
    }

    .el-card {
      border: 1px solid #e8ebf1;
      box-shadow: none;
    }

    .mt-20 {
      margin-top: 20px;
    }
  }

  // 盒子阴影
  [data-box-mode='shadow-mode'] {
    .analysis-dashboard {
      :deep(.custom-card) {
        box-shadow: 0 4px 20px rgb(238 238 238 / 50%);
      }
    }
  }

  // 盒子边框
  [data-box-mode='border-mode'] {
    .analysis-dashboard {
      :deep(.custom-card) {
        border: 1px solid rgba(var(--art-gray-300-rgb), 0.6) !important;
      }
    }
  }

  .dark {
    .analysis-dashboard {
      :deep(.custom-card) {
        box-shadow: 0 4px 20px rgb(0 0 0 / 50%);
      }
    }
  }

  @media (width <= 1200px) {
    .analysis-dashboard {
      padding: 10px 0 0;

      .mt-20 {
        margin-top: 0;
      }

      :deep(.custom-card) {
        margin-bottom: 20px;
      }
    }
  }
</style>
