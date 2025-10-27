<template>
  <div class="page-content">
    <div>
      <div class="mb-7.5">
        <h3 class="pb-2.5 text-base font-medium">Unicode</h3>
        <ArtIconSelector v-model="icon1" :iconType="IconTypeEnum.UNICODE" />
      </div>
      <div class="mb-7.5">
        <h3 class="pb-2.5 text-base font-medium">ClassName</h3>
        <ArtIconSelector v-model="icon2" :iconType="IconTypeEnum.CLASS_NAME" width="260px" />
      </div>
      <div class="mb-7.5">
        <h3 class="pb-2.5 text-base font-medium">禁用</h3>
        <ArtIconSelector
          v-model="icon3"
          :iconType="IconTypeEnum.CLASS_NAME"
          width="260px"
          disabled
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IconTypeEnum } from '@/enums/appEnum'

  defineOptions({ name: 'WidgetsIconSelector' })

  /**
   * Unicode 类型图标值
   */
  const icon1 = ref('')

  /**
   * ClassName 类型图标值
   */
  const icon2 = ref('iconsys-baitianmoshi3')

  /**
   * 禁用状态的图标值
   */
  const icon3 = ref('iconsys-baitianmoshi3')
</script>
