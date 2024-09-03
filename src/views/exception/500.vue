<template>
  <Exception :data="data"></Exception>
</template>

<script setup lang="ts">
  import imgUrl from '@imgs/state/500.png'
  const data = reactive({
    title: '500',
    desc: '抱歉，服务器出错了',
    btnText: '返回首页',
    imgUrl
  })
</script>
