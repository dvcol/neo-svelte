<script lang="ts">
  import type { NeoLazyProps } from '~/loading/neo-lazy.model.js';

  import NeoSuspense from '~/loading/NeoSuspense.svelte';

  const { component, props: _props, loading, error, children }: NeoLazyProps = $props();
</script>

<NeoSuspense promise={component} {loading} {error}>
  {#snippet result(Component)}
    <Component {..._props}>
      {@render children?.()}
    </Component>
  {/snippet}
</NeoSuspense>
