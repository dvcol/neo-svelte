import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoDivider = {
  elevation?: number;
  vertical?: boolean;
  height?: CSSStyleDeclaration['height'];
  width?: CSSStyleDeclaration['width'];
} & HTMLNeoBaseElement;
