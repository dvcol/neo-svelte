import type { Snippet } from 'svelte';
import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';
import type { NeoTabProps, TabId } from '~/nav/neo-tab.model.js';
import type { NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps } from '~/utils/html-element.utils.js';
import type { ShadowElevation, ShadowElevationString } from '~/utils/shadow.utils.js';

export type NeoTabContextValue<Value = unknown> = { index: number; value?: Value; ref: HTMLElement };
export type OnChange<Value = unknown> = (tabId?: TabId, newValue?: NeoTabContextValue<Value>, oldValue?: NeoTabContextValue) => unknown;
export type OnClose<Value = unknown> = (tabId?: TabId, value?: NeoTabContextValue<Value>) => unknown;

export type NeoTabsSlideElevation = ShadowElevation | ShadowElevationString;
export type NeoTabsContainerProps = HTMLNeoBaseElement & HTMLActionProps;
export type NeoTabsProps<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets

  /**
   * Snippet to display as the tabs content.
   */
  children?: Snippet<[NeoTabsContext]>;
  /**
   * Optional snippet to expose context to other components.
   */
  panes?: Snippet<[NeoTabsContext]>;

  // States

  /**
   * The HTML tag to use for the tabs.
   * @default 'div'
   */
  tag?: Tag | keyof HTMLElementTagNameMap;

  // Styles

  /**
   * Whether to dim the opacity of inactive tabs on hover.
   *
   * @default true
   */
  dim?: boolean;
  /**
   * Display the active tab with a line.
   * Only applies when `slide` is `true`.
   *
   * @see slide
   */
  line?: boolean;
  /**
   * Display the active tab as a pill.
   * Only applies when `slide` is `true`.
   *
   * Cannot be used with `line`.
   *
   * @see line
   * @see slide
   */
  pill?: boolean;
  /**
   * If `true`, the panes will be displayed before the tabs.
   * @default false
   */
  before?: boolean;
  /**
   * Whether to animate the tab transition.
   */
  slideElevation?: NeoTabsSlideElevation;

  // Events

  /**
   * Event handler that fires when the active tab changes.
   */
  onchange?: OnChange<Value>;
  /**
   * Event handler that fires when any close button is clicked.
   */
  onclose?: OnClose<Value>;
  /**
   * Event handler that fires when the add button is clicked.
   */
  onadd?: NeoTabProps['onclick'];

  // Other props
  /**
   * Optional props to pass to the tabs container.
   */
  containerProps?: NeoTabsContainerProps & HTMLTagProps;
} & NeoTabsContext &
  Omit<NeoButtonGroupProps<Tag>, 'onchange' | 'children' | 'vertical' | 'ref'> &
  HTMLRefProps;
