import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoAffixProps<Tag extends keyof HTMLElementTagNameMap = 'span'> = {
  // Snippets
  /**
   * Optional close icon snippet.
   */
  reset?: Snippet<[{ size?: string }]>;
  /**
   * Optional loading icon snippet.
   */
  loader?: Snippet<[{ size?: string }]>;
  /**
   * Optional validation icon snippet.
   */
  validation?: Snippet<[{ valid?: boolean; size?: string }]>;

  /**
   * The HTML tag to use for the affix.
   * @default span
   */
  tag?: Tag;
  /**
   * Display loading indicator
   */
  loading?: boolean;
  /**
   * Display a close button if not loading
   */
  close?: boolean;
  /**
   * Display validation state if not loading or closable
   */
  valid?: boolean;
  /**
   * Display a skeleton state
   */
  skeleton?: boolean;
  /**
   * Display a disabled state
   */
  disabled?: boolean;
  /**
   * Disable close button
   */
  readonly?: boolean;
  /**
   * The size of the inner svg
   */
  size?: string;
  /**
   * Props for the close button
   */
  closeProps?: HTMLButtonAttributes;
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]> &
  HTMLRefProps<HTMLElementTagNameMap[Tag]> &
  HTMLTransitionProps;
