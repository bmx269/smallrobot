<script setup lang="ts">
/**
 * Ported from application.hbs.
 *
 * ember-burger-menu (abandoned, last published 2022) is replaced by our own markup over
 * its vendored CSS — see assets/scss/vendor/burger-menu/.
 *
 * The catch: that stylesheet alone does nothing. The addon computed the actual animation
 * as *inline styles in JavaScript* (addon/animations/reveal.js, animations/menu-item/
 * stack.js), so the CSS carries only structure and visibility. The three style
 * computations are reproduced below. Vendoring the CSS without them yields a menu with
 * no width that pops in place.
 *
 * Class names and defaults taken from the addon's component and state:
 *   position="right"        -> `right`               (NOT `bm--right`)
 *   animation="reveal"      -> `bm--reveal`
 *   itemAnimation="stack"   -> `bm-item--stack`
 *   translucentOverlay      -> `translucent-overlay` (defaulted true)
 *   open                    -> `is-open`
 */
const WIDTH = 300 // the addon's default state.width

const open = ref(false)
const route = useRoute()

// The old `dismissOnItemClick="true"`.
watch(() => route.fullPath, () => (open.value = false))

// The addon's `dismissOnEsc`, also defaulted true.
onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') open.value = false
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})

/** animations/base.js always assigns the menu its width. */
const menuStyle = { width: `${WIDTH}px` }

/** animations/reveal.js — the outlet slides aside to uncover the menu. */
const outletStyle = computed(() =>
  open.value ? { transform: `translate3d(-${WIDTH}px, 0, 0)` } : {},
)

/** animations/menu-item/stack.js — items drop in from below, staggered by index. */
function itemStyle(index: number) {
  return open.value ? {} : { transform: `translate3d(0, ${(index + 1) * 500}px, 0)` }
}

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/consulting', label: 'Consulting' },
  { to: '/development', label: 'Development' },
  { to: '/support', label: 'Support' },
  { to: '/about', label: 'About' },
  { to: '/ideas', label: 'Inspiration & Ideas' },
  { to: '/contact', label: 'Contact Us' },
]
</script>

<template>
  <div
    class="ember-burger-menu bm--reveal bm-item--stack right translucent-overlay"
    :class="{ 'is-open': open }"
  >
    <div class="bm-menu-container">
      <div class="bm-menu" :style="menuStyle">
        <a class="menu-close" href="#" @click.prevent="open = false">
          <i aria-hidden="true" class="fa fa-times" /> Close
        </a>
        <ul>
          <li
            v-for="(item, i) in NAV"
            :key="item.to"
            class="bm-menu-item"
            :style="itemStyle(i)"
          >
            <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="bm-outlet" :style="outletStyle">
      <!-- .bm-content is required by the vendored CSS: it supplies the page background
           and is the scroll container, since .ember-burger-menu is overflow:hidden. -->
      <div class="bm-content">
        <a class="hamburger right" href="#" @click.prevent="open = !open">
          <i aria-hidden="true" class="fa fa-bars" /> Menu
        </a>
        <slot />
      </div>
    </div>
  </div>
</template>
