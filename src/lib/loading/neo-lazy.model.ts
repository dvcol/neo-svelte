import type { Component, Snippet } from 'svelte';

import type { NeoSuspenseProps } from '~/loading/neo-suspense.model.js';

export type NeoLazyProps<Props extends Record<string, any> = object, Exports extends Record<string, any> = object, Bindings extends keyof Props | '' = string> = {
  component: Promise<{ default: Component<Props, Exports, Bindings> }>;
  props?: Record<string, any>;
  children?: Snippet;
} & Pick<NeoSuspenseProps<{ default: Component<Props, Exports, Bindings> }>, 'loading' | 'error'>;
