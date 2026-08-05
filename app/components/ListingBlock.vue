<script setup lang="ts">
import type { Resource } from '~/utils/jsonapi'

/**
 * A `listing` element. `listingType` selects what gets listed — the old template
 * handled "articles" and had a stubbed "team" branch that only ever printed the literal
 * text "Team members".
 */
const { listingType, articles } = defineProps<{
  listingType?: string | null
  articles?: Resource[]
}>()

// The API already sorts by -created, so the old `sort-by "created:desc"` is redundant.
const items = computed(() => articles ?? [])
</script>

<template>
  <div class="element-listing">
    <div class="inner">
      <template v-if="listingType === 'articles'">
        <ArticleTeaser v-for="article in items" :key="article.id" :article="article" />
        <template v-if="!items.length">No Articles</template>
      </template>
      <template v-else-if="listingType === 'team'">Team members</template>
    </div>
  </div>
</template>
