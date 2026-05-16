import type { TypeWriterLine, TypewriterOptions } from '~/text/typewriter.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoTypewriterProps<Tag extends keyof HTMLElementTagNameMap = 'div', Value extends string | TypeWriterLine = string | TypeWriterLine> = {
  /**
   * The HTML tag to use for the wrapper element.
   * @default 'div'
   */
  tag?: Tag;

  /**
   * The line(s) to iterate over
   */
  value?: Value | Value[];

  /**
   * Whether to display a caret at the end of the text.
   */
  caret?: boolean;

  /**
   * Event handler that fires when the typewriter completes the last iteration.
   */
  onComplete?: () => void;
} & Pick<
  TypewriterOptions<Value[]>,
  'display' | 'speed' | 'typo' | 'pause' | 'iterations' | 'mode' | 'onTypo' | 'onStart' | 'onEnd' | 'onPause' | 'onType' | 'onAbort'
>
& HTMLRefProps<HTMLElementTagNameMap[Tag]>
& Omit<HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>, 'children'>;
