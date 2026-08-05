<script setup lang="ts">
const { data: page } = await usePage('/development')

useSeo({
  title: 'Small Robot Co. | Development - WordPress, Drupal, Vuejs, Ember.js, Web Apps',
  url: '/development',
})
</script>

<template>
  <CmsPage :page="page" />
</template>
