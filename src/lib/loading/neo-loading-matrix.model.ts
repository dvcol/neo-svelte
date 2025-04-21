import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export type NeoLoadingMatrixProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  /**
   * The HTML tag to use for the container.
   *
   * @default 'div'
   */
  tag?: Tag;
  /**
   * Size constraints for the loader icon.
   */
  width?: SizeInput<'width'>;
  /**
   * Size constraints for the loader icon.
   */
  height?: SizeInput<'height'>;
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
