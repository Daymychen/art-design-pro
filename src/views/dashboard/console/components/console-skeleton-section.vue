<template>
  <ElSkeleton v-bind="$attrs" animated :loading="loading">
    <template #template>
      <component v-if="SkeletonComponent" :is="SkeletonComponent" />
    </template>
    <slot />
  </ElSkeleton>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import AboutProjectSkeleton from './skeletons/about-project-skeleton.vue'
  import ActiveUserSkeleton from './skeletons/active-user-skeleton.vue'
  import CardListSkeleton from './skeletons/card-list-skeleton.vue'
  import DynamicSkeleton from './skeletons/dynamic-skeleton.vue'
  import NewUserSkeleton from './skeletons/new-user-skeleton.vue'
  import SalesOverviewSkeleton from './skeletons/sales-overview-skeleton.vue'
  import TodoListSkeleton from './skeletons/todo-list-skeleton.vue'

  type SkeletonType =
    | 'cardList'
    | 'activeUser'
    | 'salesOverview'
    | 'newUser'
    | 'dynamic'
    | 'todo'
    | 'aboutProject'

  const props = defineProps<{
    loading: boolean
    type: SkeletonType
  }>()

  const skeletonMap: Record<SkeletonType, any> = {
    cardList: CardListSkeleton,
    activeUser: ActiveUserSkeleton,
    salesOverview: SalesOverviewSkeleton,
    newUser: NewUserSkeleton,
    dynamic: DynamicSkeleton,
    todo: TodoListSkeleton,
    aboutProject: AboutProjectSkeleton
  }

  const SkeletonComponent = computed(() => skeletonMap[props.type])
</script>

