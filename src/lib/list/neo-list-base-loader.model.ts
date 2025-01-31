import type { NeoSkeletonTextProps } from '~/skeletons/neo-skeleton-text.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';

export type NeoListBaseLoaderProps = {
  loading?: boolean | number;
  select?: boolean;
  items?: number;

  transition?: HTMLTransitionProps['transition'];
} & NeoSkeletonTextProps;
