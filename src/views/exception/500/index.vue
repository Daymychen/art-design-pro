<template>
  <ArtException
    :data="{
      title: '500',
      desc: $t('exceptionPage.500'),
      btnText: $t('exceptionPage.gohome'),
      imgUrl
    }"
  />
</template>

<script setup lang="ts">
  import imgUrl from '@imgs/state/500.png'
  defineOptions({ name: 'Exception500' })
</script>
