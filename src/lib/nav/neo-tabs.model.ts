import type { Snippet } from 'svelte';

import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';
import type { NeoTabProps, TabId } from '~/nav/neo-tab.model.js';
import type { NeoTabContext, NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps } from '~/utils/html-element.utils.js';
import type { ShadowElevation, ShadowElevationString } from '~/utils/shadow.utils.js';

export type { TabId } from '~/nav/neo-tab.model.js';

export interface NeoTabContextValue<Value = unknown> {
  index: number;
  value?: Value;
  ref?: HTMLElement;
}
export type OnChange<Id extends TabId, Value = unknown> = (tabId?: Id, newValue?: NeoTabContextValue<Value>, oldValue?: NeoTabContextValue<Value>) => unknown;
export type OnClose<Id extends TabId, Value = unknown> = (tabId?: Id, value?: NeoTabContextValue<Value>) => unknown;

export type NeoTabsSlideElevation = ShadowElevation | ShadowElevationString;
export type NeoTabsContainerProps = HTMLNeoBaseElement & HTMLActionProps;
export type NeoTabsProps<Id extends TabId, Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  // regs
  /**
   * The ref to the inner button group
   */
  groupRef?: NeoButtonGroupProps<Tag>['ref'];

  // Snippets

  /**
   * Snippet to display as the tabs content.
   */
  children?: Snippet<[NeoTabsContext<Id, Value>, NeoTabContext<Id, Value>]>;
  /**
   * Optional snippet to expose context to other components.
   */
  panes?: Snippet<[NeoTabsContext<Id, Value>, NeoTabContext<Id, Value>]>;

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
  onchange?: OnChange<Id, Value>;
  /**
   * Event handler that fires when any close button is clicked.
   */
  onclose?: OnClose<Id, Value>;
  /**
   * Event handler that fires when the add button is clicked.
   */
  onadd?: NeoTabProps<Id, Value>['onclick'];

  // Other props
  /**
   * Optional props to pass to the tabs container.
   */
  containerProps?: NeoTabsContainerProps & HTMLTagProps;
} & NeoTabsContext<Id, Value>
& Omit<NeoButtonGroupProps<Tag>, 'onchange' | 'children' | 'vertical' | 'ref'>
& HTMLRefProps;
