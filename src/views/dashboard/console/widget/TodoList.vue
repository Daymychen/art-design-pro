<template>
  <div class="card art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">代办事项</h4>
        <p class="subtitle">待处理<span class="text-danger">3</span></p>
      </div>
    </div>

    <div class="list">
      <div v-for="(item, index) in list" :key="index">
        <p class="title">{{ item.username }}</p>
        <p class="date subtitle">{{ item.date }}</p>
        <el-checkbox v-model="item.complate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue-demi'

  const list = reactive([
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

<style lang="scss" scoped>
  .card {
    box-sizing: border-box;
    width: 100%;
    height: 510px;
    padding: 0 25px;

    .list {
      height: calc(100% - 90px);
      margin-top: 10px;
      overflow: hidden;

      > div {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 70px;
        overflow: hidden;
        border-bottom: 1px solid var(--art-border-color);

        p {
          font-size: 13px;
        }

        .title {
          font-size: 14px;
        }

        .date {
          margin-top: 6px;
          font-size: 12px;
          font-weight: 400;
        }

        .el-checkbox {
          position: absolute;
          top: 0;
          right: 10px;
          bottom: 0;
          margin: auto;
        }
      }
    }
  }
</style>
