<template>
  <div class="card art-custom-card weekly-card" style="height: 28.2rem">
    <div class="card-header">
      <p class="title">热销商品</p>
      <p class="subtitle">本周销售排行</p>
    </div>
    <LineChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :showAreaColor="true"
      :data="[8, 40, 82, 35, 90, 52, 35]"
      height="9rem"
    />
    <div class="content">
      <div class="item" v-for="item in weeklyList" :key="item.title">
        <div class="icon" :class="item.color">
          <i class="iconfont-sys">&#xe718;</i>
        </div>
        <div class="text">
          <p class="title">{{ item.title }}</p>
          <span class="subtitle">{{ item.subtitle }}</span>
        </div>
        <div class="value" :class="item.color">
          <span>+{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const weeklyList = [
    {
      icon: '&#xe718;',
      title: '智能手表Pro',
      subtitle: '电子产品',
      value: '1,286件',
      color: 'bg-primary'
    },
    {
      icon: '&#xe70c;',
      title: '时尚连衣裙',
      subtitle: '女装服饰',
      value: '892件',
      color: 'bg-success'
    },
    {
      icon: '&#xe813;',
      title: '厨房小家电',
      subtitle: '家居用品',
      value: '756件',
      color: 'bg-error'
    }
  ]
</script>

<style lang="scss" scoped>
  .weekly-card {
    .content {
      margin-top: 40px;

      .item {
        display: flex;
        align-items: center;
        margin-top: 20px;

        .icon {
          width: 42px;
          height: 42px;
          line-height: 42px;
          text-align: center;
          background-color: var(--el-color-primary-light-9);
          border-radius: 8px;

          i {
            font-size: 20px;
          }
        }

        .text {
          margin-left: 10px;

          .title {
            font-size: 14px;
            font-weight: 500;
            color: var(--art-gray-800);
          }

          .subtitle {
            font-size: 14px;
            color: var(--art-gray-600);
          }
        }

        .value {
          padding: 6px 12px;
          margin-left: auto;
          font-size: 14px;
          text-align: center;
          background-color: var(--el-color-primary-light-9);
          border-radius: 4px;
        }
      }
    }
  }
</style>
