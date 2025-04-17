import type { HeightParams, WidthParams } from '@dvcol/svelte-utils/transition';
import type { Snippet } from 'svelte';

import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps } from '~/utils/html-element.utils.js';

export interface NeoCollapseContext {
  /**
   * Unique identifier of the collapsed section.
   */
  id: string;
  /**
   * Current state of the collapsed section.
   *
   * @default false
   */
  open: boolean;
  /**
   * Whether the collapse has an internal trigger.
   *
   * @default true (if the collapse has a label or description), false (if not)
   */
  trigger?: boolean;
  /**
   * Unique identifier of the trigger element if it exists.
   */
  triggerId?: string;
  /**
   * Whether the collapse opens horizontally or vertically.
   *
   * @default false
   */
  horizontal?: boolean;
  /**
   * Whether the collapse can be toggled.
   */
  disabled?: boolean;
  /**
   * Whether the collapse is readonly.
   */
  readonly?: boolean;
  /**
   * If true, the collapse will ignore any collapse group context.
   */
  standalone?: boolean;
  /**
   * Whether to show a divider between the trigger and the content.
   *
   * Note: Only works if the collapse has an internal trigger.
   */
  divider?: boolean;
  /**
   * Whether to unmount the collapsed content when closed.
   *
   * @default true
   */
  unmountOnClose?: boolean;
  /**
   * Whether to fade the collapsed content when transitioning (only if unmountOnClose is false).
   *
   * @see unmountOnClose
   * @default true
   */
  fade?: boolean;
}

export type NeoCollapseProps<Tag extends keyof HTMLElementTagNameMap = 'section'> = {
  // Snippets

  /**
   * The content of the collapsed section.
   */
  children?: Snippet<[NeoCollapseContext]>;
  /**
   * An optional label for the collapsed section's trigger.
   */
  label?: string | Snippet<[NeoCollapseContext]>;
  /**
   * An optional description for the collapsed section's trigger.
   */
  description?: string | Snippet<[NeoCollapseContext]>;

  // States

  /**
   * The HTML tag to use for the collapsed section.
   * @default 'section'
   */
  tag?: Tag;
  /**
   * Transition properties to pass to the collapse container.
   */
  transition?: WidthParams | HeightParams;

  // Other props

  /**
   * HTML reference to the trigger element if it exists.
   */
  triggerRef?: HTMLElement;
  /**
   * Props to pass to the internal trigger element if it exists.
   */
  triggerProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * Props to pass to the divider element if it exists
   * and the collapse has an internal trigger.
   *
   * @see divider
   * @see trigger
   */
  dividerProps?: NeoDividerProps;
  /**
   * Props to pass to the collapse container.
   */
  containerProps?: HTMLNeoBaseElement & HTMLTagProps;
} & Partial<Omit<NeoCollapseContext, 'trigger' | 'triggerId'>> &
HTMLRefProps &
HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;

export type NeoCollapseHTMLElement<Tag extends keyof HTMLElementTagNameMap = 'section'> = HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]> & {
  /**
   * Toggles the collapsed section.
   * @param open
   */
  toggle: (open?: boolean) => void;
};
