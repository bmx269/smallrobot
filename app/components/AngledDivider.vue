<script setup lang="ts">
/**
 * The wrapper <div> is required, not cosmetic.
 *
 * The Ember component was classic, so Ember wrapped the SVG in a div and gave it the
 * `ember-view` class — and the stylesheets then used that class as a structural hook:
 *
 *   .page-section .outer > .ember-view .angled-divider .angled-divider__bottom
 *   .page-section:nth-child(even) .ember-view .angled-divider
 *
 * Rendering a bare <svg> drops that element and every one of those ~26 rules stops
 * matching, which is why the dividers disappeared. The hook is kept but renamed to
 * `.divider-wrap` in the SCSS, since a framework's internal class name is a poor thing
 * for a Nuxt app to depend on.
 */
</script>

<template>
  <div class="divider-wrap">
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      class="angled-divider"
    >
      <polygon points="0,20 20,0 0,0 " class="angled-divider__top" />
      <polygon points="20,0 0,20 20,20 " class="angled-divider__bottom" />
    </svg>
  </div>
</template>
