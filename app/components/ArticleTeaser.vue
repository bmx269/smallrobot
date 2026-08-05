<script setup lang="ts">
import type { Resource } from '~/utils/jsonapi'

const { article } = defineProps<{ article: Resource }>()

const bio = computed(() => (article.bio ?? null) as Resource | null)
const photo = computed(() => (bio.value?.photo ?? null) as Resource | null)
</script>

<template>
  <div class="article teaser mb-2 pb-3">
    <div class="article-outer">
      <AngledDivider />
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="article-title col-12 col-md-10 col-lg-8 pt-3 mx-auto text-center">
              <NuxtLink :to="`/ideas/${article.dashedTitle}`">
                <h2 class="text-center">{{ article.title }}</h2>
              </NuxtLink>
            </div>
          </div>
          <div v-if="bio" class="row">
            <div class="article-bio pt-2 mx-auto">
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
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <!-- eslint-disable-next-line vue/no-v-html -- trusted CMS body, as in the Ember app -->
            <div class="article-body col-12 col-md-10 col-lg-8 py-3 mx-auto" v-html="bodyHtml(article)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
