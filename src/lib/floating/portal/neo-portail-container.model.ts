import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoPortalContainerProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  /**
   * The HTML tag to use for the container.
   * @default 'div'
   */
  tag?: Tag;
  /**
   * Whether to scale the container when a portal dialog is open.
   */
  scale?: boolean;
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]> &
  HTMLRefProps<HTMLElementTagNameMap[Tag]>;
