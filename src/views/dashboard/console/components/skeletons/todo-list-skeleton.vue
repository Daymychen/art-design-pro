<template>
  <div class="art-card h-128 p-4 mb-5 max-sm:mb-4">
    <ElSkeletonItem variant="rect" class="w-full rounded-xl" style="height: 80px" />
    <div class="mt-4 space-y-4">
      <div
        v-for="n in 6"
        :key="`todo-${n}`"
        class="h-12 border-b border-g-200 last:border-b-0"
      >
        <ElSkeletonItem class="mt-3" />
      </div>
    </div>
  </div>
</template>

