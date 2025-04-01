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
> &
  HTMLRefProps<HTMLElementTagNameMap[Tag]> &
  Omit<HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>, 'children'>;

export type NeoTypewriterHTMLElement<
  Tag extends keyof HTMLElementTagNameMap = 'div',
  Value extends string | TypeWriterLine = string | TypeWriterLine,
> = Partial<HTMLElementTagNameMap[Tag]> & {
  /**
   * Whether the typewriter is currently writing text.
   */
  writing?: boolean;
  /**
   * The promise that resolves when the typewriter completes writing text.
   */
  promise?: Promise<string | undefined>;
  /**
   * Writes the given value to the typewriter.
   * @param value
   */
  write: (value: Value | Value[]) => void;
  /**
   * Clears the typewriter and stops writing text.
   */
  abort: () => void;
};
