<template>
  <div class="custom-card art-custom-card top-products">
    <div class="custom-card-header">
      <span class="title">热门产品</span>
    </div>
    <div class="custom-card-body">
      <art-table
        :data="products"
        style="width: 100%"
        :pagination="false"
        size="large"
        :border="false"
        :stripe="false"
        :show-header-background="false"
      >
        <el-table-column prop="name" label="产品名称" width="200" />
        <el-table-column prop="popularity" label="销量">
          <template #default="scope">
            <el-progress
              :percentage="scope.row.popularity"
              :color="getColor(scope.row.popularity)"
              :stroke-width="5"
              :show-text="false"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="80">
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
  import { hexToRgb } from '@/utils/ui'

  const products = computed(() => [
    {
      name: '智能手机',
      popularity: 10,
      sales: '100'
    },
    {
      name: '笔记本电脑',
      popularity: 29,
      sales: '100'
    },
    {
      name: '平板电脑',
      popularity: 65,
      sales: '100'
    },
    {
      name: '智能手表',
      popularity: 32,
      sales: '100'
    },
    {
      name: '无线耳机',
      popularity: 78,
      sales: '100'
    },
    {
      name: '智能音箱',
      popularity: 41,
      sales: '100'
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
