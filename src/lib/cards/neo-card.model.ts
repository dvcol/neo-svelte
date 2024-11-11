import type { Snippet } from 'svelte';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

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
  loading?: boolean;
  skeleton?: boolean;

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

  glass?: boolean;
  close?: boolean;
  hover?: boolean | 'raise' | 'lower';
  separator?: boolean;
  start?: boolean;
  horizontal?: boolean;
} & HTMLNeoBaseElement &
  HTMLActionProps;
