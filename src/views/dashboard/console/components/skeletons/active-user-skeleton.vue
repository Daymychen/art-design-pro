<template>
  <div class="art-card h-105 p-4 box-border mb-5 max-sm:mb-4">
    <ElSkeletonItem variant="rect" class="w-full rounded-xl" style="height: 220px" />
    <ElSkeletonItem class="mt-6"/>
    <ElSkeletonItem class="mt-2"/>
    <div class="flex-b mt-4">
      <ElSkeletonItem v-for="n in 4" :key="`active-${n}`" variant="rect" class="!size-12" />
    </div>
  </div>
</template>

