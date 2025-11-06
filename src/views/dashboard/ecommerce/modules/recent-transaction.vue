<template>
  <ArtTimelineListCard
    :list="timelineData"
    title="最近交易"
    subtitle="今日订单动态"
    class="h-[27.8rem] mb-5 max-sm:mb-4"
  />
</template>

<script setup lang="ts">
  interface TimelineItem {
    time: string
    status: string
    content: string
    code?: string
  }

  /**
   * 最近交易时间线数据
   * 记录今日订单处理、商品上架、支付等关键活动
   */
  const timelineData: TimelineItem[] = [
    {
      time: '上午 09:30',
      status: 'rgb(73, 190, 255)',
      content: '收到订单 #38291 支付 ¥385.90'
    },
    {
      time: '上午 10:00',
      status: 'rgb(54, 158, 255)',
      content: '新商品上架',
      code: 'SKU-3467'
    },
    {
      time: '上午 12:00',
      status: 'rgb(103, 232, 207)',
      content: '向供应商支付了 ¥6495.00'
    },
    {
      time: '下午 14:30',
      status: 'rgb(255, 193, 7)',
      content: '促销活动开始',
      code: 'PROMO-2023'
    },
    {
      time: '下午 15:45',
      status: 'rgb(255, 105, 105)',
      content: '订单取消提醒',
      code: 'ORD-9876'
    },
    {
      time: '下午 17:00',
      status: 'rgb(103, 232, 207)',
      content: '完成日销售报表'
    }
  ]
</script>
