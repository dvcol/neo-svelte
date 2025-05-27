import type { MarkTokenizer } from '@dvcol/common-utils/common/string';

import type { NeoHtmlProps } from '~/text/neo-html.model.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoMarkTokenizer = MarkTokenizer;
export type NeoMarkProps<Tag extends keyof HTMLElementTagNameMap = 'span'> = {
  /**
   * HTML tag to render
   *
   * @default 'span'
   */
  tag?: Tag;
  /**
   * Text to tokenize
   */
  value?: string;
  /**
   * Filter pattern
   */
  filter?: string;
  /**
   * Tokenizer function to split text and marks
   * @param str text to tokenize (value)
   * @param pattern filter pattern (filter)
   *
   * @returns array of [part, mark] tuples
   */
  tokenizer?: NeoMarkTokenizer;
  /**
   * Html rendering options.
   *
   * If falsy, value will be parsed as text content.
   * If truthy, value will be parsed as HTML.
   */
  html?: boolean | Omit<NeoHtmlProps, 'html'>;
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
