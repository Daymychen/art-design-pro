<template>
  <div class="art-card h-128 p-5 mb-5">
    <div class="art-card-header">
      <div class="title">
        <h4>动态</h4>
        <p>新增<span class="text-success">+6</span></p>
      </div>
    </div>

    <div class="h-9/10 mt-2 overflow-hidden">
      <div
        class="h-17.5 leading-17.5 border-b border-g-300 text-sm overflow-hidden last:border-b-0"
        v-for="(item, index) in list"
        :key="index"
      >
        <span class="text-g-800 font-medium">{{ item.username }}</span>
        <span class="mx-2 text-g-600">{{ item.type }}</span>
        <span class="text-theme">{{ item.target }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface DynamicItem {
    username: string
    type: string
    target: string
  }

  /**
   * 用户动态列表
   * 记录用户的关注、发文、提问、兑换等各类活动
   */
  const list = reactive<DynamicItem[]>([
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
