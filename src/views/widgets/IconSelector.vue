<template>
  <div class="page-content">
    <icon-selector :iconType="iconType" @getIcon="getIcon" />
  </div>
</template>

<script setup lang="ts">
  import IconSelector from '@comps/Icons/IconSelector.vue'
  import { IconTypeEnum } from '@/enums/appEnum'

  const iconType = ref(IconTypeEnum.UNICODE)

  const getIcon = (icon: string) => {
    console.log(icon)
  }
</script>
