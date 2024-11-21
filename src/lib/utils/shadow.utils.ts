export const MaxShadowElevation = 5;
export const MinShadowElevation = -5;
export const DefaultShadowElevation = 3;
export const ShadowElevations = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5] as const;
export type ShadowElevation = (typeof ShadowElevations)[number];

export const computeShadowElevation = (elevation: number | ShadowElevation, glass?: boolean) => {
  let shadow = `var(--neo-${glass ? 'glass-' : ''}box-shadow-`;
  if (!elevation) return `${shadow}flat`;
  shadow += elevation < 0 ? 'inset' : 'raised';
  return `${shadow}-${Math.trunc(Math.abs(elevation))})`;
};

export const computeHoverShadowElevation = (elevation: number | ShadowElevation, hover?: number | ShadowElevation, glass?: boolean) => {
  if (!hover) return;
  let level = elevation + hover;
  if (level < -4) level = -4;
  if (level > 4) level = 4;
  return computeShadowElevation(level, glass);
};

export const computeGlassFilter = (elevation: number | ShadowElevation, glass?: boolean) => {
  if (!glass) return;
  return `var(--neo-blur-${Math.min(Math.max(Math.abs(elevation + 2), 2), MaxShadowElevation)}) var(--neo-saturate-3)`;
};
