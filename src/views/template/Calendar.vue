<template>
  <div class="page-content">
    <!-- 日历主体 -->
    <el-calendar v-model="currentDate">
      <template #date-cell="{ data }">
        <div
          class="calendar-cell"
          :class="{ 'is-selected': data.isSelected }"
          @click="handleCellClick(data.day)"
        >
          <!-- 日期显示 -->
          <p class="calendar-date">{{ formatDate(data.day) }}</p>

          <!-- 事件列表 -->
          <div class="calendar-events">
            <div
              v-for="event in getEvents(data.day)"
              :key="`${event.date}-${event.content}`"
              class="calendar-event"
              @click.stop="handleEventClick(event)"
            >
              <div class="event-tag" :class="[`${event.type || 'bg-primary'}`]">
                {{ event.content }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>

    <!-- 事件编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" @closed="resetForm">
      <el-form :model="eventForm" label-width="80px">
        <el-form-item label="活动标题" required>
          <el-input v-model="eventForm.content" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="事件颜色">
          <el-radio-group v-model="eventForm.type">
            <el-radio v-for="type in eventTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始日期" required>
          <el-date-picker
            style="width: 100%"
            v-model="eventForm.date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            style="width: 100%"
            v-model="eventForm.endDate"
            type="date"
            placeholder="选择结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :min-date="eventForm.date"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="isEditing" type="danger" @click="handleDeleteEvent"> 删除 </el-button>
          <el-button type="primary" @click="handleSaveEvent">
            {{ isEditing ? '更新' : '添加' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  // 类型定义
  interface CalendarEvent {
    date: string
    endDate?: string
    content: string
    type?: 'bg-primary' | 'bg-success' | 'bg-warning' | 'bg-danger'
  }

  // 常量定义
  const eventTypes = [
    { label: '基本', value: 'bg-primary' },
    { label: '成功', value: 'bg-success' },
    { label: '警告', value: 'bg-warning' },
    { label: '危险', value: 'bg-danger' }
  ] as const

  // 状态管理
  const currentDate = ref(new Date('2025-02-07'))
  const events = ref<CalendarEvent[]>([
    { date: '2025-02-01', content: '产品需求评审', type: 'bg-primary' },
    {
      date: '2025-02-03',
      endDate: '2025-02-05',
      content: '项目周报会议（跨日期）',
      type: 'bg-primary'
    },
    { date: '2025-02-10', content: '瑜伽课程', type: 'bg-success' },
    { date: '2025-02-15', content: '团队建设活动', type: 'bg-primary' },
    { date: '2025-02-20', content: '健身训练', type: 'bg-success' },
    { date: '2025-02-20', content: '代码评审', type: 'bg-danger' },
    { date: '2025-02-20', content: '团队午餐', type: 'bg-primary' },
    { date: '2025-02-20', content: '项目进度汇报', type: 'bg-warning' },
    { date: '2025-02-28', content: '月度总结会', type: 'bg-warning' }
  ])

  // 弹窗状态管理
  const dialogVisible = ref(false)
  const dialogTitle = ref('添加事件')
  const editingEventIndex = ref<number>(-1)
  const eventForm = ref<CalendarEvent>({
    date: '',
    endDate: '',
    content: '',
    type: 'bg-primary'
  })

  // 计算属性
  const isEditing = computed(() => editingEventIndex.value >= 0)

  // 工具函数
  const formatDate = (date: string) => date.split('-')[2]

  const getEvents = (day: string) => {
    return events.value.filter((event) => {
      const eventDate = new Date(event.date)
      const currentDate = new Date(day)
      const endDate = event.endDate ? new Date(event.endDate) : new Date(event.date)

      return currentDate >= eventDate && currentDate <= endDate
    })
  }

  const resetForm = () => {
    eventForm.value = {
      date: '',
      endDate: '',
      content: '',
      type: 'bg-primary'
    }
    editingEventIndex.value = -1
  }

  // 事件处理函数
  const handleCellClick = (day: string) => {
    dialogTitle.value = '添加事件'
    eventForm.value = {
      date: day,
      content: '',
      type: 'bg-primary'
    }
    editingEventIndex.value = -1
    dialogVisible.value = true
  }

  const handleEventClick = (event: CalendarEvent) => {
    dialogTitle.value = '编辑事件'
    eventForm.value = { ...event }
    editingEventIndex.value = events.value.findIndex(
      (e) => e.date === event.date && e.content === event.content
    )
    dialogVisible.value = true
  }

  const handleSaveEvent = () => {
    if (!eventForm.value.content || !eventForm.value.date) {
      return
    }

    if (isEditing.value) {
      events.value[editingEventIndex.value] = { ...eventForm.value }
    } else {
      events.value.push({ ...eventForm.value })
    }

    dialogVisible.value = false
    resetForm()
  }

  const handleDeleteEvent = () => {
    if (isEditing.value) {
      events.value.splice(editingEventIndex.value, 1)
      dialogVisible.value = false
      resetForm()
    }
  }
</script>

<style scoped lang="scss">
  .page-content {
    height: 100%;

    :deep(.el-calendar) {
      height: 100%;

      .el-calendar__body {
        height: calc(100% - 70px);
      }

      .el-calendar-table {
        height: 100%;

        .is-selected {
          // 选中日期的背景颜色
          background-color: var(--el-color-warning-light-9) !important;
        }

        .el-calendar-day {
          height: 100%;

          &:hover {
            background-color: transparent !important;
          }
        }
      }
    }
  }

  .calendar-cell {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 120px;
    max-height: 120px;
    padding: 4px;
    overflow: hidden;
    cursor: pointer;

    .calendar-date {
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 14px;
    }

    .calendar-events {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      max-height: 85px;
      padding-right: 4px;
      margin-top: 24px;
      overflow-y: auto;
    }

    .event-tag {
      min-width: 100px;
      padding: 6px 12px;
      overflow: hidden;
      font-size: 13px;
      font-weight: 500;
      line-height: 24px;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 4px;

      &:hover {
        opacity: 0.8;
      }

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 4px;
        height: 100%;
        content: '';
      }

      &.event-continues::after {
        position: absolute;
        top: 50%;
        right: 4px;
        font-size: 12px;
        content: '►';
        transform: translateY(-50%);
      }
    }
  }

  :deep(.el-dialog__body) {
    padding-top: 20px;
  }
</style>
