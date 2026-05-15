<script lang="ts">
  import type { NeoPortalContainerProps } from '~/floating/portal/neo-portail-container.model.js';
  import type { NeoPortalContext } from '~/floating/portal/neo-portal-context.svelte.js';

  import NeoPortalContainer from '~/floating/portal/NeoPortalContainer.svelte';
  import NeoPortalContextProbe from '~/floating/portal/NeoPortalContextProbe.test.svelte';

  type HarnessProps = Partial<NeoPortalContainerProps> & {
    onContext?: (ctx: NeoPortalContext | undefined) => void;
  };

  const { onContext, ...rest }: HarnessProps = $props();
</script>

<NeoPortalContainer {...rest}>
  {#if onContext}<NeoPortalContextProbe {onContext} />{/if}
  <span data-testid="portal-container-body">child</span>
</NeoPortalContainer>
