<script lang="ts">
  import type { NeoSuspenseProps } from '~/loading/neo-suspense.model.js';

  import { wait } from '@dvcol/common-utils/common/promise';
  import { onMount } from 'svelte';

  import NeoLoadingMatrix from '~/loading/NeoLoadingMatrix.svelte';

  const { promise, delay = 500, loading, result, error, children, matrixProps }: NeoSuspenseProps = $props();

  /**
   * `showLoading` is a seeded state, not a derived value: it starts at `!delay` and is later flipped by the `onMount` timer below.
   * Using `$derived(!delay)` would override the post-timer flip on each render.
   */
  // svelte-ignore state_referenced_locally
  let showLoading = $state(!delay);

  onMount(async () => {
    if (!delay) return;
    await wait(delay);
    showLoading = true;
  });
</script>

{#await promise}
  {#if showLoading}
    {#if loading && typeof loading === 'function'}
      {@render loading(promise)}
    {:else if loading !== false}
      <NeoLoadingMatrix {...matrixProps} />
    {/if}
  {/if}
{:then resolved}
  {#if result}
    {@render result(resolved?.default)}
  {:else if children}
    {@render children()}
  {/if}
{:catch err}
  {#if error}
    {@render error(err)}
  {:else}
    <p style="color: red">{err?.message ?? err}</p>
    {#if err?.stack}
      <p style="color: red">{err.stack}</p>
    {/if}
  {/if}
{/await}
