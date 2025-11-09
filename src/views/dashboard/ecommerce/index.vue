<!-- 电子商务页面 -->
<template>
  <div class="ecommerce">
    <ElRow :gutter="20">
      <ElCol :sm="24" :md="24" :lg="16">
        <Banner />
      </ElCol>
      <ElCol :sm="12" :md="12" :lg="4">
        <TotalOrderVolume />
      </ElCol>
      <ElCol :sm="12" :md="12" :lg="4">
        <TotalProducts />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :sm="12" :md="12" :lg="8">
        <SalesTrend />
      </ElCol>
      <ElCol :sm="12" :md="12" :lg="8">
        <SalesClassification />
      </ElCol>
      <ElCol :sm="24" :md="24" :lg="8">
        <ElRow :gutter="20">
          <ElCol :sm="24" :md="12" :lg="12">
            <ProductSales />
          </ElCol>
          <ElCol :sm="24" :md="12" :lg="12">
            <SalesGrowth />
          </ElCol>
          <ElCol :span="24" class="no-margin-bottom">
            <CartConversionRate />
          </ElCol>
        </ElRow>
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :sm="24" :md="12" :lg="8">
        <HotCommodity />
      </ElCol>
      <ElCol :sm="24" :md="12" :lg="8">
        <AnnualSales />
      </ElCol>
      <ElCol :sm="24" :md="24" :lg="8">
        <TransactionList />
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :md="24" :lg="8">
        <RecentTransaction />
      </ElCol>
      <ElCol :md="24" :lg="16" class="no-margin-bottom">
        <HotProductsList />
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
  import Banner from './modules/banner.vue'
  import TotalOrderVolume from './modules/total-order-volume.vue'
  import TotalProducts from './modules/total-products.vue'
  import SalesTrend from './modules/sales-trend.vue'
  import SalesClassification from './modules/sales-classification.vue'
  import TransactionList from './modules/transaction-list.vue'
  import HotCommodity from './modules/hot-commodity.vue'
  import RecentTransaction from './modules/recent-transaction.vue'
  import AnnualSales from './modules/annual-sales.vue'
  import ProductSales from './modules/product-sales.vue'
  import SalesGrowth from './modules/sales-growth.vue'
  import CartConversionRate from './modules/cart-conversion-rate.vue'
  import HotProductsList from './modules/hot-products-list.vue'

  defineOptions({ name: 'Ecommerce' })
</script>
