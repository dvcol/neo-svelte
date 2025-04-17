<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { NeoPortalProps } from '~/floating/portal/neo-portal.model.js';

  import { mount, unmount } from 'svelte';

  import { getNeoPortalContext } from '~/floating/portal/neo-portal-context.svelte.js';

  const { enabled = false, children, props: _props, outro = true, target = document.body, anchor, ...rest }: NeoPortalProps = $props();

  const portalContext = getNeoPortalContext();

  let component: ReturnType<typeof mount>;
  $effect.pre(() => {
    if (!children || !enabled) return;
    component = mount(children, { target, anchor: anchor ?? portalContext?.ref, props: _props, ...rest });

    return () => {
      if (!component) return;
      unmount(component, { outro });
    };
  });

  const snippet = $derived(children as Snippet<[typeof _props]>);
</script>

{#if !enabled && snippet}
  {@render snippet(_props)}
{/if}
