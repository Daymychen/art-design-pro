<template>
  <div class="page-content success">
    <i class="iconfont-sys icon">&#xe617;</i>
    <h1 class="title">提交成功</h1>
    <p class="msg"
      >提交结果页用于反馈一系列操作任务的处理结果，如果仅是简单操作，使用 Message
      全局提示反馈即可。灰色区域可以显示一些补充的信息。</p
    >
    <div class="res">
      <p>已提交申请，等待部门审核。</p>
    </div>
    <div class="btn-group">
      <el-button type="primary" v-ripple>返回修改</el-button>
      <el-button v-ripple>查看</el-button>
      <el-button v-ripple>打印</el-button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  .success {
    box-sizing: border-box;
    padding: 15px 100px !important;
    text-align: center;

    .icon {
      display: block;
      margin-top: 6vh;
      font-size: 80px;
      color: #19be6b !important;
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
        padding: 8px 0;
        font-size: 15px;
        color: #808695;
      }
    }

    .btn-group {
      margin-top: 50px;
    }
  }

  .dark {
    .success {
      .res {
        background: #28282a;
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .success {
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
