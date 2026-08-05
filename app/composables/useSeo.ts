/**
 * Head tags, ported from head.hbs plus the per-route `setProperties(this.headData, ...)`
 * calls the Ember routes made.
 *
 * Not driven by Drupal's `metatag` field, even though every resource carries one. Its
 * contents are unusable: every page returns the *identical* site-wide generic title and
 * description, and its canonical points at the backend host rather
 * than the public domain. Wiring it up would mean duplicate titles across the whole site
 * and canonicals aimed at the API host. See docs/API-SCHEMA.md.
 */

/** Site-wide default, matching the old head.hbs fallbacks. */
const SITE_NAME = 'Small Robot Co.'
const SITE_URL = 'https://smallrobot.co'
const DEFAULT_DESCRIPTION =
  'We are a Vancouver, BC based Web Design, Technical Consulting, Web Development, and Support company, specializing in Drupal, WordPress, Vuejs, Ember.js, websites and web apps.'
const DEFAULT_IMAGE = `${SITE_URL}/img/app-splash.jpg`

export interface SeoInput {
  title: string
  description?: string
  /** Path or absolute URL; relative paths are resolved against the public origin. */
  url?: string
  type?: string
  image?: string
  /** ISO date — emits article:published_time. */
  published?: string
  /** Emits the twitter:label1 / data1 "Written by" pair. */
  author?: string
}

export function useSeo(input: SeoInput | (() => SeoInput)) {
  const resolved = computed(() => (typeof input === 'function' ? input() : input))

  useHead(() => {
    const {
      title,
      description = DEFAULT_DESCRIPTION,
      url = '/',
      type = 'website',
      image = DEFAULT_IMAGE,
      published,
      author,
    } = resolved.value

    const canonical = url.startsWith('http')
      ? url
      : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`

    return {
      title,
      link: [{ rel: 'canonical', href: canonical }],
      meta: [
        { name: 'description', content: description },
        // Carried over from head.hbs as-is. `unsafe-url` sends the full URL as referrer
        // even on downgrade — worth revisiting, it is a more permissive policy than
        // anything a new site would choose.
        { name: 'referrer', content: 'unsafe-url' },

        ...(published
          ? [{ property: 'article:published_time', content: published }]
          : []),

        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:title', content: title },
        { property: 'og:url', content: canonical },
        { property: 'og:description', content: description },
        { property: 'og:type', content: type },
        { property: 'og:image', content: image },
        // These dimensions were hardcoded in head.hbs and are wrong for the actual
        // app-splash.jpg, but they are only a hint; left alone to avoid changing what
        // crawlers already have cached. Worth fixing alongside a real social image.
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: '256' },
        { property: 'og:image:height', content: '256' },

        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:image:src', content: image },
        { name: 'twitter:title', content: title },
        { name: 'twitter:url', content: canonical },
        { name: 'twitter:description', content: description },
        ...(author
          ? [
              { name: 'twitter:label1', content: 'Written by' },
              { name: 'twitter:data1', content: author },
            ]
          : []),
      ],
    }
  })
}
