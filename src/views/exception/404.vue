<template>
  <ArtException :data="data" />
</template>

<script setup lang="ts">
  import imgUrl from '@imgs/state/404.png'
  const data = reactive({
    title: '404',
    desc: '抱歉，你访问的页面不存在',
    btnText: '返回首页',
    imgUrl
  })
</script>
