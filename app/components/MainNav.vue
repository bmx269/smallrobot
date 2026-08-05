<script setup lang="ts">
/**
 * Ported from main-nav.hbs.
 *
 * The Ember component was classic with `tagName: 'div'` and `classNames: ['main-nav']`,
 * and callers passed `@class="hero"` — so the outer div carried `main-nav hero`. Glimmer
 * and Vue don't create that wrapper implicitly, so it's explicit here. Missing it would
 * silently break every `.main-nav` rule in _main-nav.scss.
 *
 * `hero` / `heroColor` / `heroOverlay` are only supplied by the blog post route; the
 * plain pages pass just `navColor`.
 */
const {
  hero = false,
  navColor,
  heroColor,
  heroOverlay,
} = defineProps<{
  hero?: boolean
  navColor?: string
  heroColor?: string
  heroOverlay?: string
}>()

const NAV = [
  { to: '/consulting', label: 'Consulting' },
  { to: '/development', label: 'Development' },
  { to: '/support', label: 'Support' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <div class="main-nav" :class="{ hero }">
    <div
      class="container-fluid"
      :class="[navColor, heroColor && `hero-${heroColor}`, heroOverlay && `hero-${heroOverlay}`]"
    >
      <div class="row">
        <div class="site-info col-4 col-sm-9 col-md-3 col-lg-3">
          <NuxtLink to="/" class="d-flex flex-row">
            <span class="logo d-flex align-items-end"><SiteLogo /></span>
            <span class="name d-flex align-items-end"> Small Robot</span>
          </NuxtLink>
        </div>
        <nav class="col">
          <ul>
            <li v-for="item in NAV" :key="item.to">
              <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
