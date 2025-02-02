import type { HTMLAttributes } from 'svelte/elements';

export type HTMLNeoBaseElement<T extends HTMLElement = HTMLDivElement> = Partial<HTMLAttributes<T>>;

export type HTMLRefProps<T extends HTMLElement = HTMLElement> = {
  /**
   * Reference to the inner HTML element.
   */
  ref?: T;
};

export type HTMLFlexProps = {
  /**
   * Overrides the default flex value.
   */
  flex?: CSSStyleDeclaration['flex'];
  /**
   * Overrides the default align-items value.
   */
  align?: 'center' | 'start' | 'end' | CSSStyleDeclaration['alignItems'];
  /**
   * Overrides the default justify-content value.
   */
  justify?: 'center' | 'start' | 'end' | 'between' | 'around' | 'evenly' | CSSStyleDeclaration['justifyContent'];
};

export type SvelteEvent<E extends Event = Event, T extends EventTarget = any> = E & { currentTarget?: EventTarget & T };

export const getNextFocusableElement = (
  element?: Element | null,
  targets: string[] = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ],
): HTMLElement | null | undefined => element?.querySelector<HTMLElement>(targets.join(','));

export type MarkAndToken = { mark: string | false; token: string };
export type MarkTokenizer = (str?: string, pattern?: string, flags?: string) => MarkAndToken[];
export const markTokenizer: MarkTokenizer = (str = '', pattern, flags = 'gi') => {
  if (!pattern?.trim()) return [{ mark: false, token: str }];
  // Case-insensitive with capturing
  const regex = new RegExp(`(${pattern.trim()})`, flags);
  const result: MarkAndToken[] = [];

  let lastIndex = 0;
  str.replace(regex, (match, group, offset) => {
    // If no group, ignore result
    if (!group) return '';
    // Push the text before + match
    result.push({ mark: group, token: str.slice(lastIndex, offset) });
    // Update lastIndex to move past the match
    lastIndex = offset + group.length;
    return '';
  });
  // Push the remaining text
  result.push({ mark: false, token: str.slice(lastIndex) });
  return result;
};
