import type { mount, Snippet } from 'svelte';

export type NeoPortalChildren<Props extends Record<string, any>, Exports extends Record<string, any>> = Parameters<typeof mount<Props, Exports>>[0];
export type NeoPortalMountOptions<Props extends Record<string, any>, Exports extends Record<string, any>> = Parameters<
  typeof mount<Props, Exports>
>[1];

export interface NeoPortalUnmountOptions {
  outro?: boolean;
}

export type NeoPortalProps<Props extends Record<string, any> = Record<string, any>, Exports extends Record<string, any> = Record<string, any>> = {
  enabled?: boolean;
  children: NeoPortalChildren<Props, Exports> | Snippet<[NeoPortalMountOptions<Props, Exports>['props']]>;
} & Partial<NeoPortalMountOptions<Props, Exports>> &
NeoPortalUnmountOptions;
