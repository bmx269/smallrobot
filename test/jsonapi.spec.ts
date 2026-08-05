import { describe, expect, it } from 'vitest'
import { many, normalize, one, type Resource } from '../app/utils/jsonapi'
import pageHome from './fixtures/page-home.json'
import articles from './fixtures/articles.json'

/**
 * Fixtures are real responses captured from the Drupal API (with the bulky
 * per-resource `metatag` arrays stripped). Testing against the actual payload shape
 * matters here: the old Ember models disagreed with this API in several places, so
 * hand-written fixtures would just re-encode those wrong assumptions.
 * See docs/API-SCHEMA.md.
 */

describe('normalize', () => {
  describe('the page graph', () => {
    const page = one(pageHome as never)!

    it('resolves the primary resource with attributes flattened on', () => {
      expect(page.type).toBe('page')
      expect(page.title).toBe('Home')
      expect(page.slug).toBe('/home')
    })

    it('resolves hasMany relationships to real objects, not identifiers', () => {
      const sections = page.section as Resource[]
      expect(sections).toHaveLength(6)
      expect(sections.every((s) => s.type === 'section')).toBe(true)
      // An identifier-only object would have no attributes.
      expect(sections.every((s) => 'created' in s)).toBe(true)
      expect(sections.some((s) => s.__unresolved)).toBe(false)
    })

    it('resolves four hops: page -> section -> column -> element -> slide', () => {
      const columns = (page.section as Resource[]).flatMap((s) => (s.column as Resource[]) ?? [])
      expect(columns.length).toBeGreaterThan(0)

      const elements = columns.flatMap((c) => (c.element as Resource[]) ?? [])
      expect(elements.length).toBeGreaterThan(0)

      const slideshow = elements.find((e) => e.type === 'slideshow')!
      expect(slideshow).toBeDefined()
      expect(slideshow.slide as Resource[]).toHaveLength(6)
    })

    it('keeps polymorphic element types distinct', () => {
      // `column.element` is polymorphic: it resolves to concrete text/image/slideshow/
      // listing resources. Nothing is ever typed literally "element" — the old Ember
      // element model assumed otherwise.
      const elements = (page.section as Resource[])
        .flatMap((s) => (s.column as Resource[]) ?? [])
        .flatMap((c) => (c.element as Resource[]) ?? [])

      const types = new Set(elements.map((e) => e.type))
      expect(types.size).toBeGreaterThan(1)
      expect(types).not.toContain('element')
      expect(types).toContain('text')
    })

    it('resolves a file through an image element, for fileUrl()', () => {
      const image = (page.section as Resource[])
        .flatMap((s) => (s.column as Resource[]) ?? [])
        .flatMap((c) => (c.element as Resource[]) ?? [])
        .find((e) => e.type === 'image')!

      const file = image.image as Resource
      expect(file.type).toBe('file')
      expect(file.uri).toMatch(/^\/sites\/default\/files\//)
    })

    it('captures image alt text from the relationship meta', () => {
      // Drupal puts alt/title/width/height on the resource *identifier*, not on the
      // file. The old template read `element.image.alt` off the file, where it does
      // not exist, so alt text was silently missing from every image.
      const image = (page.section as Resource[])
        .flatMap((s) => (s.column as Resource[]) ?? [])
        .flatMap((c) => (c.element as Resource[]) ?? [])
        .find((e) => e.type === 'image')!

      const m = image.$meta?.image as Record<string, unknown>
      expect(m).toBeDefined()
      expect(m.alt).toBe('Drupal Ember Vuejs Wordpress Logos')
      expect(m.width).toBe(100)
    })

    it('keeps relationship meta off the shared related object', () => {
      // $meta belongs to the link, not the resource — otherwise two references to one
      // file would fight over alt text on the same shared object.
      const image = (page.section as Resource[])
        .flatMap((s) => (s.column as Resource[]) ?? [])
        .flatMap((c) => (c.element as Resource[]) ?? [])
        .find((e) => e.type === 'image')!

      const file = image.image as Resource
      expect(file.alt).toBeUndefined()
      // The file may carry $meta for its *own* outgoing links (Drupal puts meta on
      // `uid`), but the alt from the incoming reference must not have leaked onto it.
      expect(file.$meta?.alt).toBeUndefined()
      expect(Object.values(file.$meta ?? {})).not.toContainEqual(
        expect.objectContaining({ alt: 'Drupal Ember Vuejs Wordpress Logos' }),
      )
    })

    it('omits $meta entirely when no reference carries meta', () => {
      const bare = one({
        data: { type: 'a', id: '1', relationships: { b: { data: { type: 'b', id: '2' } } } },
      })!
      expect(bare.$meta).toBeUndefined()
    })

    it('aligns hasMany meta with the relationship array', () => {
      const r = one({
        data: {
          type: 'a',
          id: '1',
          relationships: {
            things: {
              data: [
                { type: 'b', id: '1', meta: { alt: 'first' } },
                { type: 'b', id: '2', meta: { alt: 'second' } },
              ],
            },
          },
        },
      })!
      expect(r.$meta?.things).toEqual([{ alt: 'first' }, { alt: 'second' }])
    })

    it('gives repeated references the same object, not copies', () => {
      const all = new Map<string, Resource>()
      const walk = (r: Resource) => {
        const k = `${r.type}:${r.id}`
        if (all.has(k)) {
          expect(all.get(k)).toBe(r) // identity, not deep-equality
          return
        }
        all.set(k, r)
        for (const v of Object.values(r)) {
          if (Array.isArray(v)) v.forEach((x) => x && typeof x === 'object' && walk(x as Resource))
          else if (v && typeof v === 'object' && 'type' in v) walk(v as Resource)
        }
      }
      walk(page)
      expect(all.size).toBeGreaterThan(10)
    })
  })

  describe('the article list', () => {
    const list = many(articles as never)

    it('returns every published article', () => {
      expect(list).toHaveLength(4)
      expect(list.every((a) => a.type === 'article')).toBe(true)
    })

    it('preserves API sort order (newest first)', () => {
      const dates = list.map((a) => a.created as string)
      expect([...dates].sort().reverse()).toEqual(dates)
    })

    it('resolves the bio relationship', () => {
      const withBio = list.find((a) => a.bio && !(a.bio as Resource).__unresolved)!
      expect(withBio).toBeDefined()
      expect((withBio.bio as Resource).type).toBe('bio')
    })
  })

  describe('edge cases', () => {
    it('handles empty and absent documents', () => {
      expect(normalize({ data: [] })).toEqual([])
      expect(normalize({ data: null })).toBeNull()
      expect(normalize({})).toBeNull()
      expect(many({ data: [] })).toEqual([])
      expect(one({ data: null })).toBeNull()
    })

    it('distinguishes an empty relationship from an unfetched one', () => {
      // `data: null` is real emptiness and becomes null...
      const empty = one({
        data: { type: 'a', id: '1', relationships: { thing: { data: null } } },
      })!
      expect(empty.thing).toBeNull()

      // ...but a relationship object with no `data` member was never fetched, so the
      // key stays absent rather than claiming the relationship is empty.
      const unfetched = one({
        data: { type: 'a', id: '1', relationships: { thing: {} } },
      })!
      expect('thing' in unfetched).toBe(false)
    })

    it('marks references that were not included rather than dropping them', () => {
      const r = one({
        data: { type: 'a', id: '1', relationships: { thing: { data: { type: 'b', id: '9' } } } },
      })!
      // Dropping these silently would make a forgotten `include` look like empty data.
      expect(r.thing).toEqual({ type: 'b', id: '9', __unresolved: true })
    })

    it('shares one object across repeated unresolved references', () => {
      // Regression: placeholders were originally minted per reference, so two pointers
      // to the same missing resource compared unequal by identity while resolved ones
      // did not. Drupal puts an almost-never-included `uid` on every resource, so this
      // is the common path.
      const doc = {
        data: [
          { type: 'a', id: '1', relationships: { uid: { data: { type: 'user', id: 'u' } } } },
          { type: 'a', id: '2', relationships: { uid: { data: { type: 'user', id: 'u' } } } },
        ],
      }
      const [first, second] = many(doc) as Resource[]
      expect(first!.uid).toBe(second!.uid)
      expect((first!.uid as Resource).__unresolved).toBe(true)
    })

    it('preserves empty hasMany as an empty array', () => {
      const r = one({
        data: { type: 'a', id: '1', relationships: { things: { data: [] } } },
      })!
      expect(r.things).toEqual([])
    })

    it('terminates on self-referential and mutual cycles', () => {
      const self = one({
        data: { type: 'a', id: '1', relationships: { self: { data: { type: 'a', id: '1' } } } },
      })!
      expect(self.self).toBe(self)

      const mutual = one({
        data: { type: 'a', id: '1', relationships: { b: { data: { type: 'b', id: '2' } } } },
        included: [{ type: 'b', id: '2', relationships: { a: { data: { type: 'a', id: '1' } } } }],
      })!
      expect((mutual.b as Resource).a).toBe(mutual)
    })
  })
})
