<template>
  <ArtBasicBanner
    class="banner"
    height="13.3rem"
    :title="`欢迎回来 ${userInfo.userName}`"
    backgroundColor="var(--el-color-primary-light-9)"
    titleColor="var(--art-gray-900)"
    :decoration="false"
    :meteorConfig="{
      enabled: true,
      count: 10
    }"
    :buttonConfig="{
      show: false,
      text: ''
    }"
    :imageConfig="{
      src: bannerCover,
      width: '18rem',
      bottom: '-7.5rem'
    }"
    @click="handleBannerClick"
  >
    <div class="banner-slot">
      <div class="item">
        <p class="title">
          <ArtCountTo
            class="number box-title"
            :target="2340"
            :duration="1500"
            prefix="¥"
            separator=","
          />
          <i class="iconfont-sys text-success">&#xe8d5;</i>
        </p>
        <p class="subtitle">今日销售额</p>
      </div>
      <div class="item">
        <p class="title">
          <ArtCountTo class="number box-title" :target="35" :duration="1500" suffix="%" />
          <i class="iconfont-sys text-success">&#xe8d5;</i>
        </p>
        <p class="subtitle">较昨日</p>
      </div>
    </div>
  </ArtBasicBanner>
</template>

<script setup lang="ts">
  import bannerCover from '@imgs/login/lf_icon2.webp'
  import { useUserStore } from '@/store/modules/user'
  const userStore = useUserStore()

  const userInfo = computed(() => userStore.getUserInfo)

  const handleBannerClick = () => {}
</script>

<style lang="scss" scoped>
  .banner {
    justify-content: center;

    .banner-slot {
      display: flex;
      margin-top: 24px;

      .item {
        margin-right: 30px;

        &:first-of-type {
          padding-right: 30px;
          border-right: 1px solid var(--art-gray-300);
        }

        .title {
          font-size: 30px;
          color: var(--art-gray-900) !important;

          i {
            position: relative;
            top: -10px;
            margin-left: 10px;
            font-size: 16px;
          }
        }

        .subtitle {
          margin-top: 4px;
          font-size: 14px;
          color: var(--art-gray-700) !important;
        }
      }
    }
  }
</style>
