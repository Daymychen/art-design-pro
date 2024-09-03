<!-- 响应式选择器 -->
<template>
  <el-col :xs="24" :sm="12" :lg="6">
    <el-form-item :label="`${label}：`" :prop="prop">
      <el-select v-model="modelValue" clearable placeholder="请选择" style="width: 100%">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
  </el-col>
</template>

<script setup lang="ts">
  const modelValue = defineModel<string>({ required: true })

  defineProps({
    label: String,
    prop: String,
    options: {
      type: Array as any,
      default: () => []
    }
  })
</script>

<style lang="scss" scoped></style>
