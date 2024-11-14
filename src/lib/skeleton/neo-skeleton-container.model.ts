import type { Snippet } from 'svelte';
import type { NeoTransitionContainerProps } from '~/container/NeoTransitionContainer.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';

export type NeoSkeletonContainerProps = {
  // Snippets

  /**
   * Snippet to display as the skeleton.
   */
  children?: Snippet;
  /**
   * Snippet to display as the content.
   */
  content?: Snippet;

  /**
   * Whether to show the skeleton.
   */
  loading?: boolean;

  /**
   * Props for the transition container.
   */
  containerProps?: NeoTransitionContainerProps;
} & Pick<HTMLTransitionProps, 'in' | 'out'>;
