/**
 * Minimal JSON:API normalizer.
 *
 * Replaces what Ember Data's JSONAPIAdapter/JSONAPISerializer were doing: take a
 * JSON:API document, resolve every `relationships` reference against `included`, and
 * hand back plain objects whose relationships are the actual related objects.
 *
 * Deliberately small. Drupal's JSON:API here is read-only for our purposes — no
 * writes, no cache invalidation, no identity map spanning requests — so none of Ember
 * Data's machinery is needed. One request per page returns the whole graph (see
 * PAGE_INCLUDE in composables/useDrupal.ts).
 */

export interface ResourceIdentifier {
  type: string
  id: string
  /** Drupal hangs image `alt` / `title` / `width` / `height` off the *reference*. */
  meta?: Record<string, unknown>
}

export interface Resource extends ResourceIdentifier {
  /** True when the reference appeared in `relationships` but was never `included`. */
  __unresolved?: true
  /**
   * Meta from the resource identifiers this node points at, keyed by relationship
   * name — a single object for belongsTo, an aligned array for hasMany.
   *
   * It lives here rather than on the related object because it describes the *link*,
   * not the resource: the same file referenced from two places can carry different alt
   * text, and merging it into the file would make those two references disagree about
   * a shared object.
   */
  $meta?: Record<string, Record<string, unknown> | undefined | Array<Record<string, unknown> | undefined>>
  [key: string]: unknown
}

interface RawResource {
  type: string
  id: string
  attributes?: Record<string, unknown>
  relationships?: Record<
    string,
    { data?: ResourceIdentifier | ResourceIdentifier[] | null }
  >
}

export interface JsonApiDocument {
  data?: RawResource | RawResource[] | null
  included?: RawResource[]
  errors?: Array<{ detail?: string; title?: string }>
  meta?: Record<string, unknown>
  links?: Record<string, unknown>
}

const key = (r: ResourceIdentifier) => `${r.type}:${r.id}`

/**
 * Resolve a document into plain objects with relationships wired up.
 *
 * Two passes, because the graph can contain cycles (and Drupal happily emits
 * back-references): build every node first, then link them. Linking by object
 * identity means a cycle just points back at the same object instead of recursing
 * forever.
 */
export function normalize(doc: JsonApiDocument): Resource | Resource[] | null {
  if (!doc || !doc.data) return Array.isArray(doc?.data) ? [] : null

  const primary = Array.isArray(doc.data) ? doc.data : [doc.data]
  const all = [...primary, ...(doc.included ?? [])]

  // Pass 1 — a node per resource, attributes flattened on.
  const nodes = new Map<string, Resource>()
  for (const raw of all) {
    nodes.set(key(raw), { type: raw.type, id: raw.id, ...raw.attributes })
  }

  // Pass 2 — wire relationships by object identity.
  for (const raw of all) {
    const node = nodes.get(key(raw))!
    for (const [name, rel] of Object.entries(raw.relationships ?? {})) {
      // A relationship object without a `data` member wasn't fetched — leave the key
      // absent rather than inventing null, so callers can tell "empty" from "not asked
      // for". `data: null` and `data: []` are real emptiness and are preserved.
      if (!rel || !('data' in rel)) continue

      const refs = rel.data
      if (Array.isArray(refs)) {
        node[name] = refs.map((ref) => resolve(nodes, ref))
        if (refs.some((ref) => ref.meta)) meta(node)[name] = refs.map((ref) => ref.meta)
      } else if (refs) {
        node[name] = resolve(nodes, refs)
        if (refs.meta) meta(node)[name] = refs.meta
      } else {
        node[name] = null
      }
    }
  }

  return Array.isArray(doc.data)
    ? primary.map((raw) => nodes.get(key(raw))!)
    : nodes.get(key(primary[0]!))!
}

/**
 * Look up a reference, creating a placeholder if it was never `included`.
 *
 * Placeholders are kept rather than dropped, so a forgotten `include` surfaces as an
 * obviously-incomplete object instead of silently vanishing from a list.
 *
 * They are also memoised into the same map as real resources. Minting a fresh object
 * per reference would mean two pointers to one missing resource compared unequal by
 * identity — an inconsistency with the resolved path, where every reference to a given
 * resource is the same object. Drupal emits plenty of these (`uid` -> `user` is on
 * nearly every resource and is rarely included), so this is the common case, not an
 * edge case.
 */
/** Lazily create the node's `$meta` bag, so nodes without relationship meta stay clean. */
function meta(node: Resource): NonNullable<Resource['$meta']> {
  node.$meta ??= {}
  return node.$meta
}

function resolve(nodes: Map<string, Resource>, ref: ResourceIdentifier): Resource {
  const k = key(ref)
  let node = nodes.get(k)
  if (!node) {
    node = { type: ref.type, id: ref.id, __unresolved: true }
    nodes.set(k, node)
  }
  return node
}

/**
 * Narrow an attribute to a string for class / style / text bindings.
 *
 * Resource attributes are typed `unknown` because the API is not statically described,
 * and Vue rightly refuses `unknown` where it wants a ClassValue. Returns undefined for
 * anything non-string so an absent attribute renders as nothing rather than "undefined".
 */
export function str(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined
}

/** Narrow a normalize() result to a single resource. */
export function one(doc: JsonApiDocument): Resource | null {
  const r = normalize(doc)
  if (!r) return null
  return Array.isArray(r) ? (r[0] ?? null) : r
}

/** Narrow a normalize() result to a list. */
export function many(doc: JsonApiDocument): Resource[] {
  const r = normalize(doc)
  if (!r) return []
  return Array.isArray(r) ? r : [r]
}
