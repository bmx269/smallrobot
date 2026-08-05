/**
 * Service worker kill switch.
 *
 * The Ember site registered a service worker at this exact path, with `scope: '/'`, via
 * ember-service-worker + ember-service-worker-prember. It cached the prerendered HTML for
 * every route (`esw-prember-47-*` cache keys) and called skipWaiting() + clients.claim().
 *
 * That worker is still installed in the browser of every returning visitor. Left alone it
 * would keep serving the OLD site from cache after cutover, for the whole origin, for as
 * long as those caches survive — so the new site would simply not appear for them.
 *
 * This file replaces it and then removes itself. Browsers always revalidate the service
 * worker script against the network (the SW never serves its own script), so a returning
 * visitor picks this up on their next navigation, at which point it unregisters, deletes
 * every cache, and reloads open tabs onto the real site.
 *
 * IMPORTANT: keep this file served with `no-cache` — see public/.htaccess. If an
 * intermediary caches the old sw.js, affected visitors stay stuck.
 *
 * This can be deleted once enough time has passed that no meaningful number of visitors
 * still carry the old worker. There is no urgency: an empty kill switch costs one
 * conditional request per visitor per day.
 */

self.addEventListener('install', () => {
  // Don't wait for existing tabs to close; the old worker is actively serving stale HTML.
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Order matters: unregister first, so a failure in cache deletion below cannot
      // leave this worker installed and in control.
      await self.registration.unregister()

      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))

      // Reload any open tabs. Without this they keep whatever the old worker already
      // handed them until the visitor navigates manually.
      const clients = await self.clients.matchAll({ type: 'window' })
      for (const client of clients) {
        // Can reject for cross-origin or non-controlled clients; a missed reload is
        // harmless, an unhandled rejection here is not.
        try {
          await client.navigate(client.url)
        } catch {
          /* ignore */
        }
      }
    })(),
  )
})

// Deliberately no `fetch` handler: with none registered, requests go straight to the
// network rather than through this worker.
