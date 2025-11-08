<!-- https://vue-draggable-plus.pages.dev/ -->
<template>
  <div class="page-content mb-5">
    <ElRow>
      <ElCard shadow="never" class="w-75 mr-5 mb-7.5">
        <template #header>
          <span class="text-base font-bold">基础示例</span>
        </template>
        <template #default>
          <VueDraggable ref="el" v-model="userList">
            <div
              class="p-2.5 mb-2.5 cursor-move bg-active-color rounded"
              v-for="item in userList"
              :key="item.name"
            >
              {{ item.name }}
            </div>
          </VueDraggable>
        </template>
      </ElCard>

      <ElCard shadow="never" class="w-75 mb-7.5">
        <template #header>
          <span class="text-base font-bold">过渡动画</span>
        </template>
        <template #default>
          <VueDraggable v-model="userList" target=".sort-target" :scroll="true">
            <TransitionGroup type="transition" tag="ul" name="fade" class="sort-target">
              <li
                v-for="item in userList"
                :key="item.name"
                class="p-2.5 mb-2.5 cursor-move bg-active-color rounded"
              >
                {{ item.name }}
              </li>
            </TransitionGroup>
          </VueDraggable>
        </template>
      </ElCard>
    </ElRow>

    <ElCard shadow="never" class="mb-7.5">
      <template #header>
        <span class="text-base font-bold">表格拖拽排序</span>
      </template>
      <template #default>
        <VueDraggable target="tbody" v-model="userList" :animation="150">
          <ArtTable :data="userList">
            <ElTableColumn label="姓名" prop="name" />
            <ElTableColumn label="角色" prop="role" />
          </ArtTable>
        </VueDraggable>
      </template>
    </ElCard>

    <ElCard shadow="never" class="mb-7.5">
      <template #header>
        <span class="text-base font-bold">指定元素拖拽排序</span>
      </template>
      <template #default>
        <VueDraggable target="tbody" handle=".handle" v-model="userList" :animation="150">
          <ArtTable :data="userList">
            <ElTableColumn label="姓名" prop="name" />
            <ElTableColumn label="角色" prop="role" />
            <ElTableColumn label="操作" width="100">
              <ElButton size="default" class="handle"> 移动 </ElButton>
            </ElTableColumn>
          </ArtTable>
        </VueDraggable>
      </template>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { VueDraggable } from 'vue-draggable-plus'

  defineOptions({ name: 'TemplateDrag' })

  /**
   * 用户列表数据
   * 用于演示拖拽排序功能
   */
  const userList = ref([
    { name: '孙悟空', role: '斗战胜佛' },
    { name: '猪八戒', role: '净坛使者' },
    { name: '沙僧', role: '金身罗汉' },
    { name: '唐僧', role: '旃檀功德佛' }
  ])
</script>

<style scoped>
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
