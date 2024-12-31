<template>
  <div class="page-content">
    <div class="select">
      <div class="item">
        <h3>Unicode</h3>
        <icon-selector :iconType="IconTypeEnum.UNICODE" @getIcon="getIcon" defaultIcon="&#xe6b5;" />
      </div>
      <div class="item">
        <h3>ClassName</h3>
        <icon-selector
          :iconType="IconTypeEnum.CLASS_NAME"
          @getIcon="getIcon"
          width="260px"
          defaultIcon="iconsys-baitianmoshi3"
        />
      </div>
      <div class="item">
        <h3>禁用</h3>
        <icon-selector
          :iconType="IconTypeEnum.CLASS_NAME"
          @getIcon="getIcon"
          width="260px"
          defaultIcon="iconsys-baitianmoshi3"
          disabled
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import IconSelector from '@comps/Icons/IconSelector.vue'
  import { IconTypeEnum } from '@/enums/appEnum'

  // 获取选择的图标
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
