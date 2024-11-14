import type { Snippet } from 'svelte';
import type { NeoSkeletonContainerProps } from '~/skeleton/neo-skeleton-container.model.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoSkeletonTextProps = {
  // Snippets

  /**
   * Snippet to display as the skeleton content.
   */
  children?: Snippet;

  // States

  /**
   * Number of paragraphs to show.
   */
  paragraphs?: number;
  /**
   * Number of lines to show in each paragraph.
   */
  lines?: number;

  // Styles
  /**
   * Whether to show the alternative style (with various text segments of different sizes).
   */
  alt?: boolean;
  /**
   * Whether to show the title.
   */
  title?: boolean;
  /**
   * Justify the text to fill the width of the container.
   */
  justify?: boolean;

  // Other props
  /**
   * Props for the title div.
   */
  titleProps?: HTMLNeoBaseElement;
  /**
   * Props for the paragraph div.
   */
  paragraphProps?: HTMLNeoBaseElement;
} & Omit<NeoSkeletonContainerProps, 'children' | 'content'>;
