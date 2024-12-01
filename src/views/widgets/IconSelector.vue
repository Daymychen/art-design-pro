<template>
  <div class="page-content">
    <div class="select">
      <div class="item">
        <h3>Unicode</h3>
        <icon-selector :iconType="iconType1" @getIcon="getIcon" />
      </div>
      <div class="item">
        <h3>ClassName</h3>
        <icon-selector :iconType="iconType2" @getIcon="getIcon" width="260px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import IconSelector from '@comps/Icons/IconSelector.vue'
  import { IconTypeEnum } from '@/enums/appEnum'

  const iconType1 = ref(IconTypeEnum.UNICODE)

  const iconType2 = ref(IconTypeEnum.CLASS_NAME)

  const getIcon = (icon: string) => {
    console.log(icon)
  }
</script>

<style scoped lang="scss">
  .select {
    .item {
      margin-bottom: 30px;

      h3 {
        padding-bottom: 10px;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
</style>
