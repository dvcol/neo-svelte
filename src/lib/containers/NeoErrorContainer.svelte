<script lang="ts">

  import type { NeoErrorContainerProps } from '~/containers/neo-error-container.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';

  const {
    children,
    pending,
    failed: _failed,

    handler = console.error,
  }: NeoErrorContainerProps = $props();
</script>

<svelte:boundary onerror={handler} {pending}>
  {@render children()}

  {#snippet failed(error, reset)}
    {#if _failed}
      {@render _failed({ error, reset })}
    {:else}
      <div class="neo-error-container">
        <h1>Something went wrong</h1>
        <p>{error instanceof Error ? error.message : String(error)}</p>
        <NeoButton color="error" text onclick={() => setTimeout(reset, 300)}>Try again</NeoButton>
      </div>
    {/if}

  {/snippet}
</svelte:boundary>

<style lang="scss">
  .neo-error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
  }
</style>
