# smallrobotco

The Small Robot Co. website — [smallrobot.co](https://smallrobot.co).

A Nuxt 4 front end over a Drupal JSON:API backend, prerendered to static HTML and
self-hosted behind Apache. Rewritten in 2026 from the previous Ember 3.22 app.
[docs/API-SCHEMA.md](docs/API-SCHEMA.md) documents the CMS content graph as it actually
behaves.

## Requirements

Node 24 (active LTS), pinned in `.tool-versions`. Node 25 is *not* supported by Nuxt 4.

```sh
asdf install          # or otherwise get Node 24 on PATH
npm install
cp .env.example .env  # then fill in the real endpoint values
```

The CMS endpoints are supplied by environment (`NUXT_PUBLIC_API_BASE`,
`NUXT_PUBLIC_FILE_BASE`) — repository secrets in CI, `.env` locally. They are never
committed. A missing environment fails loudly at generate time rather than shipping a
build with no data.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Dev server at http://localhost:3000 |
| `npm run generate` | Prerender the whole site to static files in `.output/public` |
| `npm run preview` | Serve the built output locally |
| `npm test` | Unit tests (vitest) — the JSON:API normalizer, against captured fixtures |
| `npm run typecheck` | `nuxt typecheck` |
| `npm run diff:prod` | Compare a local build's text content against the live site, route by route |
| `npm run diff:structure` | Compare DOM structure against the live site |
| `npm run build` | Server build (not used — we deploy static output) |

Both diff commands need a `npm run generate` first. They exist as deploy verification:
the live site is prerendered too, so these are real HTML comparisons of what you built
against what is serving.

`diff:structure` matters because this site's CSS is unusually sensitive to DOM shape —
several stylesheet rules key off wrapper elements and `:nth-child()` parity, so a lost
wrapper silently unstyles whole sections without changing any text.

## Architecture notes

- **Prerendered, then live.** Every route is static HTML for crawlers and first paint;
  after hydration each page re-fetches its content from the CMS and refreshes again on
  tab focus, so content edits appear without a rebuild. A brand-new article *URL* still
  needs a rebuild to get its own file — trigger one manually or via CI on a schedule.
- **`public/.htaccess` ships with the site** and carries the redirects, cache tiers,
  compression, and the 404 handling (`/404/index.html` is a fully rendered CMS page,
  prerendered explicitly — see `nitro.prerender.routes`).
- **`public/sw.js` is a kill switch**, not a service worker: the previous site
  registered an aggressive offline cache, and this file unregisters it from returning
  visitors' browsers. Keep it served with `no-cache` (the htaccess does).
- **The contact form is intentionally absent** pending a backend. The old one posted to
  Netlify Forms; without that platform it would report success while discarding the
  message. Phone and email links are live on the contact page instead.

## Deployment

CI builds, tests, and deploys `.output/public` to the web host by rsync over SSH — on
every push to `main`, and manually via *Actions → CI → Run workflow* from any branch.
Configuration lives entirely in repository secrets (Settings → Secrets → Actions):

| Secret | Meaning |
|---|---|
| `DEPLOY_SSH_KEY` | private half of a dedicated deploy keypair |
| `DEPLOY_HOST` | server hostname or address |
| `DEPLOY_USER` | unprivileged deploy user that owns the docroot |
| `DEPLOY_PATH` | absolute path of the document root |
| `NUXT_PUBLIC_API_BASE` | CMS JSON:API base URL |
| `NUXT_PUBLIC_FILE_BASE` | CMS host that file URIs hang off |

Server expectations: Apache with `AllowOverride All` on the docroot (everything else
the site needs arrives in the `.htaccess`), and the deploy key's public half in the
deploy user's `~/.ssh/authorized_keys`.
