<template>
  <div class="any-table">
    <el-table :data="list" style="width: 100%" :row-key="rowKey">
      <slot></slot>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    data: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: 'id'
    }
  })

  const list = ref([])

  onMounted(() => {
    initData()
  })

  const initData = () => {
    list.value = props.data as []
  }
</script>

<style lang="scss">
  .any-table {
    .el-table--enable-row-transition .el-table__body td.el-table__cell {
      transition: none;
    }

    .el-table {
      thead th:first-of-type,
      td:first-of-type {
        padding-left: 10px;
      }

      thead th:last-of-type,
      td:last-of-type {
        padding-right: 10px;
      }

      tr {
        height: 80px !important;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .any-table {
    overflow: hidden;
    border-radius: 10px;
  }
</style>
