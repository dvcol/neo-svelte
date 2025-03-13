import { clamp } from '@dvcol/common-utils/common/math';

import { type NeoButtonTemplate, NeoTextButton } from '~/buttons/neo-button.model.js';

export const MaxShadowElevation = 5;
export const MinShadowElevation = -5;
export const MaxShallowShadowElevation = 3;
export const MinShallowShadowElevation = -3;
export const DefaultShallowMinMaxElevation: { min: ShadowElevation; max: ShadowElevation } = {
  max: MaxShallowShadowElevation,
  min: MinShallowShadowElevation,
};

export const DefaultShadowElevation = 3;
export const DefaultShadowActiveElevation = -2;
export const DefaultShadowPressedElevation = -2;

export const ShadowElevations = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5] as const;
export type ShadowElevation = (typeof ShadowElevations)[number];
export type ShadowElevationString = `${ShadowElevation}`;

export const DefaultShadowHoverElevation = -1;
export const DefaultShadowHoverPressedElevation = 0;

export const ShadowHoverElevations = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type ShadowHoverElevation = (typeof ShadowHoverElevations)[number];
export type ShadowHoverElevationsString = `${ShadowHoverElevation}`;

export const DefaultShadowShallowElevation = 2;
export const ShadowShallowElevations = [-3, -2, -1, 0, 1, 2, 3] as const;
export type ShadowShallowElevation = (typeof ShadowShallowElevations)[number];
export type ShadowShallowElevationString = `${ShadowShallowElevation}`;

export const PositiveShadowElevations = [0, 1, 2, 3, 4, 5] as const;
export type PositiveShadowElevation = (typeof PositiveShadowElevations)[number];
export type PositiveShadowElevationString = `${PositiveShadowElevation}`;
export const PositiveMinMaxElevation: { min: 0; max: ShadowElevation } = { min: 0, max: MaxShadowElevation };

export const BlurElevations = [0, 1, 2, 3, 4, 5] as const;
export type BlurElevation = (typeof BlurElevations)[number];
export type BlurElevationString = `${BlurElevation}`;

export type ShadowModifier = { glass?: boolean; convex?: boolean; pressed?: boolean; active?: boolean };
export const ShadowFlatRegex = /^.*flat\)?;?$/;

export const DefaultSaturation = 3;

export const getDefaultElevation = (pressed?: boolean, fallback: ShadowElevation = DefaultShadowElevation) =>
  pressed ? DefaultShadowPressedElevation : fallback;
export const getDefaultHoverElevation = (pressed?: boolean, fallback: ShadowElevation = DefaultShadowHoverElevation) =>
  pressed ? DefaultShadowHoverPressedElevation : fallback;

export const getDefaultSlideElevation = (elevation: ShadowElevation, fallback: ShadowElevation = DefaultShadowPressedElevation): ShadowElevation => {
  if (elevation < 0) return Math.abs(elevation) as ShadowElevation;
  return fallback;
};

export function coerce<Elevation extends number = ShadowElevation>(
  elevation: Elevation | `${Elevation}`,
  { min, max }: { min?: ShadowElevation; max?: ShadowElevation } = {},
): Elevation {
  if (elevation === undefined || elevation === null) return elevation;
  const _elevation = Number(elevation);
  if (min !== undefined && _elevation < min) return min as Elevation;
  if (max !== undefined && _elevation > max) return max as Elevation;
  return _elevation as Elevation;
}

export function parseBlur(
  blur?: BlurElevation | BlurElevationString,
  elevation?: ShadowElevation | ShadowElevationString,
  minMax: { min?: BlurElevation; max?: BlurElevation } = { min: 1, max: 5 },
): BlurElevation {
  if (!blur || elevation === undefined) return minMax.min ?? 1;
  return coerce<ShadowElevation>(blur ?? elevation, minMax) as BlurElevation;
}

export const isShadowFlat = (shadow: string) => ShadowFlatRegex.test(shadow);

export const computeElevation = (
  elevation: number | ShadowElevation,
  { min = MinShadowElevation, max = MaxShadowElevation }: { min?: ShadowElevation; max?: ShadowElevation } = {},
) => {
  if (elevation < min) return min;
  if (elevation > max) return max;
  return elevation;
};

export const computeShadowElevation = (
  elevation: number | ShadowElevation,
  { glass, convex, pressed, active }: ShadowModifier = {},
  minMax: { min?: ShadowElevation; max?: ShadowElevation } = {},
) => {
  const raided = convex ? 'convex' : 'raised';
  let inset = 'inset';
  if (pressed) inset = 'pressed';
  if (active) inset = 'active';
  let shadow = `var(--neo-${glass ? 'glass-' : ''}box-shadow-`;
  const level = computeElevation(elevation, minMax);
  if (!level) return `${shadow}flat)`;
  shadow += level < 0 ? inset : raided;
  return `${shadow}-${Math.trunc(Math.abs(level))})`;
};

export const computeHoverShadowElevation = (
  elevation: number | ShadowElevation,
  hover?: number | ShadowElevation,
  options?: ShadowModifier,
  minMax: { min?: ShadowElevation; max?: ShadowElevation } = {},
) => {
  if (!hover) return;
  return computeShadowElevation(elevation + hover, options, minMax);
};

export const computeGlassFilter = (
  elevation: number | ShadowElevation,
  glass?: boolean,
  { min = 1, max = MaxShadowElevation, saturation = DefaultSaturation }: { min?: ShadowElevation; max?: ShadowElevation; saturation?: number } = {},
) => {
  if (!glass) return;
  return `var(--neo-blur-${clamp(Math.abs(elevation), min, max)}) var(--neo-saturate-${saturation})`;
};

export const computeButtonTemplate = (elevation: number | ShadowElevation, pressed?: boolean, text?: boolean): NeoButtonTemplate => {
  if (text || elevation >= 0) return NeoTextButton;
  return { elevation: Math.min(Math.abs(elevation), 3) as ShadowElevation, hover: 0, active: -2, pressed: true, borderless: true };
};
