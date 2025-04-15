<template>
  <div class="page-content state-page">
    <div class="tips">
      <img :src="data.imgUrl" />
      <div class="right-wrap">
        <p>{{ data.desc }}</p>
        <el-button color="#47A7FF" @click="backHome" v-ripple>{{ data.btnText }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { HOME_PAGE } from '@/router'
  const router = useRouter()

  defineProps({
    data: {
      type: Object as PropType<{
        title: string
        desc: string
        btnText: string
        imgUrl: string
      }>,
      required: true
    }
  })

  const backHome = () => {
    router.push(HOME_PAGE)
  }
</script>

<style lang="scss" scoped>
  .state-page {
    display: flex;
    background-color: transparent !important;
    border: 0 !important;

    .tips {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 5vh;
      margin: auto;

      img {
        width: 300px;
      }

      .right-wrap {
        width: 300px;
        margin-left: 100px;

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
