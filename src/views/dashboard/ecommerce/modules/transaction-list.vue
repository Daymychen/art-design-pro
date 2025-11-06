<template>
  <ArtDataListCard
    class="mb-5 max-sm:mb-4"
    :maxCount="4"
    :list="dataList"
    title="最近活动"
    subtitle="订单处理状态"
    :showMoreButton="true"
    @more="handleMore"
  />
</template>

<script setup lang="ts">
  interface TransactionItem {
    title: string
    status: string
    time: string
    class: string
    icon: string
  }

  /**
   * 最近活动数据列表
   * 展示订单处理、退款申请、投诉处理等业务活动状态
   */
  const dataList: TransactionItem[] = [
    {
      title: '新订单 #38291',
      status: '待处理',
      time: '5分钟',
      class: 'bg-theme/12 text-theme',
      icon: 'ri:shopping-bag-4-line'
    },
    {
      title: '退款申请 #12845',
      status: '处理中',
      time: '10分钟',
      class: 'bg-secondary/12 text-secondary',
      icon: 'ri:profile-line'
    },
    {
      title: '客户投诉处理',
      status: '待处理',
      time: '15分钟',
      class: 'bg-warning/12 text-warning',
      icon: 'ri:customer-service-2-line'
    },
    {
      title: '库存不足提醒',
      status: '紧急',
      time: '20分钟',
      class: 'bg-danger/12 text-danger',
      icon: 'ri:box-1-line'
    },
    {
      title: '订单 #29384 已发货',
      status: '已完成',
      time: '20分钟',
      class: 'bg-success/12 text-success',
      icon: 'ri:shopping-bag-3-line'
    }
  ]

  /**
   * 处理查看更多按钮点击事件
   */
  const handleMore = (): void => {
    // TODO: 添加查看更多逻辑
  }
</script>
