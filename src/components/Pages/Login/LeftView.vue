<template>
  <div class="left-view">
    <div class="logo">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconsys-zhaopian-copy"></use>
      </svg>
      <h1 class="title">{{ systemName }}</h1>
    </div>
    <img class="left-bg" src="@imgs/login/lf_bg.png" />
    <img class="left-img" src="@imgs/login/lf_icon2.png" />

    <div class="text-wrap">
      <h1> {{ $t('login.leftView.title') }} </h1>
      <p> {{ $t('login.leftView.subTitle') }} </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SystemInfo } from '@/config/setting'

  const systemName = SystemInfo.name
</script>

<style lang="scss" scoped>
  @use '@/views/login/index' as login;
</style>
