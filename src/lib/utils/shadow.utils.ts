export const MaxShadowElevation = 5;
export const MinShadowElevation = -5;
export const DefaultShadowElevation = 3;
export const DefaultShadowPressedElevation = -2;
export const DefaultShadowHoverElevation = -1;
export const DefaultShadowHoverPressedElevation = 0;
export const ShadowElevations = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5] as const;
export type ShadowElevation = (typeof ShadowElevations)[number];
export type ShadowModifier = { glass?: boolean; convex?: boolean; pressed?: boolean };
export const ShadowFlatRegex = /^.*flat\)?;?$/;

export const getDefaultElevation = (pressed?: boolean) => (pressed ? DefaultShadowPressedElevation : DefaultShadowElevation);
export const getDefaultHoverElevation = (pressed?: boolean) => (pressed ? DefaultShadowHoverPressedElevation : DefaultShadowHoverElevation);

export const isShadowFlat = (shadow: string) => ShadowFlatRegex.test(shadow);

export const computeShadowElevation = (elevation: number | ShadowElevation, { glass, convex, pressed }: ShadowModifier = {}) => {
  const raided = convex ? 'convex' : 'raised';
  const inset = pressed ? 'pressed' : 'inset';
  let shadow = `var(--neo-${glass ? 'glass-' : ''}box-shadow-`;
  if (!elevation) return `${shadow}flat)`;
  shadow += elevation < 0 ? inset : raided;
  return `${shadow}-${Math.trunc(Math.abs(elevation))})`;
};

export const computeHoverShadowElevation = (elevation: number | ShadowElevation, hover?: number | ShadowElevation, options?: ShadowModifier) => {
  if (!hover) return;
  let level = elevation + hover;
  if (level < MinShadowElevation) level = MinShadowElevation;
  if (level > MaxShadowElevation) level = MaxShadowElevation;
  return computeShadowElevation(level, options);
};

export const computeGlassFilter = (elevation: number | ShadowElevation, glass?: boolean) => {
  if (!glass) return;
  return `var(--neo-blur-${Math.abs(elevation)}) var(--neo-saturate-3)`;
};

export const computeButtonShadows = (elevation: number | ShadowElevation, text?: boolean) => {
  if (text) return;
  return `
      --neo-btn-box-shadow: var(--neo-box-shadow-raised-${Math.min(Math.abs(elevation), 3)});
      --neo-btn-box-shadow-hover: var(--neo-box-shadow-raised-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      --neo-btn-box-shadow-focus: var(--neo-box-shadow-raised-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      --neo-btn-box-shadow-active: var(--neo-box-shadow-pressed-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      --neo-btn-box-shadow-focus-active: var(--neo-box-shadow-pressed-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      `;
};
