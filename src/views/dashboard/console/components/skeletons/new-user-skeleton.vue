<template>
  <div class="art-card p-4 h-128 overflow-hidden mb-5 max-sm:mb-4">
    <ElSkeletonItem variant="rect" class="w-full rounded-xl" style="height: 80px" />
    <div class="mt-6 space-y-4">
      <div
        v-for="n in 6"
        :key="`row-${n}`"
        class="flex-cb border-b border-g-200 pb-3 last:border-b-0"
      >
        <ElSkeletonItem variant="circle" class="!size-12 mr-2 flex-shrink-0" />
        <ElSkeletonItem variant="rect"/>
      </div>
    </div>
  </div>
</template>

