import type { NeoSkeletonTextProps } from '~/skeletons/neo-skeleton-text.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoListBaseLoaderProps = {
  /**
   * Whether to show the loader.
   */
  loading?: boolean;
  /**
   * Whether to style the loader as a select item.
   */
  select?: boolean;
  /**
   * Number of items to show.
   */
  items?: number;

  /**
   * Transition function to apply when adding items to the loader.
   */
  in: HTMLTransitionProps['in'];
  /**
   * Transition function to apply when removing items from the loader.
   */
  out: HTMLTransitionProps['out'];

  /**
   * Whether to style each 2n item as a description.
   */
  description?: string;
  /**
   * Whether to show the checkmark skeleton.
   */
  checkmark?: boolean;
  /**
   * Whether to show a before skeleton.
   */
  before?: boolean;
  /**
   * Whether to show an after skeleton.
   */
  after?: boolean;

  /**
   * Optional props to pass to the before skeleton.
   */
  beforeProps?: HTMLNeoBaseElement & { width?: CSSStyleDeclaration['width']; height?: CSSStyleDeclaration['height'] };
  /**
   * Optional props to pass to the after skeleton.
   */
  afterProps?: HTMLNeoBaseElement & { width?: CSSStyleDeclaration['width']; height?: CSSStyleDeclaration['height'] };
} & NeoSkeletonTextProps;
