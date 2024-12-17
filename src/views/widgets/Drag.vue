<!-- https://vue-draggable-plus.pages.dev/ -->
<template>
  <div class="page-content">
    <el-row>
      <el-card shadow="never" style="width: 300px; margin-right: 20px">
        <template #header>
          <span class="card-header">基础示例</span>
        </template>
        <template #default>
          <VueDraggable ref="el" v-model="userList">
            <div class="demo1-item" v-for="item in userList" :key="item.name">
              {{ item.name }}
            </div>
          </VueDraggable>
        </template>
      </el-card>

      <el-card shadow="never" style="width: 300px">
        <template #header>
          <span class="card-header">过渡动画</span>
        </template>
        <template #default>
          <VueDraggable v-model="userList" target=".sort-target" :scroll="true">
            <TransitionGroup type="transition" tag="ul" name="fade" class="sort-target">
              <li v-for="item in userList" :key="item.name" class="demo1-item">
                {{ item.name }}
              </li>
            </TransitionGroup>
          </VueDraggable>
        </template>
      </el-card>
    </el-row>

    <el-card shadow="never">
      <template #header>
        <span class="card-header">表格拖拽排序</span>
      </template>
      <template #default>
        <VueDraggable target="tbody" v-model="userList" :animation="150">
          <art-table :data="userList" :pagination="false">
            <el-table-column label="姓名" prop="name" />
            <el-table-column label="角色" prop="role" />
          </art-table>
        </VueDraggable>
      </template>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span class="card-header">指定元素拖拽排序</span>
      </template>
      <template #default>
        <VueDraggable target="tbody" handle=".handle" v-model="userList" :animation="150">
          <art-table :data="userList" :pagination="false">
            <el-table-column label="姓名" prop="name" />
            <el-table-column label="角色" prop="role" />
            <el-table-column label="操作" width="100">
              <el-button size="default" class="handle"> 移动 </el-button>
            </el-table-column>
          </art-table>
        </VueDraggable>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { VueDraggable } from 'vue-draggable-plus'

  const userList = ref([
    {
      name: '孙悟空',
      role: '斗战胜佛'
    },
    {
      name: '猪八戒',
      role: '净坛使者'
    },
    {
      name: '沙僧',
      role: '金身罗汉'
    },
    {
      name: '唐僧',
      role: '旃檀功德佛'
    }
  ])
</script>

<style lang="scss" scoped>
  .page-content {
    .demo1-item {
      padding: 10px;
      margin-bottom: 10px;
      cursor: move;
      background-color: rgba(var(--art-gray-200-rgb), 0.8);
      border-radius: 4px;
    }

    .el-card {
      margin-bottom: 30px;

      .card-header {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  .fade-move,
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
  }

  .fade-leave-active {
    position: absolute;
  }
</style>
