<template>
  <div class="page-content">
    <!--  @getIcon="getIcon" -->
    <icon-selector @getIcon="getIcon" />
  </div>
</template>

<script setup lang="ts">
  import IconSelector from '@comps/Icons/IconSelector.vue'

  const getIcon = () => {}
</script>
