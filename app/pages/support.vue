<script setup lang="ts">
const { data: page } = await usePage('/support')

useSeo({
  title: 'Small Robot Co. | Support - Drupal, Wordpress, Vuejs, Ember.js, Web Apps',
  url: '/support',
})
</script>

<template>
  <CmsPage :page="page" />
</template>
