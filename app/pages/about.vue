<script setup lang="ts">
const { data: page } = await usePage('/about')

useSeo({
  title: 'Small Robot Co. | About Us - Vuejs, Drupal, Wordpress, Ember.js, Web Apps',
  url: '/about',
})
</script>

<template>
  <CmsPage :page="page" />
</template>
