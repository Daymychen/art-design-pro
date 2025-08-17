<template>
  <div class="page-content state-page">
    <div class="tips">
      <ThemeSvg :src="data.imgUrl" size="100%" />
      <div class="right-wrap">
        <p>{{ data.desc }}</p>
        <el-button type="primary" size="large" @click="backHome" v-ripple>{{
          data.btnText
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCommon } from '@/composables/useCommon'

  const router = useRouter()

  interface ExceptionData {
    /** 标题 */
    title: string
    /** 描述 */
    desc: string
    /** 按钮文本 */
    btnText: string
    /** 图片地址 */
    imgUrl: string
  }

  withDefaults(
    defineProps<{
      data: ExceptionData
    }>(),
    {}
  )

  const backHome = () => {
    router.push(useCommon().homePath.value)
  }
</script>

<style lang="scss" scoped>
  .state-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: transparent !important;
    border: 0 !important;

    .tips {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 300px;
      }

      .right-wrap {
        width: 300px;
        margin-left: 60px;

        p {
          font-size: 20px;
          line-height: 28px;
          color: var(--art-gray-600);
        }

        .el-button {
          margin-top: 20px;
        }
      }
    }
  }

  @media only screen and (max-width: $device-ipad-vertical) {
    .state-page {
      .tips {
        display: block;
        text-align: center;

        img {
          width: 200px;
        }

        .right-wrap {
          width: 100%;
          margin: auto;
          text-align: center;

          p {
            margin-top: 40px;
            font-size: 18px;
          }
        }
      }
    }
  }
</style>
