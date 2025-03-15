<template>
  <div class="ecommerce">
    <el-row :gutter="20">
      <el-col :sm="24" :md="24" :lg="16">
        <Banner />
      </el-col>
      <el-col :sm="12" :md="12" :lg="4">
        <TotalOrderVolume />
      </el-col>
      <el-col :sm="12" :md="12" :lg="4">
        <TotalProducts />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :sm="12" :md="12" :lg="8">
        <SalesTrend />
      </el-col>
      <el-col :sm="12" :md="12" :lg="8">
        <SalesClassification />
      </el-col>
      <el-col :sm="24" :md="24" :lg="8">
        <el-row :gutter="20">
          <el-col :sm="24" :md="12" :lg="12">
            <ProductSales />
          </el-col>
          <el-col :sm="24" :md="12" :lg="12">
            <SalesGrowth />
          </el-col>
          <el-col :span="24" class="no-margin-bottom">
            <CartConversionRate />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :sm="24" :md="12" :lg="8">
        <HotCommodity />
      </el-col>
      <el-col :sm="24" :md="12" :lg="8">
        <AnnualSales />
      </el-col>
      <el-col :sm="24" :md="24" :lg="8">
        <TransactionList />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :md="24" :lg="8">
        <RecentTransaction />
      </el-col>
      <el-col :md="24" :lg="16" class="no-margin-bottom">
        <HotProductsList />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import Banner from './widget/Banner.vue'
  import TotalOrderVolume from './widget/TotalOrderVolume.vue'
  import TotalProducts from './widget/TotalProducts.vue'
  import SalesTrend from './widget/SalesTrend.vue'
  import SalesClassification from './widget/SalesClassification.vue'
  import TransactionList from './widget/TransactionList.vue'
  import HotCommodity from './widget/HotCommodity.vue'
  import RecentTransaction from './widget/RecentTransaction.vue'
  import AnnualSales from './widget/AnnualSales.vue'
  import ProductSales from './widget/ProductSales.vue'
  import SalesGrowth from './widget/SalesGrowth.vue'
  import CartConversionRate from './widget/CartConversionRate.vue'
  import HotProductsList from './widget/HotProductsList.vue'
</script>

<style lang="scss" scoped>
  .ecommerce {
    :deep(.card) {
      box-sizing: border-box;
      padding: 20px;
      background-color: var(--art-main-bg-color);
      border-radius: var(--custom-radius);

      .card-header {
        padding-bottom: 15px;

        .title {
          font-size: 18px;
          font-weight: 500;
          color: var(--art-gray-900);

          i {
            margin-left: 10px;
          }
        }

        .subtitle {
          font-size: 14px;
          color: var(--art-gray-500);
        }
      }
    }

    :deep(.icon-text-widget) {
      display: flex;
      justify-content: space-around;

      .item {
        display: flex;
        align-items: center;

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          margin-right: 10px;
          line-height: 42px;
          color: var(--main-color);
          background-color: var(--el-color-primary-light-9);
          border-radius: 8px;

          i {
            font-size: 20px;
          }
        }

        .content {
          p {
            font-size: 18px;
          }

          span {
            font-size: 14px;
          }
        }
      }
    }

    .no-margin-bottom {
      margin-bottom: 0 !important;
    }

    .el-col {
      margin-bottom: 20px;
    }
  }
</style>
