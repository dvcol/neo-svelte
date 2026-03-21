<script lang="ts">
  import type { NeoPortalProps } from '~/floating/portal/neo-portal.model.js';

  import { mount, unmount } from 'svelte';

  import { getNeoPortalContext } from '~/floating/portal/neo-portal-context.svelte.js';
  import NeoPortalTarget from '~/floating/portal/NeoPortalTarget.svelte';

  const { enabled = false, children, outro = true, target = document.body, anchor, ...rest }: NeoPortalProps = $props();

  const portalContext = getNeoPortalContext();

  let component: ReturnType<typeof mount>;
  $effect.pre(() => {
    if (!children || !enabled) return;

    component = mount(NeoPortalTarget, {
      target,
      anchor: anchor ?? portalContext?.ref,
      props: { children },
      ...rest,
    });

    return () => {
      if (!component) return;
      unmount(component, { outro });
    };
  });
</script>

{#if !enabled && children}
  {@render children()}
{/if}
