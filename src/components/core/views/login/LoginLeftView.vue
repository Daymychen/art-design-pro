<template>
  <div class="left-view">
    <div class="logo">
      <ArtLogo class="icon" />
      <h1 class="title">{{ AppConfig.systemInfo.name }}</h1>
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
  import AppConfig from '@/config'
</script>

<style lang="scss" scoped>
  @use '@/views/auth/login/index' as login;
</style>
