<template>
  <div class="page-content" :class="type">
    <i class="iconfont-sys icon" v-html="iconCode"></i>
    <h1 class="title">{{ title }}</h1>
    <p class="msg">{{ message }}</p>
    <div class="res">
      <slot name="content"></slot>
    </div>
    <div class="btn-group">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtResultPage' })

  interface ResultPageProps {
    /** 成功/失败 */
    type: 'success' | 'fail'
    /** 标题 */
    title: string
    /** 消息 */
    message: string
    /** 图标 */
    iconCode: string
  }

  withDefaults(defineProps<ResultPageProps>(), {
    type: 'success',
    title: '',
    message: '',
    iconCode: ''
  })
</script>

<style lang="scss" scoped>
  .page-content {
    box-sizing: border-box;
    padding: 15px 100px !important;
    text-align: center;

    .icon {
      display: block;
      margin-top: 6vh;
      font-size: 80px;
    }

    .title {
      margin-top: 20px;
      font-size: 30px;
      font-weight: 500;
      color: var(--art-text-gray-900) !important;
    }

    .msg {
      margin-top: 20px;
      font-size: 16px;
      color: #808695;
    }

    :deep(.res) {
      padding: 22px 30px;
      margin-top: 30px;
      text-align: left;
      background-color: #f8f8f9;
      border-radius: 5px;

      p {
        display: flex;
        align-items: center;
        padding: 8px 0;
        font-size: 15px;
        color: #808695;

        i {
          margin-right: 5px;
        }
      }
    }

    .btn-group {
      margin-top: 50px;
    }
  }

  .success {
    .icon {
      color: #19be6b !important;
    }
  }

  .fail {
    .icon {
      color: #ed4014 !important;
    }

    :deep(.res) {
      p {
        i {
          color: #ed4014;
        }
      }
    }
  }

  .dark {
    .page-content {
      .res {
        background: #28282a;
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .page-content {
      padding: 15px 25px !important;

      .icon {
        margin-top: 4vh;
        font-size: 60px;
      }

      .title {
        margin-top: 10px;
        font-size: 25px;
      }

      .res {
        padding: 10px 30px;
      }
    }
  }
</style>
