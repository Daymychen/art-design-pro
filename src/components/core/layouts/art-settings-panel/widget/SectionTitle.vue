<template>
  <p
    class="relative mt-7.5 mb-5.5 text-sm text-center text-g-800 before:absolute before:top-[10px] before:left-0 before:w-[50px] before:m-auto before:content-[''] before:border-b before:border-[var(--art-gray-300)] after:absolute after:top-[10px] after:right-0 after:w-[50px] after:m-auto after:content-[''] after:border-b after:border-g-300"
    :style="style"
  >
    {{ title }}
  </p>
</template>

<script setup lang="ts">
  interface Props {
    title: string
    style?: Record<string, any>
  }

  defineProps<Props>()
</script>
