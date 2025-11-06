<template>
  <div class="art-card h-82 p-5 mb-5 overflow-hidden max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>热门产品</h4>
      </div>
    </div>
    <div class="overflow-auto h-full">
      <ArtTable
        :data="products"
        style="width: 100%"
        size="large"
        :border="false"
        :stripe="false"
        :header-cell-style="{ background: 'transparent' }"
      >
        <ElTableColumn prop="name" label="产品名称" width="200" />
        <ElTableColumn prop="popularity" label="销量">
          <template #default="scope">
            <ElProgress
              :percentage="scope.row.popularity"
              :color="getColor(scope.row.popularity)"
              :stroke-width="5"
              :show-text="false"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="sales" label="销量" width="80">
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
        </ElTableColumn>
      </ArtTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { hexToRgb } from '@/utils/ui'

  interface Product {
    name: string
    popularity: number
    sales: string
  }

  const COLOR_THRESHOLDS = {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75
  } as const

  const POPULARITY_COLORS = {
    LOW: '#00E096',
    MEDIUM: '#0095FF',
    HIGH: '#884CFF',
    VERY_HIGH: '#FE8F0E'
  } as const

  /**
   * 热门产品列表数据
   * 包含产品名称、热度和销量信息
   */
  const products = computed<Product[]>(() => [
    { name: '智能手机', popularity: 10, sales: '100' },
    { name: '笔记本电脑', popularity: 29, sales: '100' },
    { name: '平板电脑', popularity: 65, sales: '100' },
    { name: '智能手表', popularity: 32, sales: '100' },
    { name: '无线耳机', popularity: 78, sales: '100' },
    { name: '智能音箱', popularity: 41, sales: '100' }
  ])

  /**
   * 根据热度百分比获取对应的颜色
   * @param percentage 热度百分比 (0-100)
   * @returns 对应的颜色值
   */
  const getColor = (percentage: number): string => {
    if (percentage < COLOR_THRESHOLDS.LOW) return POPULARITY_COLORS.LOW
    if (percentage < COLOR_THRESHOLDS.MEDIUM) return POPULARITY_COLORS.MEDIUM
    if (percentage < COLOR_THRESHOLDS.HIGH) return POPULARITY_COLORS.HIGH
    return POPULARITY_COLORS.VERY_HIGH
  }
</script>
