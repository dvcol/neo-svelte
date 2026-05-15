import type { RouteParamValue } from '@dvcol/svelte-simple-router/models';

type Query = Record<string, RouteParamValue>;

export function queryBool(query: Query, name: string, fallback = false): boolean {
  const value = query[name];
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  return value === '' || value === 'true' || value === '1';
}

export function queryString<T extends string = string>(query: Query, name: string, fallback?: T): T | undefined {
  const value = query[name];
  if (value === undefined || value === null) return fallback;
  return String(value) as T;
}

export function queryNumber(query: Query, name: string, fallback?: number): number | undefined {
  const value = query[name];
  if (value === undefined || value === null) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Coerce a single URL-derived query value to its likely typed form. Used by
 * `TestHarness.svelte` which forwards the entire query record to a harness
 * via `{...rest}` — the harness's `$props()` defaults handle missing values,
 * but boolean and numeric strings need to become real booleans/numbers so the
 * Svelte component receives the type its prop signature expects.
 *
 * Heuristics (in order):
 *   1. `'true' | 'false' | ''` → boolean (`''` is the bare flag form `?openOnHover`)
 *   2. finite numeric string → number
 *   3. otherwise → string passthrough
 */
export function coerceQueryValue(value: RouteParamValue): unknown {
  if (value === undefined || value === null) return value;
  if (typeof value !== 'string') return value;
  if (value === 'true' || value === '') return true;
  if (value === 'false') return false;
  const n = Number(value);
  if (value.trim() !== '' && Number.isFinite(n)) return n;
  return value;
}

export function coerceQuery(query: Query): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(query)) out[k] = coerceQueryValue(v);
  return out;
}
