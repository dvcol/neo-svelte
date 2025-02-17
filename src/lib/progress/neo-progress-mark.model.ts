import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoProgressBarContext, NeoProgressBarProps } from '~/progress/neo-progress-bar.model.js';

export type NeoProgressMarkProps = {
  /**
   * The position of the mark (0-100).
   */
  position: NeoProgressBarProps['value'];
  /**
   * The progress state context from the parent progress.
   */
  context?: NeoProgressBarContext;
} & NeoButtonProps;
