export const Colors = {
  Primary: 'primary',
  Secondary: 'secondary',
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
} as const;

export type Color = (typeof Colors)[keyof typeof Colors];

export const ColorVariables = {
  [Colors.Primary]: '--neo-color-primary',
  [Colors.Secondary]: '--neo-color-secondary',
  [Colors.Success]: '--neo-color-success',
  [Colors.Warning]: '--neo-color-warning',
  [Colors.Error]: '--neo-color-error',
} as const;

export const getColorVariable = (color?: Color | string): string | undefined => {
  if (!color || !ColorVariables[color as Color]) return color;
  return `var(${ColorVariables[color as Color]})`;
};
