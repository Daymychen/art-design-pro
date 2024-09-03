<template>
  <Exception :data="data"></Exception>
</template>

<script setup lang="ts">
  import imgUrl from '@imgs/state/403.png'

  const data = reactive({
    title: '403',
    desc: '抱歉，你无权访问该页面',
    btnText: '返回首页',
    imgUrl
  })
</script>
