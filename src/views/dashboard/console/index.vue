<!-- 工作台页面 -->
<template>
  <div>
    <ConsoleSkeletonSection type="cardList" :loading="loading">
      <CardList />
    </ConsoleSkeletonSection>

    <ElRow :gutter="20">
      <ElCol :sm="24" :md="12" :lg="10">
        <ConsoleSkeletonSection type="activeUser" :loading="loading">
          <ActiveUser />
        </ConsoleSkeletonSection>
      </ElCol>
      <ElCol :sm="24" :md="12" :lg="14">
        <ConsoleSkeletonSection type="salesOverview" :loading="loading">
          <SalesOverview />
        </ConsoleSkeletonSection>
      </ElCol>
    </ElRow>

    <ElRow :gutter="20">
      <ElCol :sm="24" :md="24" :lg="12">
        <ConsoleSkeletonSection type="newUser" :loading="loading">
          <NewUser />
        </ConsoleSkeletonSection>
      </ElCol>
      <ElCol :sm="24" :md="12" :lg="6">
        <ConsoleSkeletonSection type="dynamic" :loading="loading">
          <Dynamic />
        </ConsoleSkeletonSection>
      </ElCol>
      <ElCol :sm="24" :md="12" :lg="6">
        <ConsoleSkeletonSection type="todo" :loading="loading">
          <TodoList />
        </ConsoleSkeletonSection>
      </ElCol>
    </ElRow>

    <ConsoleSkeletonSection type="aboutProject" :loading="loading">
      <AboutProject />
    </ConsoleSkeletonSection>
  </div>
</template>

<script setup lang="ts">
  import ConsoleSkeletonSection from './components/console-skeleton-section.vue'
  import { useConsoleSkeleton } from './composables/useConsoleSkeleton'
  import CardList from './modules/card-list.vue'
  import ActiveUser from './modules/active-user.vue'
  import SalesOverview from './modules/sales-overview.vue'
  import NewUser from './modules/new-user.vue'
  import Dynamic from './modules/dynamic-stats.vue'
  import TodoList from './modules/todo-list.vue'
  import AboutProject from './modules/about-project.vue'

  const { loading } = useConsoleSkeleton(1000)

  defineOptions({ name: 'Console' })
</script>
