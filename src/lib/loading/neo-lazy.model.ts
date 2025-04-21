import type { Component, Snippet } from 'svelte';

import type { NeoSuspenseProps } from '~/loading/neo-suspense.model.js';

export type NeoLazyProps<Props extends Record<string, any> = object, Exports extends Record<string, any> = object, Bindings extends keyof Props | '' = string> = {
  /**
   * The component to lazy load.
   */
  component: Promise<{ default: Component<Props, Exports, Bindings> }>;
  /**
   * Optional props to pass to the component.
   */
  props?: Record<string, any>;
  /**
   * Children to render once the component is loaded.
   */
  children?: Snippet;
} & Omit<NeoSuspenseProps<{ default: Component<Props, Exports, Bindings> }>, 'promise'>;
