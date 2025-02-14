<template>
  <div class="custom-card art-custom-card top-products">
    <div class="custom-card-header">
      <span class="title">{{ t('analysis.topProducts.title') }}</span>
    </div>
    <div class="custom-card-body">
      <art-table :data="products" style="width: 100%" :pagination="false">
        <el-table-column prop="name" :label="t('analysis.topProducts.columns.name')" width="200" />
        <el-table-column prop="popularity" :label="t('analysis.topProducts.columns.popularity')">
          <template #default="scope">
            <el-progress
              :percentage="scope.row.popularity"
              :color="getColor(scope.row.popularity)"
              :stroke-width="5"
              :show-text="false"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sales" :label="t('analysis.topProducts.columns.sales')" width="80">
          <template #default="scope">
            <span
              :style="{
                color: getColor(scope.row.popularity),
                backgroundColor: `rgba(${hexToRgb(getColor(scope.row.popularity))}, 0.08)`,
                border: '1px solid',
                padding: '3px 6px',
                borderRadius: '4px',
                fontSize: '12px'
              }"
              >{{ scope.row.sales }}</span
            >
          </template>
        </el-table-column>
      </art-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { hexToRgb } from '@/utils/color'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  // 使用 computed 来创建响应式的产品数据
  const products = computed(() => [
    {
      name: t('analysis.topProducts.products.homeDecor.name'),
      popularity: 10,
      sales: t('analysis.topProducts.products.homeDecor.sales')
    },
    {
      name: t('analysis.topProducts.products.disneyBag.name'),
      popularity: 29,
      sales: t('analysis.topProducts.products.disneyBag.sales')
    },
    {
      name: t('analysis.topProducts.products.bathroom.name'),
      popularity: 65,
      sales: t('analysis.topProducts.products.bathroom.sales')
    },
    {
      name: t('analysis.topProducts.products.smartwatch.name'),
      popularity: 32,
      sales: t('analysis.topProducts.products.smartwatch.sales')
    },
    {
      name: t('analysis.topProducts.products.fitness.name'),
      popularity: 78,
      sales: t('analysis.topProducts.products.fitness.sales')
    },
    {
      name: t('analysis.topProducts.products.earbuds.name'),
      popularity: 41,
      sales: t('analysis.topProducts.products.earbuds.sales')
    }
  ])

  const getColor = (percentage: number) => {
    if (percentage < 25) return '#00E096'
    if (percentage < 50) return '#0095FF'
    if (percentage < 75) return '#884CFF'
    return '#FE8F0E'
  }
</script>

<style lang="scss" scoped>
  .custom-card {
    height: 330px;
    overflow-y: scroll;

    // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }

    &-body {
      padding: 0 6px;
    }
  }

  @media (width <= 1200px) {
    .custom-card {
      height: auto;
    }
  }
</style>
