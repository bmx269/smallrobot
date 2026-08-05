<script setup lang="ts">
const { data: page } = await usePage('/home')

useSeo({
  title: 'Small Robot Co. | Vancouver Web Design, Technical Consulting, App Development, & Support',
  url: '/',
})
</script>

<template>
  <CmsPage :page="page" />
</template>
