<template>
  <div class="login-left-view">
    <div class="logo">
      <ArtLogo class="icon" />
      <h1 class="title">{{ AppConfig.systemInfo.name }}</h1>
    </div>
    <img class="left-bg" src="@imgs/login/lf_bg.webp" />
    <img class="left-img" src="@imgs/login/lf_icon2.webp" />

    <div class="text-wrap">
      <h1> {{ $t('login.leftView.title') }} </h1>
      <p> {{ $t('login.leftView.subTitle') }} </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
</script>

<style lang="scss" scoped>
  .login-left-view {
    position: relative;
    box-sizing: border-box;
    width: 50vw;
    height: 100%;
    padding: 20px;
    overflow: hidden;
    background: #f3f4fb;
    background-size: cover;

    .logo {
      position: relative;
      z-index: 100;
      display: flex;
      align-items: center;

      .title {
        margin: 3px 0 0 10px;
        font-size: 20px;
        font-weight: 400;
        color: var(--art-text-gray-100);
      }
    }

    .left-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .left-img {
      position: relative;
      z-index: 10;
      display: block;
      width: 500px;
      margin: auto;
      margin-top: 15vh;
    }

    .text-wrap {
      position: absolute;
      bottom: 80px;
      width: 100%;
      text-align: center;

      h1 {
        font-size: 26px;
        font-weight: 400;
        color: #f9f9f9;
      }

      p {
        margin-top: 10px;
        font-size: 14px;
        color: #c4cada;
      }
    }

    @media only screen and (max-width: $device-notebook) {
      .left-img {
        width: 480px;
        margin-top: 10vh;
      }

      .text-wrap {
        bottom: 40px;
      }
    }

    @media only screen and (max-width: $device-ipad-pro) {
      display: none;
    }
  }
</style>
