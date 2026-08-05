import type { RouterConfig } from '@nuxt/schema'
import { START_LOCATION } from 'vue-router'

/**
 * Scroll handling on navigation.
 *
 * Nuxt's default scrollBehavior returns a position for vue-router to apply via
 * `window.scrollTo`, which does nothing here. The burger menu layout makes
 * `.ember-burger-menu` height:100% + overflow:hidden and `.bm-content` height:100% +
 * overflow:auto, so the document never exceeds the viewport and **the window is not the
 * scrolling element** — `.bm-content` is.
 *
 * The Ember app had the same bug: ember-router-scroll supports a `scrollElement` option
 * but defaults to `'window'`, and nothing configured it, so production does not scroll up
 * between routes either. This is a fix, not just a port.
 *
 * The control flow deliberately mirrors Nuxt's own router.options (waiting on
 * `page:loading:end`, then the transition promise, then a frame, and bailing if the route
 * changed again meanwhile) — those exist because scrolling before the new page renders
 * either targets stale content or gets undone. Only the final "apply" differs: we scroll
 * the container ourselves and return `false` so vue-router does not also scroll the
 * window.
 *
 * Back/forward does not restore the previous offset. `savedPosition` is recorded from
 * window scroll, which is always 0 in this layout, and browsers only restore window
 * scroll too. Every navigation therefore lands at the top — consistent, and no worse than
 * production. Restoring properly would mean tracking `.bm-content.scrollTop` per history
 * entry ourselves.
 */
const SCROLL_CONTAINER = '.bm-content'

/** Offset of a hash target within the scroll container, honouring scroll-margin-top. */
function hashOffsetWithin(container: Element, hash: string): number | null {
  let target: Element | null = null
  try {
    target = document.querySelector(hash)
  } catch {
    return null // not a valid selector
  }
  if (!target) return null

  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
  return (
    target.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    margin
  )
}

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // If the layout ever stops using .bm-content, hand back to vue-router's normal
    // window scrolling rather than silently doing nothing.
    if (typeof document === 'undefined' || !document.querySelector(SCROLL_CONTAINER)) {
      return savedPosition ?? { left: 0, top: 0 }
    }

    const nuxtApp = useNuxtApp()
    const router = useRouter()
    // Nuxt reads this from `app.router.options.scrollBehaviorType`, but it is not on the
    // typed RouterOptions in this version and we do not set it — so use its default.
    const hashBehaviour: ScrollBehavior = 'auto'

    // Re-queried at apply time rather than captured up front: this can run after an
    // await, and a stale element reference would scroll something no longer on the page.
    const apply = (): false => {
      const container = document.querySelector(SCROLL_CONTAINER)
      if (!container) return false

      if (to.hash) {
        const top = hashOffsetWithin(container, to.hash)
        if (top !== null) {
          container.scrollTo({ top, left: 0, behavior: hashBehaviour })
          return false
        }
      }
      container.scrollTo({ top: 0, left: 0 })
      return false
    }

    // Hash-only change on the same route: nothing re-renders, so act immediately.
    const samePath = to.path.replace(/\/$/, '') === from.path.replace(/\/$/, '')
    if (samePath) {
      if (from.hash && !to.hash) return false // leaving an anchor; stay put
      return apply()
    }

    // Opt-out, matching Nuxt's `definePageMeta({ scrollToTop: false })`.
    const optOut =
      typeof to.meta.scrollToTop === 'function'
        ? to.meta.scrollToTop(to, from)
        : to.meta.scrollToTop
    if (optOut === false) return false

    // First navigation of the session: the page is already there.
    if (from === START_LOCATION) return apply()

    return new Promise<false>((resolve) => {
      const doScroll = () =>
        requestAnimationFrame(() => {
          // Another navigation overtook this one; let that one scroll instead.
          if (router.currentRoute.value.fullPath !== to.fullPath) return resolve(false)
          resolve(apply())
        })

      nuxtApp.hooks.hookOnce('page:loading:end', () => {
        const transition = (nuxtApp as unknown as Record<string, Promise<void> | undefined>)['~transitionPromise']
        if (transition) transition.then(doScroll)
        else doScroll()
      })
    })
  },
}
