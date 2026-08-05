// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Prerender everything to static HTML. `nuxt generate` is what replaces the old
  // prember + ember-cli-fastboot + prember-crawler stack.
  // The output is plain files, which is what the Apache host wants.
  ssr: true,

  nitro: {
    prerender: {
      // The crawler discovers every linked route on its own; /404 is linked from
      // nowhere, so it must be listed. It renders through pages/[...slug].vue, which
      // serves the Drupal page whose slug is /404 — giving a fully-styled error page at
      // /404/index.html for Apache's ErrorDocument.
      //
      // The trailing slash is load-bearing: bare '/404' collides with Nitro's own
      // 404.html special-case — a client-only SPA shell with an empty body (like
      // 200.html) — and the shell wins the write. '/404/' maps to 404/index.html, which
      // the shell does not touch.
      routes: ['/404/'],
    },
  },

  // Ported wholesale from the Ember app — Sass is framework-independent. Includes
  // vendored Bootstrap 4 (84 files) plus the site's own ~10.
  css: ['~/assets/scss/app.scss'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        // Carried over from the old app/index.html. Nuxt supplies charset and viewport;
        // the `X-UA-Compatible: IE=edge` meta is dropped, since IE is long dead and the
        // browserslist no longer targets it.
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      ],
      script: [
        // Font Awesome 5 Pro, as the old index.html loaded it. The nav, footer and
        // burger menu all use `fa-*` classes, so without this every icon vanishes.
        //
        // NOTE: this pins a 2018 release of a paid product, loaded from
        // pro.fontawesome.com with an integrity hash. It still returns 200, but it is
        // worth confirming the Font Awesome account is current — and eventually
        // replacing ~8 icons with inline SVG, which would drop a blocking third-party
        // request entirely.
        {
          src: 'https://pro.fontawesome.com/releases/v5.0.10/js/all.js',
          integrity:
            'sha384-+1nLPoB0gaUktsZJP+ycZectl3GX7wP8Xf2PE/JHrb7X1u7Emm+v7wJMbAcPr8Ge',
          crossorigin: 'anonymous',
          defer: true,
        },
      ],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        // Bootstrap 4 and the vendored burger-menu styles are written against the
        // legacy @import API. Silencing the deprecation warnings rather than
        // rewriting 88 vendored files to @use, which is not this port's job.
        scss: {
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls'],
          // Bootstrap 4 interpolates colour keywords (`#{$green}`) in a way modern Sass
          // flags on every build. Filtered by message rather than silenced wholesale,
          // so a genuine warning from our own SCSS still gets through.
          logger: {
            warn(message: string, options: unknown) {
              if (message.includes('in interpolation here')) return
              console.warn(message, options)
            },
          },
        },
      },
    },
  },

  // The Drupal JSON:API backend. Supplied by environment, never hardcoded:
  // NUXT_PUBLIC_API_BASE and NUXT_PUBLIC_FILE_BASE — repository secrets in CI, .env
  // locally (see .env.example). `nuxt generate` bakes them into the static output.
  //
  // Two bases because file URIs are host-relative, not API-relative: a `file`
  // resource's `uri` is `/sites/default/files/...`, which hangs off the host root and
  // would 404 under the API prefix. The empty defaults make a missing environment fail
  // loudly at generate time (every fetch errors) instead of shipping a half-working
  // build.
  runtimeConfig: {
    public: {
      apiBase: '',
      fileBase: '',
    },
  },
})
