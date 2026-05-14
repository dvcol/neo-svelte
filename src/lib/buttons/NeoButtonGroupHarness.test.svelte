<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';

  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';

  type HarnessProps = Partial<NeoButtonGroupProps> & {
    body?: Snippet;
  };

  const { body, ...rest }: HarnessProps = $props();
</script>

<NeoButtonGroup {...rest}>
  {#if body}
    {@render body()}
  {:else}
    <button data-testid="grp-btn-1" type="button">one</button>
    <button data-testid="grp-btn-2" type="button">two</button>
  {/if}
</NeoButtonGroup>
