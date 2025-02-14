<template>
  <div class="region dynamic art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">动态</h4>
        <p class="subtitle">新增<span class="text-success">+6</span></p>
      </div>
    </div>

    <div class="list">
      <div v-for="(item, index) in list" :key="index">
        <span class="user">{{ item.username }}</span>
        <span class="type">{{ item.type }}</span>
        <span class="target">{{ item.target }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue-demi'

  const list = reactive([
    {
      username: '中小鱼',
      type: '关注了',
      target: '誶誶淰'
    },
    {
      username: '何小荷',
      type: '发表文章',
      target: 'Vue3 + Typescript + Vite 项目实战笔记'
    },
    {
      username: '誶誶淰',
      type: '提出问题',
      target: '主题可以配置吗'
    },
    {
      username: '发呆草',
      type: '兑换了物品',
      target: '《奇特的一生》'
    },
    {
      username: '甜筒',
      type: '关闭了问题',
      target: '发呆草'
    },
    {
      username: '冷月呆呆',
      type: '兑换了物品',
      target: '《高效人士的七个习惯》'
    }
  ])
</script>

<style lang="scss" scoped>
  .dynamic {
    box-sizing: border-box;
    flex: 1;
    padding: 0 25px;
    margin-left: var(--console-margin);

    .header {
      display: flex;
      justify-content: space-between;
      padding: 20px 0 0;
    }

    .list {
      height: calc(100% - 100px);
      margin-top: 10px;
      overflow: hidden;

      > div {
        height: 70px;
        overflow: hidden;
        line-height: 70px;
        border-bottom: 1px solid var(--art-border-color);

        span {
          font-size: 13px;
        }

        .user {
          font-weight: 500;
          color: var(--art-text-gray-800);
        }

        .type {
          margin: 0 8px;
        }

        .target {
          color: var(--main-color);
        }
      }
    }
  }
</style>
