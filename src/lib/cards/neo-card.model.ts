import type { Snippet } from 'svelte';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { HTMLFlexProps, HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';
import type { ShadowElevation } from '~/utils/shadow.utils.js';

export type NeoCardElevation = ShadowElevation;

export type NeoCardContext = {
  // Styles

  /**
   * Card elevation.
   * @default 2
   */
  elevation?: NeoCardElevation;
  /**
   * Weather to increase/decrease the elevation when hovered.
   */
  hover?: number;
  /**
   * By default, cards with no elevation will display a border.
   * If this is `true`, the card will never display a border.
   */
  borderless?: boolean;
  /**
   * If true, the card will have a rounded border.
   */
  rounded?: boolean;
  /**
   * If true, the card will be displayed with a glass effect.
   */
  glass?: boolean;
  /**
   * If true, a border will separate the card content from the header, footer, and action.
   * If a number is provided, a raised/inset divider will be displayed instead.
   */
  segmented?: boolean | number;
  /**
   * If true, the media will be displayed as a cover (no margin).
   */
  cover?: boolean;
  /**
   * If true, the card will start as flat on first render.
   * @see [@starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) for browser support
   */
  start?: boolean;
  /**
   * If true, the card will be displayed as a horizontal card.
   */
  horizontal?: boolean;
  /**
   * If true, the card will show a close butto.
   */
  close?: boolean;

  // Events

  /**
   * Callback when the close button is clicked.
   */
  onClose?: NeoButtonProps['onclick'];
};

export type NeoCardProps = {
  // Snippets
  /**
   * Snippet to display as the card content.
   */
  children: Snippet<[NeoCardContext]>;
  /**
   * Optional snippets to display as the card header.
   */
  header?: Snippet<[NeoCardContext]>;
  /**
   * Optional snippet to display as the card action.
   */
  action?: Snippet<[NeoCardContext]>;
  /**
   * Optional snippet to display as the card footer.
   */
  footer?: Snippet<[NeoCardContext]>;

  /**
   * Optional snippet to display as the card media.
   */
  media?: Snippet<[NeoCardContext]>;

  // States

  /**
   * The HTML tag to use for the card.
   * @default 'div'
   */
  tag?: keyof HTMLElementTagNameMap;
  /**
   * The HTML tag to use for the card content.
   */
  contentTag?: keyof HTMLElementTagNameMap;
  /**
   * The HTML tag to use for the card header.
   */
  headerTag?: keyof HTMLElementTagNameMap;
  /**
   * The HTML tag to use for the card action.
   */
  actionTag?: keyof HTMLElementTagNameMap;
  /**
   * The HTML tag to use for the card footer.
   */
  footerTag?: keyof HTMLElementTagNameMap;
  /**
   * The HTML tag to use for the card media.
   */
  mediaTag?: keyof HTMLElementTagNameMap;

  /**
   * Props for the card content.
   */
  contentProps?: HTMLNeoBaseElement;
  /**
   * Props for the card header.
   */
  headerProps?: HTMLNeoBaseElement;
  /**
   * Props for the card action
   */
  actionProps?: HTMLActionProps;
  /**
   * Props for the card footer.
   */
  footerProps?: HTMLNeoBaseElement;
  /**
   * Props for the card media.
   */
  mediaProps?: HTMLNeoBaseElement;
} & NeoCardContext &
  HTMLNeoBaseElement &
  HTMLFlexProps &
  HTMLActionProps &
  HTMLRefProps;