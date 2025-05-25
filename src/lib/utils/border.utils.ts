export const BorderRadiusSize = {
  'xs': 'var(--neo-border-radius-xs, 0.25rem)',
  'sm': 'var(--neo-border-radius-sm, 0.375rem)',
  'nm': 'var(--neo-border-radius, 0.5rem)',
  'md': 'var(--neo-border-radius-md, 0.75rem)',
  'lg': 'var(--neo-border-radius-lg, 1rem)',
  'xl': 'var(--neo-border-radius-xl, 1.5rem)',
  'xxl': 'var(--neo-border-radius-xxl, 2rem)',
  '3xl': 'var(--neo-border-radius-3xl, 3rem)',
} as const;

export type BorderRadiusSizes = keyof typeof BorderRadiusSize;
export type BorderRadiusInput = CSSStyleDeclaration['borderRadius'] | BorderRadiusSizes | boolean;

const isBorderRadiusSize = (value: BorderRadiusInput): value is BorderRadiusSizes => typeof value === 'string' && value in BorderRadiusSize;

export function computeBorderRadius(rounded?: BorderRadiusInput): string | undefined {
  if (typeof rounded === 'boolean' || rounded === undefined) return undefined;
  if (isBorderRadiusSize(rounded)) return BorderRadiusSize[rounded];
  return rounded;
}
