<template>
  <div class="page-content fail">
    <i class="iconfont-sys icon">&#xe665;</i>
    <h1 class="title">提交失败</h1>
    <p class="msg">请核对并修改以下信息后，再重新提交。</p>
    <div class="res">
      <p>您提交的内容有如下错误：</p>
      <p><i class="iconfont-sys">&#xe71a;</i>您的账户已被冻结</p>
      <p><i class="iconfont-sys">&#xe71a;</i>您的账户还不具备申请资格</p>
    </div>
    <div class="btn-group">
      <el-button type="primary" v-ripple>返回修改</el-button>
      <el-button v-ripple>查看</el-button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  .fail {
    box-sizing: border-box;
    padding: 15px 100px !important;
    text-align: center;

    .icon {
      display: block;
      margin-top: 6vh;
      font-size: 80px;
      color: #ed4014 !important;
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

    .res {
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
          color: #ed4015;
        }
      }
    }

    .btn-group {
      margin-top: 50px;
    }
  }

  .dark {
    .fail {
      .res {
        background: #28282a;
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .fail {
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
