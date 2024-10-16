<template>
  <div class="custom-card top-products">
    <div class="custom-card-header">
      <span class="title custom-text">Top Products</span>
    </div>
    <div class="custom-card-body">
      <el-table :data="products" style="width: 100%">
        <el-table-column prop="name" label="Name" width="200" />
        <el-table-column prop="popularity" label="Popularity">
          <template #default="scope">
            <el-progress
              :percentage="scope.row.popularity"
              :color="getColor(scope.row.popularity)"
              :stroke-width="5"
              :show-text="false"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="Sales" width="80">
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
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { hexToRgb } from '@/utils/color'
  import { ref } from 'vue'

  const products = ref([
    { name: 'Home Decor Range', popularity: 10, sales: '10%' },
    { name: 'Disney Princess Pink Bag 18"', popularity: 29, sales: '29%' },
    { name: 'Bathroom Essentials', popularity: 65, sales: '65%' },
    { name: 'Apple Smartwatches', popularity: 32, sales: '32%' },
    { name: 'Fitness Tracker', popularity: 78, sales: '78%' },
    { name: 'Wireless Earbuds', popularity: 41, sales: '41%' }
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
