# Drupal JSON:API schema — as it actually is

Mapped empirically against the live Drupal JSON:API (the base URL lives in the
NUXT_PUBLIC_API_BASE environment variable / repository secret) on 2026-08-04, by
walking the graph rather than trusting the old Ember models. **Several of those models
disagreed with reality**, so they are not a safe reference — see §5.

Resource type names are short (`page`, `section`, `article`), not Drupal's usual
`node--page` form. Attribute names are inconsistently cased: mostly camelCase
(`backgroundImageUrl`, `columnWidthLg`, `heroActive`) but sometimes snake_case
(`image_url`, `drupal_internal__id`). The normalizer deliberately does **not** rewrite
them — silent case-munging is how the `imageUrl` bug below went unnoticed for years.

## 1. The content graph

```
page
└── section          hasMany   (6 on /home)
    ├── backgroundImage  belongsTo -> file
    └── column       hasMany
        └── element   hasMany, POLYMORPHIC ─┬── text        { body }
                                            ├── image       { image_url, image -> file }
                                            ├── slideshow   { style, slide -> [slide] }
                                            └── listing     { listingType, listingCount }
slide
└── image            belongsTo -> file

article
└── bio              belongsTo -> bio
                     └── photo belongsTo -> file
```

### `element` is polymorphic — the important bit

`column.element` resolves to **concrete `text` / `image` / `slideshow` / `listing`
resources**. There is no `element` resource type. Components must dispatch on
`element.type`.

Census across all 41 columns: `text` ×32, `slideshow` ×1, `image` ×1, `listing` ×1.

Valid relationship fields on element types are only `element_type`, `uid`, and
(on `image`) `image`. Asking for anything else returns **HTTP 400** with a helpful
list of valid names.

### Deep includes work in one request

Drupal tolerates include paths whose trailing field exists on only *some* possible
target types, which means an entire page is one round trip (~30 resources, ~172KB
for `/home`):

```
?filter[slug]=/home&include=section,section.backgroundImage,section.column,
  section.column.element,section.column.element.image,
  section.column.element.slide,section.column.element.slide.image
```

## 2. Resource attributes

Every resource also carries `drupal_internal__*` ids, `created`, `changed`, and a
`metatag` array (pre-rendered meta tag descriptors — useful for `useHead`).

| Type | Attributes | Relationships |
|---|---|---|
| `page` | `title`, `slug`, `status`, `heroActive`, `navColor`, `path` | `section` (hasMany), `uid`, `node_type` |
| `section` | `title`, `animated`, `animation`, `background`, `backgroundImageUrl`, `colHorizontalAlignment`, `colVerticalAlignment`, `divider`, `extraClasses`, `heroSize`, `isHero`, `overlay`, `reverse`, `show` | `column` (hasMany), `backgroundImage` -> `file`, `layout_type` |
| `column` | `title`, `columnWidthXs/Sm/Md/Lg/Xl`, `extraClasses` | `element` (hasMany, polymorphic), `layout_type` |
| `text` | `body` | `element_type`, `uid` |
| `image` | `image_url` | `image` -> `file`, `element_type`, `uid` |
| `slideshow` | `style` | `slide` (hasMany), `element_type`, `uid` |
| `listing` | `listingType`, `listingCount` | — |
| `slide` | `body` | `image` -> `file` |
| `file` | `filename`, `uri`, `filemime`, `filesize`, `status` | `uid` |
| `article` | `title`, `body`, `dashedTitle`, `status`, `path`, `heroBackgroundUrl`, `heroColor`, `heroLayout`, `heroOverlay`, `navColor` | `bio` -> `bio`, `uid`, `node_type` |
| `bio` | `title`, `body`, `twitter`, `linkedin`, `professionalTitle` | `photo` -> `file` |

`file.uri` is host-relative (`/sites/default/files/…`), so absolute URLs join against
the **host**, not `/api` — hence the separate `fileBase` in `nuxt.config.ts`.

## 3. Verified query parameters

| Query | Works |
|---|---|
| `filter[slug]=/about` | ✅ pages are addressable by slug — no need for the hardcoded UUIDs the Ember routes used |
| `filter[dashedTitle]=lack-of-interest` | ✅ how blog posts are looked up |
| `filter[status]=1` | ✅ |
| `sort=-created` | ✅ |
| `page[limit]=N` | ✅ |

## 4. Content inventory

**11 pages:** `/home`, `/about`, `/consulting`, `/development`, `/development/approach`,
`/support`, `/contact`, `/blog`, `/pricing`, `/work`, `/404`.

⚠️ `/pricing`, `/work`, and `/development/approach` exist and are published in Drupal
but had **no route in the Ember app** — unreachable content. Decide whether to add
routes or leave them out; don't assume the old route list was complete.

**4 articles**, all published:

| `dashedTitle` (used in URLs) | Drupal `path.alias` |
|---|---|
| `lack-of-interest` | `/lack-interest` |
| `building-smallrobot-the-product` | `/building-small-robot-product` |
| `using-vuejs-app-in-d8-paragraph` | `/using-vuejs-app-d8-paragraph` |
| `potential-for-decoupled-development` | `/blog/potential-decoupled-development` |

⚠️ These disagree for **every** article. The Ember app routed on `dashedTitle`
(`/ideas/:article_dashedTitle`), so the live URLs are the left column. Keep them to
avoid breaking inbound links; the `path.alias` values are unused.

## 5. Where the old Ember models were wrong

Do not port these models as written.

| Model | Declared | Reality |
|---|---|---|
| `element.js` | `texts`, `images`, `listings`, `slideshows` hasMany | **None exist.** Requesting them is HTTP 400. `element` is polymorphic. |
| `image.js` | `imageUrl: attr('string')` | API sends `image_url`. With `keyForAttribute` returning the key unchanged, this was **always `undefined`** — a dead field. |
| `article.js` | `slugPath` computed from `this.slug` | `article.slug` is **null** for every article, so `this.slug.replace(...)` would throw. Dead code path. |
| `page.js` | `updated: attr('string')` | API sends `changed`. Always undefined. |
| `file.js` | `image`/`thumbnail` hasMany with inverses | `file` has only `uid`. These never resolved. |
| `video.js` | model exists | No `video` element type in any column. Unused. |
| `contact.js` | Ember Data model | Not a real API resource — the old contact form posted to Netlify Forms, not Drupal. |
| `user.js` | model exists | `uid` is on nearly every resource but is essentially never `included`. |

## 6. Reproducing this

`test/fixtures/*.json` are real captured responses (with `metatag` stripped for size),
so `npm test` exercises the true payload shape offline. Re-capture them if the Drupal
content model changes.
