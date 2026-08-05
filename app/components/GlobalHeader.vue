<script setup lang="ts">
import type { Resource } from '~/utils/jsonapi'

/**
 * Ported from global-header.hbs, which was just a conditional around MainNav:
 * a page with `heroActive` got the `hero` class and the page's navColor, otherwise a
 * bare MainNav.
 *
 * The wrapper <div> matters for a non-obvious reason: this was a classic Ember component,
 * so Ember emitted a wrapper element, making it the *second* child of .bm-content (after
 * the hamburger link) and pushing the page sections to nth-child(3) onward. Since
 * `.page-section:nth-child(even) .divider-wrap .angled-divider` mirrors alternate
 * dividers, dropping this element shifts every section's parity and mirrors the wrong
 * ones.
 */
const { page } = defineProps<{ page: Resource | null | undefined }>()
</script>

<template>
  <div class="global-header">
    <MainNav
      v-if="page?.heroActive"
      hero
      :nav-color="str(page.navColor)"
    />
    <MainNav v-else />
  </div>
</template>
