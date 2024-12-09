<template>
  <div class="btn-more">
    <el-dropdown>
      <button-table type="more" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in list" :key="item.key" @click="handleClick(item)">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
  export interface ButtonMoreItem {
    key: string | number
    label: string
    disabled?: boolean
  }

  defineProps<{
    list: ButtonMoreItem[]
  }>()

  const emit = defineEmits<{
    (e: 'click', item: ButtonMoreItem): void
  }>()

  const handleClick = (item: ButtonMoreItem) => {
    emit('click', item)
  }
</script>
