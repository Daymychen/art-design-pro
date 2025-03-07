<template>
  <BasicBanner
    class="banner"
    :title="`欢迎回来 ${userInfo.username}`"
    :showButton="false"
    backgroundColor="var(--el-color-primary-light-9)"
    titleColor="var(--art-gray-900)"
    subtitleColor="#666"
    style="height: 13.3rem"
    :backgroundImage="bannerCover"
    :showDecoration="false"
    imgWidth="18rem"
    imgBottom="-7.5rem"
    @click="handleBannerClick"
  >
    <div class="banner-slot">
      <div class="item">
        <p class="title">¥2,340<i class="iconfont-sys text-success">&#xe8d5;</i></p>
        <p class="subtitle">今日销售额</p>
      </div>
      <div class="item">
        <p class="title">35%<i class="iconfont-sys text-success">&#xe8d5;</i></p>
        <p class="subtitle">较昨日</p>
      </div>
    </div>
  </BasicBanner>
</template>

<script setup lang="ts">
  import bannerCover from '@imgs/login/lf_icon2.png'
  import { useUserStore } from '@/store/modules/user'
  const userStore = useUserStore()

  const userInfo = computed(() => userStore.getUserInfo)

  const handleBannerClick = () => {}
</script>

<style lang="scss" scoped>
  .banner {
    .banner-slot {
      display: flex;

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
