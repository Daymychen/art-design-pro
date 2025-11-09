<template>
  <div class="art-card h-128 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>代办事项</h4>
        <p>待处理<span class="text-danger">3</span></p>
      </div>
    </div>

    <div class="h-[calc(100%-40px)] overflow-auto">
      <ElScrollbar>
        <div
          class="flex-cb h-17.5 border-b border-g-300 text-sm last:border-b-0"
          v-for="(item, index) in list"
          :key="index"
        >
          <div>
            <p class="text-sm">{{ item.username }}</p>
            <p class="text-g-500 mt-1">{{ item.date }}</p>
          </div>
          <ElCheckbox v-model="item.complate" />
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface TodoItem {
    username: string
    date: string
    complate: boolean
  }

  /**
   * 待办事项列表
   * 记录每日工作任务及完成状态
   */
  const list = reactive<TodoItem[]>([
    {
      username: '查看今天工作内容',
      date: '上午 09:30',
      complate: true
    },
    {
      username: '回复邮件',
      date: '上午 10:30',
      complate: true
    },
    {
      username: '工作汇报整理',
      date: '上午 11:00',
      complate: true
    },
    {
      username: '产品需求会议',
      date: '下午 02:00',
      complate: false
    },
    {
      username: '整理会议内容',
      date: '下午 03:30',
      complate: false
    },
    {
      username: '明天工作计划',
      date: '下午 06:30',
      complate: false
    }
  ])
</script>
