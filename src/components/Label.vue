<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <label v-bind="$attrs" class="text-sm font-medium text-neutral-700">
    <slot />
  </label>
</template>
