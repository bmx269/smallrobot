<script setup lang="ts">
import type { Resource } from '~/utils/jsonapi'

/**
 * Ported from blog/post.hbs. The URL keeps the `dashedTitle` the Ember router used —
 * Drupal's own `path.alias` disagrees with it for every article, and the live inbound
 * links use dashedTitle. See docs/API-SCHEMA.md §4.
 */
const route = useRoute()
const { data: post } = await useArticle(String(route.params.dashedTitle))

// A bad slug should 404 rather than prerender an empty shell.
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const bio = computed(() => (post.value?.bio ?? null) as Resource | null)
const photo = computed(() => (bio.value?.photo ?? null) as Resource | null)

useSeo(() => ({
  title: `${str(post.value?.title) ?? 'Ideas'} | Small Robot Co.`,
  url: `/ideas/${str(post.value?.dashedTitle) ?? ''}`,
  // The old route hardcoded type 'website' for articles; 'article' is what it should
  // have been, and it lets the published_time and author tags below make sense.
  type: 'article',
  published: str(post.value?.created),
  author: str(bio.value?.title),
}))

const heroStyle = computed(() => {
  const url = post.value?.heroBackgroundUrl
  return typeof url === 'string' && url ? { backgroundImage: `url("${url}")` } : undefined
})
</script>

<template>
  <div v-if="post">
    <MainNav
      hero
      :nav-color="str(post.navColor)"
      :hero-color="str(post.heroColor)"
      :hero-overlay="str(post.heroOverlay)"
    />
    <section class="hero-splash">
      <div
        class="hero-wrapper"
        :class="[str(post.heroColor), str(post.heroLayout)]"
        :style="heroStyle"
      >
        <div class="overlay" :class="str(post.heroOverlay)">
          <div class="container-fluid">
            <div class="row">
              <div class="hero-col">
                <div class="hero-block">
                  <div class="hero-text">
                    <h1 :class="str(post.navColor)">{{ post.title }}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container-fluid">
      <div class="row">
        <!-- eslint-disable-next-line vue/no-v-html -- trusted CMS body, as in the Ember app -->
        <div class="body col-12 col-md-10 col-lg-8 py-3 pt-md-5 mx-auto" v-html="bodyHtml(post)" />

        <div v-if="bio" class="author-bio col-12 col-md-10 col-lg-8 py-3 pb-md-5 mx-auto">
          <div class="d-flex">
            <div class="bio-photo">
              <img
                v-if="photo"
                :src="fileUrl(photo) ?? undefined"
                :alt="`portrait of ${bio.title}`"
                class="photo img-fluid"
              >
            </div>
            <div class="bio-details col">
              <div class="name">{{ bio.title }}</div>
              <div class="title">{{ bio.professionalTitle }}</div>
              <!-- eslint-disable-next-line vue/no-v-html -- trusted CMS body -->
              <div class="bio-body" v-html="bodyHtml(bio)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <GlobalFooter />
  </div>
  <LoadingSpinner v-else />
</template>
