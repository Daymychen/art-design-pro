<template>
  <ArtResultPage
    type="fail"
    title="提交失败"
    message="请核对并修改以下信息后，再重新提交。"
    iconCode="ri:close-fill"
  >
    <template #content>
      <p>您提交的内容有如下错误：</p>
      <p>
        <ArtSvgIcon icon="ri:close-circle-line" class="text-red-500 mr-1" />
        <span>您的账户已被冻结</span>
      </p>
      <p>
        <ArtSvgIcon icon="ri:close-circle-line" class="text-red-500 mr-1" />
        <span>您的账户还不具备申请资格</span>
      </p>
    </template>
    <template #buttons>
      <ElButton type="primary" v-ripple>返回修改</ElButton>
      <ElButton v-ripple>查看</ElButton>
    </template>
  </ArtResultPage>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ResultFail' })
</script>
