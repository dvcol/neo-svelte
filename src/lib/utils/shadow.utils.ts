import { clamp } from '@dvcol/common-utils/common/math';

export const MaxShadowElevation = 5;
export const MinShadowElevation = -5;
export const DefaultShallowMinMaxElevation: { min: ShadowElevation; max: ShadowElevation } = { max: 2, min: -2 };

export const DefaultShadowElevation = 3;
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
export const ShadowShallowElevations = [-2, -1, 0, 1, 2] as const;
export type ShadowShallowElevation = (typeof ShadowShallowElevations)[number];
export type ShadowShallowElevationString = `${ShadowShallowElevation}`;

export const PositiveShadowElevations = [0, 1, 2, 3, 4, 5] as const;
export type PositiveShadowElevation = (typeof PositiveShadowElevations)[number];
export type PositiveShadowElevationString = `${PositiveShadowElevation}`;

export type ShadowModifier = { glass?: boolean; convex?: boolean; pressed?: boolean };
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

export const coerce = <Elevation extends number = ShadowElevation>(elevation: Elevation | `${Elevation}`): Elevation =>
  Number(elevation) as Elevation;

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
  { glass, convex, pressed }: ShadowModifier = {},
  minMax: { min?: ShadowElevation; max?: ShadowElevation } = {},
) => {
  const raided = convex ? 'convex' : 'raised';
  const inset = pressed ? 'pressed' : 'inset';
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
  { max = MaxShadowElevation, saturation = DefaultSaturation }: { max?: ShadowElevation; saturation?: number } = {},
) => {
  if (!glass) return;
  const _elevation = Math.abs(elevation);
  if (_elevation > max) return `var(--neo-blur-${max}) var(--neo-saturate-${saturation})`;
  return `var(--neo-blur-${Math.abs(_elevation)}) var(--neo-saturate-${saturation})`;
};

export const computeButtonShadows = (elevation: number | ShadowElevation, text?: boolean) => {
  if (text) return;
  return `
      --neo-btn-box-shadow: var(--neo-box-shadow-raised-${Math.min(Math.abs(elevation), 3)});
      --neo-btn-box-shadow-hover: var(--neo-box-shadow-raised-${clamp(Math.abs(elevation) - 1, 1, 2)});
      --neo-btn-box-shadow-focus: var(--neo-box-shadow-raised-${clamp(Math.abs(elevation) - 1, 1, 2)});
      --neo-btn-box-shadow-active: var(--neo-box-shadow-pressed-${clamp(Math.abs(elevation) - 1, 1, 2)});
      --neo-btn-box-shadow-focus-active: var(--neo-box-shadow-pressed-${clamp(Math.abs(elevation) - 1, 1, 2)});
      `;
};
