<script lang="ts">
  import { mount, unmount } from 'svelte';

  import type { Snippet } from 'svelte';

  import type { NeoPortalProps } from '~/floating/portal/neo-portal.model.js';

  const { enabled = false, children, props: _props, outro = true, target = document.body, ...rest }: NeoPortalProps = $props();

  let component: ReturnType<typeof mount>;
  $effect.pre(() => {
    if (!children || !enabled) return;
    component = mount(children, { target, props: _props, ...rest });

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
