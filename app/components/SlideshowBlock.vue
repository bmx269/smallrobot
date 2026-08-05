<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import type { Resource } from '~/utils/jsonapi'

/**
 * Ported from slideshow-block.hbs, replacing ember-cli-swiper (last published 2021)
 * with the `swiper` package's own Vue components.
 *
 * Options come from the old SwiperContainer arguments; the responsive breakpoints lived
 * on the page-section component's init() and were threaded down as `@breakpoints`. They
 * belong here, since nothing else used them.
 *
 * The original wrapped the slides in a `shuffle` helper. Deliberately dropped:
 * randomising per render defeats prerendering, since every build would emit a different
 * order and produce a diff with no meaning.
 */
const { slides } = defineProps<{ slides: Resource[] }>()

const BREAKPOINTS = {
  320: { slidesPerView: 2, spaceBetween: 10 },
  640: { slidesPerView: 3, spaceBetween: 30 },
  900: { slidesPerView: 4, spaceBetween: 80 },
  1200: { slidesPerView: 5, spaceBetween: 80 },
}
</script>

<template>
  <div class="slideshow">
    <div class="inner">
      <Swiper
        class="item-carousel"
        :loop="false"
        :centered-slides="false"
        :navigation="false"
        :slides-per-view="5"
        :space-between="80"
        :breakpoints="BREAKPOINTS"
      >
        <SwiperSlide
          v-for="slide in slides"
          :key="slide.id"
          class="d-flex justify-content-center align-items-center text-center"
        >
          <div class="slide-inner">
            <div v-if="slide.image" class="image">
              <img :src="fileUrl(slide.image as Resource) ?? undefined" :alt="imageAlt(slide)">
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -- trusted CMS body, as in the Ember app -->
            <div v-if="bodyHtml(slide)" class="text" v-html="bodyHtml(slide)" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>
