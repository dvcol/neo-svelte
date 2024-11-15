export const ShadowElevations = [-4, -3, -2, -1, -0.5, 0, 0.5, 1, 2, 3, 4] as const;
export type ShadowElevation = (typeof ShadowElevations)[number];

export const computeShadowElevation = (level: number | ShadowElevation, glass?: boolean) => {
  let shadow = `var(--neo-${glass ? 'glass-' : ''}box-shadow-`;
  if (!level) return `${shadow}flat`;
  shadow += level < 0 ? 'inset' : 'raised';
  return `${shadow}-${Math.trunc(Math.abs(level))})`;
};
