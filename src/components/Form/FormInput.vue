<!-- 响应式输入框 -->
<template>
  <el-col :xs="24" :sm="12" :lg="6">
    <el-form-item :label="`${label}：`" :prop="prop">
      <el-input :placeholder="`请输入${label}`" v-model="modelValue" />
      <!-- <el-input :placeholder="`请输入${label}`" :model-value="value" @input="inputChange" clearable/> -->
    </el-form-item>
  </el-col>
</template>

<script setup lang="ts">
  const modelValue = defineModel<string>({ required: true })

  defineProps({
    label: String,
    prop: String
  })
</script>

<style lang="scss" scoped></style>
