import type { mount, Snippet } from 'svelte';

export type NeoPortalMountOptions = Pick<Parameters<typeof mount>[1], 'target' | 'anchor' | 'context' | 'intro'>;

export interface NeoPortalUnmountOptions {
  outro?: boolean;
}

export type NeoPortalProps = {
  enabled?: boolean;
  children?: Snippet;
}
& Partial<NeoPortalMountOptions>
& NeoPortalUnmountOptions;
