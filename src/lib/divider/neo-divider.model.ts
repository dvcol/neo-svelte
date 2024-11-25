import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoDividerProps = {
  elevation?: number;
  vertical?: boolean;
  height?: CSSStyleDeclaration['height'];
  width?: CSSStyleDeclaration['width'];
} & HTMLNeoBaseElement;
