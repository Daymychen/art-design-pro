<template>
  <div class="card art-custom-card" style="height: 27.8rem">
    <div class="card-header">
      <p class="title">热销产品</p>
      <p class="subtitle">本月销售情况</p>
    </div>
    <div class="table">
      <el-scrollbar style="height: 21.55rem">
        <art-table :data="tableData" :pagination="false" style="margin-top: 0 !important">
          <template #default>
            <el-table-column label="产品" prop="product" width="220px">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <img class="product-image" :src="scope.row.image" />
                  <div class="product-info">
                    <div class="product-name">{{ scope.row.name }}</div>
                    <div class="product-category">{{ scope.row.category }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="价格" prop="price">
              <template #default="scope">
                <span class="price">¥{{ scope.row.price.toLocaleString() }}</span>
              </template>
            </el-table-column>
            <el-table-column label="库存" prop="stock">
              <template #default="scope">
                <div class="stock-badge" :class="getStockClass(scope.row.stock)">
                  {{ getStockStatus(scope.row.stock) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="销量" prop="sales" />
            <el-table-column label="销售趋势" width="240">
              <template #default="scope">
                <el-progress
                  :percentage="scope.row.pro"
                  :color="scope.row.color"
                  :stroke-width="4"
                />
              </template>
            </el-table-column>
          </template>
        </art-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted } from 'vue'

  // 导入产品图片
  import product1 from '@/assets/img/3d/icon1.png'
  import product2 from '@/assets/img/3d/icon2.png'
  import product3 from '@/assets/img/3d/icon3.png'
  import product4 from '@/assets/img/3d/icon4.png'
  import product5 from '@/assets/img/3d/icon5.png'
  import product6 from '@/assets/img/3d/icon6.png'

  const tableData = reactive([
    {
      name: '智能手表 Pro',
      category: '电子设备',
      price: 1299,
      stock: 156,
      sales: 423,
      percentage: 75,
      pro: 0,
      color: 'rgb(var(--art-primary)) !important',
      image: product1
    },
    {
      name: '无线蓝牙耳机',
      category: '音频设备',
      price: 499,
      stock: 89,
      sales: 652,
      percentage: 85,
      pro: 0,
      color: 'rgb(var(--art-success)) !important',
      image: product2
    },
    {
      name: '机械键盘',
      category: '电脑配件',
      price: 399,
      stock: 12,
      sales: 238,
      percentage: 45,
      pro: 0,
      color: 'rgb(var(--art-warning)) !important',
      image: product3
    },
    {
      name: '超薄笔记本电脑',
      category: '电子设备',
      price: 5999,
      stock: 0,
      sales: 126,
      percentage: 30,
      pro: 0,
      color: 'rgb(var(--art-error)) !important',
      image: product4
    },
    {
      name: '智能音箱',
      category: '智能家居',
      price: 799,
      stock: 45,
      sales: 321,
      percentage: 60,
      pro: 0,
      color: 'rgb(var(--art-info)) !important',
      image: product5
    },
    {
      name: '游戏手柄',
      category: '游戏配件',
      price: 299,
      stock: 78,
      sales: 489,
      percentage: 70,
      pro: 0,
      color: 'rgb(var(--art-secondary)) !important',
      image: product6
    }
  ])

  // 根据库存获取状态文本
  const getStockStatus = (stock: number) => {
    if (stock === 0) return '缺货'
    if (stock < 20) return '低库存'
    if (stock < 50) return '适中'
    return '充足'
  }

  // 根据库存获取状态类名
  const getStockClass = (stock: number) => {
    if (stock === 0) return 'out-of-stock'
    if (stock < 20) return 'low-stock'
    if (stock < 50) return 'medium-stock'
    return 'in-stock'
  }

  onMounted(() => {
    addAnimation()
  })

  const addAnimation = () => {
    setTimeout(() => {
      for (let i = 0; i < tableData.length; i++) {
        let item = tableData[i]
        tableData[i].pro = item.percentage
      }
    }, 100)
  }
</script>

<style lang="scss" scoped>
  .table {
    width: 100%;

    .card-header {
      padding-left: 25px !important;
    }

    .product-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 6px;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
    }

    .product-name {
      font-weight: 500;
    }

    .product-category {
      font-size: 12px;
      color: #64748b;
    }

    .price {
      font-weight: 600;
    }

    .stock-badge {
      display: inline-block;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 4px;
    }

    .in-stock {
      color: rgb(var(--art-success));
      background-color: rgba(var(--art-success-rgb), 0.1);
    }

    .medium-stock {
      color: rgb(var(--art-info));
      background-color: rgba(var(--art-info-rgb), 0.1);
    }

    .low-stock {
      color: rgb(var(--art-warning));
      background-color: rgba(var(--art-warning-rgb), 0.1);
    }

    .out-of-stock {
      color: rgb(var(--art-error));
      background-color: rgba(var(--art-error-rgb), 0.1);
    }
  }
</style>
