<script setup lang="ts">
import type { Resource } from '~/utils/jsonapi'

/**
 * Ported from page-section.hbs.
 *
 * One behavioural change: the old template dispatched elements by *duck-typing*
 * (`{{#if element.body}}` / `{{else if element.listingType}}` / ...). The API actually
 * types them — `column.element` is polymorphic over text / image / slideshow / listing —
 * so this switches on `element.type`, which is both correct and order-independent.
 * See docs/API-SCHEMA.md.
 *
 * The <section class="page-section"> wrapper is NOT decoration. The Ember component was
 * classic with `tagName = 'section'` and `classNames = ['page-section']`, and virtually
 * every rule in _page-section.scss is scoped to `.page-section .outer` — including
 * `&.hero-active`. Without the wrapper the hero and the dividers lose their styling
 * entirely.
 *
 * Note also that `v-if="section.show"` sits on `.outer`, not on the wrapper. That mirrors
 * `{{#if section.show}}` being *inside* the old component, so a hidden section still
 * emits an empty <section> — which matters, because
 * `.page-section:nth-child(even) .angled-divider` counts these elements to decide which
 * dividers get mirrored.
 */
const { section, articles } = defineProps<{
  section: Resource
  articles?: Resource[]
}>()

const columns = computed(() => (section.column ?? []) as Resource[])

const outerClasses = computed(() => [
  str(section.background),
  str(section.heroSize),
  str(section.animation),
  str(section.extraClasses),
  {
    'hero-active': section.isHero,
    divided: section.divider,
    // Either source of a background image gets the same class, as before.
    'background-image': Boolean(section.backgroundImage || section.backgroundImageUrl),
    animated: section.animated,
  },
])

/**
 * `backgroundImageUrl` (a plain string attribute) wins over the `backgroundImage` file
 * relationship — the same precedence as the old template's nested `{{if}}`.
 */
const backgroundStyle = computed(() => {
  const url =
    (typeof section.backgroundImageUrl === 'string' && section.backgroundImageUrl) ||
    fileUrl(section.backgroundImage as Resource | null)
  return url ? { backgroundImage: `url("${url}")` } : undefined
})

function columnClasses(column: Resource) {
  return [
    str(column.columnWidthXs),
    str(column.columnWidthSm),
    str(column.columnWidthMd),
    str(column.columnWidthLg),
    str(column.columnWidthXl),
    str(column.extraClasses),
  ]
}

function elementsOf(column: Resource) {
  return (column.element ?? []) as Resource[]
}
</script>

<template>
  <section class="page-section">
    <div v-if="section.show" class="outer" :class="outerClasses" :style="backgroundStyle">
      <div class="overlay" :class="str(section.overlay)">
        <AngledDivider v-if="section.divider" />

        <div class="content-wrapper">
          <div class="container-fluid">
            <div
              class="row"
              :class="[
                str(section.colHorizontalAlignment),
                str(section.colVerticalAlignment),
                { 'flex-sm-row-reverse': section.reverse },
              ]"
            >
              <div
                v-for="column in columns"
                :key="column.id"
                class="section-column"
                :class="columnClasses(column)"
              >
                <template v-for="element in elementsOf(column)" :key="element.id">
                  <div v-if="element.type === 'text'" class="element-text">
                    <!-- eslint-disable-next-line vue/no-v-html -- trusted CMS body, as in the Ember app -->
                    <div class="inner" v-html="bodyHtml(element)" />
                  </div>

                  <ListingBlock
                    v-else-if="element.type === 'listing'"
                    :listing-type="element.listingType as string"
                    :articles="articles"
                  />

                  <div v-else-if="element.type === 'image'" class="image">
                    <img
                      :src="fileUrl(element.image as Resource) ?? undefined"
                      :alt="imageAlt(element)"
                    >
                  </div>

                  <SlideshowBlock
                    v-else-if="element.type === 'slideshow'"
                    :slides="(element.slide ?? []) as Resource[]"
                  />

                  <LoadingSpinner v-else />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
