export const ShadowElevations = [-4, -3, -2, -1, -0.5, 0, 0.5, 1, 2, 3, 4] as const;
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
