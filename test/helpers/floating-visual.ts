import type { ViewportName } from './visual.js';
import type { NeoPlacement } from '~/floating/common/neo-placement.model.js';

import { VIEWPORT_NAMES } from './visual.js';

export const ALL_PLACEMENTS: NeoPlacement[] = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
];

/**
 * Cardinal-only placements — useful when you want compact coverage of the
 * four sides without exhausting the 12-way matrix.
 */
export const CARDINAL_PLACEMENTS: NeoPlacement[] = ['top', 'bottom', 'left', 'right'];

export function forEachViewport(cb: (viewport: ViewportName) => void): void {
  for (const v of VIEWPORT_NAMES) cb(v);
}

export function forEachPlacement(cb: (placement: NeoPlacement) => void, list: NeoPlacement[] = ALL_PLACEMENTS): void {
  for (const p of list) cb(p);
}

/**
 * Interaction-state matrix for tooltip-style components. Each entry is a
 * named scenario plus the props needed to produce it.
 */
export const TOOLTIP_INTERACTION_MATRIX = [
  { name: 'hover', props: { openOnHover: true, openOnFocus: false, openOnClick: false } },
  { name: 'focus', props: { openOnHover: false, openOnFocus: true, openOnClick: false } },
  { name: 'click', props: { openOnHover: false, openOnFocus: false, openOnClick: true } },
] as const;
