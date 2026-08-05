<script setup lang="ts">
/**
 * The blog index, at /ideas (the Ember route was named `blog` but pathed `ideas`).
 *
 * The article list is fetched here and handed down, because the page's own content
 * includes a `listing` element whose `listingType` is "articles" — the CMS decides
 * where the list appears, this route just supplies the data.
 */
const { data: page } = await usePage('/blog')
const { data: articles } = await useArticles()

useSeo({
  title: 'Small Robot Co. | Our Ideas Written Down',
  url: '/ideas',
})
</script>

<template>
  <CmsPage :page="page" :articles="articles ?? []" />
</template>
