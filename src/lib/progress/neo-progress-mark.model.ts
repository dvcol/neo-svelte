import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoProgressBarContext, NeoProgressBarProps } from '~/progress/neo-progress-bar.model.js';
import type { ShadowShallowElevation, ShadowShallowElevationString } from '~/utils/shadow.utils.js';

export type NeoProgressMarkElevation = ShadowShallowElevation | ShadowShallowElevationString;

export type NeoProgressMarkProps = {
  /**
   * The index of the mark in the parent progress's mark array.
   */
  index?: number;
  /**
   * The position of the mark (0-100).
   */
  position: NeoProgressBarProps['value'];
  /**
   * The progress state context from the parent progress.
   */
  context?: NeoProgressBarContext;
  /**
   * Input elevation.
   *
   * @default context?.elevation ?? 0
   */
  elevation?: NeoProgressMarkElevation;
} & Omit<NeoButtonProps, 'elevation'>;
