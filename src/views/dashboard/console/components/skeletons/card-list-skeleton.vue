<template>
  <ElRow :gutter="20" class="flex">
    <ElCol v-for="n in 4" :key="n" :sm="12" :md="6" :lg="6">
      <div class="art-card relative flex flex-col justify-center h-35 px-5 mb-5 max-sm:mb-4">
        <ElSkeletonItem class="!w-7/10" />
        <ElSkeletonItem class="mt-4 !w-7/10" />
        <ElSkeletonItem class="mt-4 !w-7/10" />
        <ElSkeletonItem class="absolute !size-12 rounded-xl top-[30%] right-[10%]" />
      </div>
    </ElCol>
  </ElRow>
</template>

