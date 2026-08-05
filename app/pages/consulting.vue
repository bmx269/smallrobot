<script setup lang="ts">
const { data: page } = await usePage('/consulting')

useSeo({
  title: 'Small Robot Co. | Consulting - Vuejs, Drupal, Wordpress, Ember.js, Web Apps',
  url: '/consulting',
})
</script>

<template>
  <CmsPage :page="page" />
</template>
