import type { Snippet } from 'svelte';

import type { NeoProgressProps, NeoProgressState } from '~/progress/neo-progress.model.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { HTMLNeoBaseElement, HTMLTagProps } from '~/utils/html-element.utils.js';
import type { BlurElevation, BlurElevationString, ShadowShallowElevation, ShadowShallowElevationString } from '~/utils/shadow.utils.js';

export type NeoProgressBlur = BlurElevation | BlurElevationString;
export type NeoProgressElevation = ShadowShallowElevation | ShadowShallowElevationString;

interface NeoProgressBarStyle {
  // Shadow

  /**
   * Progress elevation (-2 to 2).
   */
  elevation?: NeoProgressElevation;
  /**
   * The blur level to apply when in glass mode.
   *
   * @default elevation, min: 1, max: 5
   * @see glass
   */
  blur?: NeoProgressBlur;

  // Styles

  /**
   * Display the progress as borderless.
   */
  borderless?: boolean;
  /**
   * Rounds border radius.
   */
  rounded?: BorderRadiusInput;
  /**
   * Recess the content of the progress if elevation is inset (< 0).
   */
  pressed?: boolean;
  /**
   * Display the progress with a glass effect.
   */
  glass?: boolean;
  /**
   * Display the progress as flat on first render.
   */
  start?: boolean;
  /**
   * Display the progress with a rail track.
   */
  track?: boolean;
}

export type NeoProgressBarContext = NeoProgressState & NeoProgressBarStyle;
export interface NeoProgressBarMarkContext {
  index: number;
  position: number;
  context: NeoProgressBarContext;
}

export type NeoProgressBarProps<Tag extends keyof HTMLElementTagNameMap = 'div', ContainerTag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets
  /**
   * Optional content to display inside the progress bar.
   */
  children?: Snippet<[NeoProgressBarContext]>;
  /**
   * Optional content to display inside the inner progress component.
   */
  progress?: NeoProgressProps<Tag>['children'];
  /**
   * Optional content to display before the progress bar.
   */
  before?: Snippet<[NeoProgressBarContext]> | string;
  /**
   * Optional content to display after the progress bar.
   */
  after?: Snippet<[NeoProgressBarContext]> | string;
  /**
   * Optional mark to display on progress threshold.
   */
  mark?: Snippet<[NeoProgressBarMarkContext]> | string;

  // State

  /**
   * An array of threshold values to display marks on the progress line.
   */
  marks?: number[];
  /**
   * An array of references to the progress marks wrappers.
   */
  refs?: HTMLSpanElement[];

  // Other Props
  containerProps?: HTMLNeoBaseElement<HTMLElementTagNameMap[ContainerTag]> & HTMLTagProps<ContainerTag>;
} & NeoProgressBarStyle &
Omit<NeoProgressProps<Tag>, 'children'>;
