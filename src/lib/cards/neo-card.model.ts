import type { Snippet } from 'svelte';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { HTMLFlexProps, HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export const NeoCardElevations = [-4, -3, -2, -1, -0.5, 0, 0.5, 1, 2, 3, 4] as const;
export type NeoCardElevation = (typeof NeoCardElevations)[number];

export type NeoCardProps = {
  // Snippets

  children: Snippet;
  header?: Snippet;
  image?: Snippet;
  actions?: Snippet;
  footer?: Snippet;

  // States

  /**
   * The HTML tag to use for the card.
   * @default 'div'
   */
  tag?: keyof HTMLElementTagNameMap;

  // Styles

  /**
   * Card elevation.
   * @default 2
   */
  elevation?: NeoCardElevation;
  /**
   * By default, cards with no elevation will display a border.
   * If this is `true`, the card will never display a border.
   */
  borderless?: boolean;
  /**
   * If true, the card will be displayed with a glass effect.
   */
  glass?: boolean;
  /**
   * If true, the card will have a rounded border.
   */
  rounded?: boolean;
  /**
   * Weather to increase/decrease the elevation when hovered.
   */
  hover?: number;
  /**
   * If true, the card will start as flat on first render.
   * @see [@starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) for browser support
   */
  start?: boolean;
  close?: boolean;
  separator?: boolean;
  horizontal?: boolean;
} & HTMLNeoBaseElement &
  HTMLFlexProps &
  HTMLActionProps &
  HTMLRefProps;
