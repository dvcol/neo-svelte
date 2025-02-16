import type { Snippet } from 'svelte';
import type { NeoProgressProps } from '~/progress/neo-progress.model.js';
import type { HTMLNeoBaseElement, HTMLTagProps } from '~/utils/html-element.utils.js';
import type { BlurElevation, BlurElevationString, ShadowShallowElevation, ShadowShallowElevationString } from '~/utils/shadow.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export type NeoProgressBlur = BlurElevation | BlurElevationString;
export type NeoProgressElevation = ShadowShallowElevation | ShadowShallowElevationString;

export type NeoProgressBarProps<Tag extends keyof HTMLElementTagNameMap = 'div', ContainerTag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets
  /**
   * Optional label to display above the progress.
   */
  label?: Snippet | string;
  /**
   * Optional tooltip to display on progress state.
   */
  tooltip?: Snippet | string;
  /**
   * Optional mark to display on progress threshold.
   */
  mark?: Snippet | string;

  // State

  marks?: number[];

  // Size
  /**
   * Optional width constraints.
   */
  width?: SizeInput<'width'>;
  /**
   * Optional height constraints.
   */
  height?: SizeInput<'height'>;

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
  rounded?: boolean;
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

  // Other Props
  containerProps: HTMLNeoBaseElement<HTMLElementTagNameMap[ContainerTag]> & HTMLTagProps<ContainerTag>;
} & NeoProgressProps<Tag>;
