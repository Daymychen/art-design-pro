<template>
  <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" class="art-svg-icon inline" />
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'

  defineOptions({ name: 'ArtSvgIcon', inheritAttrs: false })

  interface Props {
    /** Iconify icon name */
    icon?: string
  }

  defineProps<Props>()

  const attrs = useAttrs()

  const bindAttrs = computed<{ class: string; style: string }>(() => ({
    class: (attrs.class as string) || '',
    style: (attrs.style as string) || ''
  }))
</script>
