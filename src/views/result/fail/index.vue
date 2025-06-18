<template>
  <ArtResultPage
    type="fail"
    title="提交失败"
    message="请核对并修改以下信息后，再重新提交。"
    iconCode="&#xe665;"
  >
    <template #content>
      <p>您提交的内容有如下错误：</p>
      <p><i class="icon iconfont-sys">&#xe71a;</i>您的账户已被冻结</p>
      <p><i class="icon iconfont-sys">&#xe71a;</i>您的账户还不具备申请资格</p>
    </template>
    <template #buttons>
      <el-button type="primary" v-ripple>返回修改</el-button>
      <el-button v-ripple>查看</el-button>
    </template>
  </ArtResultPage>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ResultFail' })
</script>
