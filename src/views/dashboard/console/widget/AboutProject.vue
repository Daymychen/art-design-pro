<template>
  <div class="card about-project art-custom-card">
    <div>
      <h2 class="box-title">关于项目</h2>
      <p>{{ systemName }} 是一款专注于用户体验和视觉设计的后台管理系统模版</p>
      <p>使用了 Vue3、TypeScript、Vite、Element Plus 等前沿技术</p>

      <div class="button-wrap">
        <div class="btn art-custom-card" @click="goPage(WEB_LINKS.DOCS)">
          <span>项目官网</span>
          <i class="iconfont-sys">&#xe703;</i>
        </div>
        <div class="btn art-custom-card" @click="goPage(WEB_LINKS.INTRODUCE)">
          <span>文档</span>
          <i class="iconfont-sys">&#xe703;</i>
        </div>
        <div class="btn art-custom-card" @click="goPage(WEB_LINKS.GITHUB_HOME)">
          <span>Github</span>
          <i class="iconfont-sys">&#xe703;</i>
        </div>
        <div class="btn art-custom-card" @click="goPage(WEB_LINKS.BLOG)">
          <span>博客</span>
          <i class="iconfont-sys">&#xe703;</i>
        </div>
      </div>
    </div>
    <img class="right-img" src="@imgs/draw/draw1.png" alt="draw1" />
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { WEB_LINKS } from '@/utils/constants'

  const systemName = AppConfig.systemInfo.name

  const goPage = (url: string) => {
    window.open(url)
  }
</script>

<style lang="scss" scoped>
  .about-project {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 300px;
    padding: 20px;

    h2 {
      margin-top: 10px;
      font-size: 20px;
      font-weight: 500;
      color: var(--art-gray-900) !important;
    }

    p {
      margin-top: 5px;
      font-size: 14px;
      color: var(--art-gray-600);
    }
  }

  .button-wrap {
    display: flex;
    flex-wrap: wrap;
    width: 600px;
    margin-top: 35px;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 240px;
    height: 50px;
    padding: 0 15px;
    margin: 0 15px 15px 0;
    font-size: 14px;
    color: var(--art-gray-800);
    cursor: pointer;
    background: var(--art-bg-color);
    border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 5px 10px rgb(0 0 0 / 5%);
      transform: translateY(-4px);
    }
  }

  // 响应式设计 - iPad Pro及以下
  @media screen and (max-width: $device-ipad-pro) {
    .about-project {
      height: auto;
    }

    .button-wrap {
      width: 470px;
      margin-top: 20px;
    }

    .btn {
      width: 180px;
    }

    .right-img {
      width: 300px;
      height: 230px;
    }
  }

  // 响应式设计 - iPad垂直及以下
  @media screen and (max-width: $device-ipad-vertical) {
    .button-wrap {
      width: 100%;
    }

    .btn {
      width: 190px;
    }

    .right-img {
      display: none;
    }
  }

  // 响应式设计 - 手机端
  @media screen and (max-width: $device-phone) {
    .about-project {
      padding: 0 15px;
    }

    .btn {
      width: 100%;
      margin-right: 0;
    }
  }
</style>
