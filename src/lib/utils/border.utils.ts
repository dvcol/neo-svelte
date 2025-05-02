export const BorderRadiusSize = Object.freeze({
  xs: 'var(--neo-border-radius-xs, 0.25rem)' as const,
  sm: 'var(--neo-border-radius-sm, 0.375rem)' as const,
  nm: 'var(--neo-border-radius, 0.5rem)' as const,
  md: 'var(--neo-border-radius-md, 0.75rem)' as const,
  lg: 'var(--neo-border-radius-lg, 1rem)' as const,
  xl: 'var(--neo-border-radius-xl, 1.5rem)' as const,
  xxl: 'var(--neo-border-radius-xxl, 2rem)' as const,
});

export type BorderRadiusSizes = keyof typeof BorderRadiusSize;
export type BorderRadiusInput = CSSStyleDeclaration['borderRadius'] | BorderRadiusSizes | boolean;

const isBorderRadiusSize = (value: BorderRadiusInput): value is BorderRadiusSizes => typeof value === 'string' && value in BorderRadiusSize;

export function computeBorderRadius(rounded?: BorderRadiusInput): string | undefined {
  if (typeof rounded === 'boolean' || rounded === undefined) return undefined;
  if (isBorderRadiusSize(rounded)) return BorderRadiusSize[rounded];
  return rounded;
}
