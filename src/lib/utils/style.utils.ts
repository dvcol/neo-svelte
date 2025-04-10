export type SizeValue<Size extends 'width' | 'height' = 'width' | 'height'> = `${number}px` | Size extends 'width'
  ? CSSStyleDeclaration['width']
  : Size extends 'height'
    ? CSSStyleDeclaration['height']
    : CSSStyleDeclaration['height'] | CSSStyleDeclaration['width'];

export type SizeOption<Size extends 'width' | 'height' = 'width' | 'height', Value = SizeValue<Size>> = {
  absolute?: Value;
  min?: Value;
  max?: Value;
};

export type SizeInput<Size extends 'width' | 'height' = 'width' | 'height'> = number | SizeValue<Size> | SizeOption<Size, number | SizeValue<Size>>;

export const toPixel = (value?: number | string): string | undefined => {
  if (!value) return;
  return typeof value === 'number' ? `${value}px` : value;
};

export const isSizeOption = <Size extends 'width' | 'height' = 'width' | 'height'>(size?: SizeInput<Size>): size is SizeOption<Size> =>
  typeof size === 'object';

export const toSize = <Size extends 'width' | 'height' = 'width' | 'height'>(
  size?: SizeInput<Size>,
): SizeOption<Size, SizeValue<Size>> | undefined => {
  if (!size) return;
  if (typeof size === 'number') return { absolute: toPixel(size) };
  if (typeof size === 'string') return { absolute: size };
  return Object.entries(size).reduce<SizeOption<Size>>((acc, [key, value]) => {
    return { ...acc, [key]: toPixel(value) };
  }, {});
};
