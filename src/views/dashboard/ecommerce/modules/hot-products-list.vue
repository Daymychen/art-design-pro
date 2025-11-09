<template>
  <div class="art-card p-5 h-[27.8rem] mb-5 overflow-hidden max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>热销产品</h4>
        <p>本月销售情况</p>
      </div>
    </div>

    <ElScrollbar style="height: 21.55rem" class="w-full">
      <ArtTable
        :data="tableData"
        style="margin-top: 0 !important"
        :border="false"
        :stripe="false"
        :header-cell-style="{ background: 'transparent' }"
      >
        <template #default>
          <ElTableColumn label="产品" prop="product" width="220px">
            <template #default="scope">
              <div class="flex-c">
                <img class="size-12.5 object-cover rounded-md" :src="scope.row.image" />
                <div class="flex flex-col ml-3">
                  <div class="font-medium">{{ scope.row.name }}</div>
                  <div class="text-xs text-slate-500">{{ scope.row.category }}</div>
                </div>
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="价格" prop="price">
            <template #default="scope">
              <span class="font-semibold">¥{{ scope.row.price.toLocaleString() }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="库存" prop="stock">
            <template #default="scope">
              <div
                class="inline-block px-2 py-1 text-xs font-medium rounded"
                :class="getStockClass(scope.row.stock)"
              >
                {{ getStockStatus(scope.row.stock) }}
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="销量" prop="sales" />
          <ElTableColumn label="销售趋势" width="240">
            <template #default="scope">
              <ElProgress :percentage="scope.row.pro" :color="scope.row.color" :stroke-width="4" />
            </template>
          </ElTableColumn>
        </template>
      </ArtTable>
    </ElScrollbar>
  </div>
</template>

<script setup lang="ts">
  import product1 from '@/assets/images/3d/icon1.webp'
  import product2 from '@/assets/images/3d/icon2.webp'
  import product3 from '@/assets/images/3d/icon3.webp'
  import product4 from '@/assets/images/3d/icon4.webp'
  import product5 from '@/assets/images/3d/icon5.webp'
  import product6 from '@/assets/images/3d/icon6.webp'

  interface ProductItem {
    name: string
    category: string
    price: number
    stock: number
    sales: number
    percentage: number
    pro: number
    color: string
    image: string
  }

  const ANIMATION_DELAY = 100
  const STOCK_THRESHOLD = {
    LOW: 20,
    MEDIUM: 50
  } as const

  /**
   * 热销产品表格数据
   * 包含产品信息、库存、销量和销售趋势
   */
  const tableData = reactive<ProductItem[]>([
    {
      name: '智能手表 Pro',
      category: '电子设备',
      price: 1299,
      stock: 156,
      sales: 423,
      percentage: 75,
      pro: 0,
      color: 'var(--art-primary)',
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
      color: 'var(--art-success)',
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
      color: 'var(--art-warning)',
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
      color: 'var(--art-error)',
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
      color: 'var(--art-info)',
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
      color: 'var(--art-secondary)',
      image: product6
    }
  ])

  /**
   * 根据库存数量获取状态文本
   * @param stock 库存数量
   * @returns 库存状态文本
   */
  const getStockStatus = (stock: number): string => {
    if (stock === 0) return '缺货'
    if (stock < STOCK_THRESHOLD.LOW) return '低库存'
    if (stock < STOCK_THRESHOLD.MEDIUM) return '适中'
    return '充足'
  }

  /**
   * 根据库存数量获取状态样式类名
   * @param stock 库存数量
   * @returns CSS 类名
   */
  const getStockClass = (stock: number): string => {
    if (stock === 0) return 'text-danger bg-danger/12'
    if (stock < STOCK_THRESHOLD.LOW) return 'text-warning bg-warning/12'
    if (stock < STOCK_THRESHOLD.MEDIUM) return 'text-info bg-info/12'
    return 'text-success bg-success/12'
  }

  /**
   * 添加进度条动画效果
   * 延迟后将进度值从 0 更新到目标百分比，触发动画
   */
  const addAnimation = (): void => {
    setTimeout(() => {
      tableData.forEach((item) => {
        item.pro = item.percentage
      })
    }, ANIMATION_DELAY)
  }

  onMounted(() => {
    addAnimation()
  })
</script>
