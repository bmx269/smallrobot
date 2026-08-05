<script setup lang="ts">
/**
 * Ported from footer-nav.hbs.
 *
 * The original also had commented-out links to `work` and `pricing`. Those pages do
 * exist and are published in Drupal, but had no route in the Ember app, so the links
 * were deliberately disabled. Left out here too — see docs/API-SCHEMA.md §4.
 */
const COMPANY = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/ideas', label: 'Inspiration & Ideas' },
]

const SERVICES = [
  { to: '/consulting', label: 'Consulting' },
  { to: '/development', label: 'Development' },
  { to: '/support', label: 'Support' },
]
</script>

<template>
  <div class="company col-6 col-md-3 col-lg-2">
    <h4>Company</h4>
    <nav>
      <ul>
        <li v-for="item in COMPANY" :key="item.to">
          <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
  <div class="services col-6 col-md-3 col-lg-2">
    <h4>Services</h4>
    <nav>
      <ul>
        <li v-for="item in SERVICES" :key="item.to">
          <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
