<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'

// Links to this page's Markdown copy (its URL plus .md) and to the whole
// docs in one file, for handing to an AI tool.
const route = useRoute()
const markdown = computed(() => {
  const path = route.path.replace(/\.html$/, '').replace(/\/$/, '/index')
  return `${path}.md`
})
</script>

<template>
  <p class="markdown-link">
    <!-- New tab: plain files, not site pages, so the site's router must leave them alone. -->
    For AI tools: <a :href="markdown" target="_blank" rel="noopener">this page as Markdown</a> ·
    <a :href="withBase('/llms-full.txt')" target="_blank" rel="noopener">all docs in one file</a>
  </p>
</template>
