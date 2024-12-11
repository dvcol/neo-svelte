import type { HTMLButtonAttributes } from 'svelte/elements';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoAffixProps = {
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
   * The size of the inner svg
   */
  size?: string;
  /**
   * Props for the close button
   */
  closeProps?: HTMLButtonAttributes;
} & HTMLNeoBaseElement<HTMLSpanElement>;
